import os.path
from pathlib import Path
import asyncio
import click
import datetime
import logging
import pandapower.networks
import random
import sys
import time
import typing
import math
from hat import aio
from hat import json
from hat.drivers import iec104
import hat.drivers


mlog = logging.getLogger('simulator')
default_conf_path = '../conf.yaml'


class PandaPowerExample:
    # example of a simple network
    def __init__(self):
        self.net = pandapower.networks.example_simple()
        self.reference_net = self.net

    def get_ref_value(self, table, column, index):
        """

        Args:
            table: element of the network
            column: specific value that that element has
            index: which element of type 'table'

        """
        return getattr(self.net, table)[column][index]

    def get_value(self, table, column, index):
        return getattr(self.net, table)[column][index]

    def set_net_value_random(self, table, column, ref_value):
        getattr(self.net, table)[column] = max(
            random.uniform(ref_value * 0.75, ref_value * 1.25), 0)


def _ext_power_flow(net):
    pandapower.runpp(net)


async def async_main(conf):
    simulator = Simulator()
    simulator.pp = PandaPowerExample()

    simulator._points = conf['points']
    simulator._spontaneity = conf['spontaneity']

    address = iec104.Address(conf['address']['host'], conf['address']['port'])

    simulator._srv = await iec104.listen(
        connection_cb=simulator._connection_cb,
        addr=address,
        interrogate_cb=simulator._interrogate_cb,
        command_cb=simulator._command_cb)
    simulator._connections = set()

    # simulator._net = pandapower.networks.example_simple()

    simulator._async_group = aio.Group()
    simulator._executor = aio.create_executor()

    await simulator._executor(_ext_power_flow, simulator.pp.net)
    print("simulator::_executor DONE")
    simulator._state = {}
    for asdu in conf['points']:
        for io in conf['points'][asdu]:
            point_conf = conf['points'][asdu][io]
            table = getattr(simulator.pp.net, point_conf['table'])
            series = table[point_conf['property']]

            simulator.push_new_value_to_state(
                asdu,
                io,
                _104_value(series[point_conf['id']], point_conf['type']),
                iec104.Cause.INITIALIZED)


    print("conf -> state DONE")
    # state['0'] = {'0': Data(value=FloatingValue(value=6.7411152961887),
    #             cause=<Cause.INITIALIZED: 4>, timestamp=1632142984.2038605),
    #              '1': Data(value=FloatingValue(value=7.146882966888771),
    #               cause=<Cause.INITIALIZED: 4>,
    #             timestamp=1632142984.2039707)}
    # state['0']['0'] ) = Data(value=FloatingValue(value=6.7411152961887),
    #               cause=<Cause.INITIALIZED: 4>, timestamp=1632142984.2038605)

    # for i in state.items():
    #     print(i)
    #     break

    simulator._change_queue = aio.Queue()
    simulator._power_flow_queue = aio.Queue()

    simulator._async_group.spawn(simulator._spontaneous_loop)
    simulator._async_group.spawn(simulator._notification_loop)
    simulator._async_group.spawn(simulator._power_flow_loop)

    await simulator.wait_closed()


def check_difference(value_type, value_old, value_new):
    if value_type == hat.drivers.iec104.common.FloatingValue:
        return math.isclose(value_old.value, value_new.value, rel_tol=1e-5)
    elif value_type == hat.drivers.iec104.common.SingleValue:
        return value_old.value == value_new.value
    raise TypeError


class Simulator(aio.Resource):

    @property
    def async_group(self):
        return self._async_group

    async def _connection_cb(self, connection):
        print("connection callback CALL")
        self._connections.add(connection)
        connection.async_group.spawn(
            aio.call_on_cancel,
            lambda: self._connections.remove(connection))
        self.async_group.spawn(
            aio.call_on_cancel,
            lambda: self._connections.remove(connection))

    async def _interrogate_cb(self, _, asdu):
        print("interrogate callback CALL")
        data = self._data_from_state()
        if asdu == 0xFFFF:
            return data
        return [d._replace(cause=iec104.Cause.INTERROGATED_STATION)
                for d in data if d.asdu_address == asdu]

    async def _command_cb(self, _, commands):
        print("command callback CALL")
        for command in commands:
            if command.action != iec104.Action.EXECUTE:
                mlog.warning('received action %s, only EXECUTE is supported',
                             command.action)
                continue
            conf = self._points[command.asdu_address][command.io_address]

            series = getattr(self.pp.net, conf['table'])[conf['property']]

            # series = self.pp.get_value

            if conf['type'] == 'float':
                value = command.value
            elif conf['type'] == 'single':
                value = command.value == iec104.SingleValue.ON

            series[conf['id']] = value

            self.push_new_value_to_state(command.asdu_address,
                                         command.io_address,
                                         command.value,
                                         iec104.Cause.REMOTE_COMMAND)

        self._change_queue.put_nowait(None)
        self._power_flow_queue.put_nowait(None)
        return True

    async def _spontaneous_loop(self):
        while True:
            # print("sp_loop")
            await asyncio.sleep(random.gauss(self._spontaneity['mu'],
                                             self._spontaneity['sigma']))

            index_pool = []
            for index, _ in self.pp.net['gen'].iterrows():
                index_pool.append(index)

            index = random.choice(index_pool)
            data_point = ("gen", "p_mw")

            ref_value = self.pp.get_ref_value(*data_point, index)
            self.pp.set_net_value_random(*data_point, ref_value)

            self._change_queue.put_nowait(None)
            self._power_flow_queue.put_nowait(None)

            ########################## power_loop
            _ext_power_flow(self.pp.net)

            for asdu in self._points:
                for io in self._points[asdu]:

                    point_conf = self._points[asdu][io]
                    # { 'id': 0,
                    #   'property': 'p_mw',
                    #   'table': 'res_bus',
                    #   'type': 'float'
                    # }

                    table = self.pp.net[point_conf['table']]
                    #                      'res_bus'

                    series = table[point_conf['property']]
                    #                       'p_mw'

                    new_value = _104_value(series[point_conf['id']],
                                           point_conf['type'])
                    #                   point_conf['id'] = 0
                    # breakpoint()

                    old_data = json.get(self._state, [str(asdu), str(io)])
                    old_value = old_data.value
                    if not check_difference(
                            type(old_value),
                            old_value,
                            new_value):
                        self.push_new_value_to_state(asdu, io,
                                                     new_value,
                                                     iec104.Cause.SPONTANEOUS)

    async def _power_flow_loop(self):
        return
        # while True:
        #     # print([v for v in self._state['10']['0']])
        #     await self._power_flow_queue.get_until_empty()

    def push_new_value_to_state(self, asdu, io, value, cause):
        self._state = json.set_(
            self._state, [str(asdu), str(io)], Data(
                value=value,
                cause=cause,
                timestamp=time.time()))

    def _data_from_state(self):
        for asdu_str, substate in self._state.items():
            for io_str, data in substate.items():
                yield _104_data(data, int(asdu_str), int(io_str))

    async def _notification_loop(self):
        data = list(self._data_from_state())
        self._send(data)
        previous = set(data)
        while True:
            # print("nf loop")
            await self._change_queue.get()
            data = list(self._data_from_state())
            self._send([d for d in data if d not in previous])
            previous = set(data)

    def _send(self, data):
        for connection in self._connections:
            connection.notify_data_change(data)


class Data(typing.NamedTuple):
    value: iec104.DataValue
    cause: iec104.Cause
    timestamp: float


def _104_data(simulation_data, asdu, io):
    return iec104.Data(asdu_address=asdu,
                       io_address=io,
                       value=simulation_data.value,
                       cause=simulation_data.cause,
                       time=iec104.time_from_datetime(
                           datetime.datetime.utcfromtimestamp(
                               simulation_data.timestamp)),
                       quality=iec104.Quality(*([False] * 5)),
                       is_test=False)


def _104_value(value, type_104):
    if type_104 == 'float':
        return iec104.FloatingValue(value)
    if type_104 == 'single':
        return iec104.SingleValue.ON if value else iec104.SingleValue.OFF
    raise ValueError(f'{type_104}')


@click.command()
@click.option('--conf-path', type=Path, default=default_conf_path)
def main(conf_path):
    conf = json.decode_file(conf_path)
    aio.init_asyncio()
    aio.run_asyncio(async_main(conf))


if __name__ == '__main__':
    print("simulator started")
    sys.exit(main())
