import asyncio

import hat.aio
import hat.event.common
import hat.gateway.common
from hat.drivers import iec104

from project.utils.address_manager import Address
from project.utils.connection import establish_connection

json_schema_id = None
json_schema_repo = None
device_type = 'example'


async def create(conf, event_client, event_type_prefix):
    device = Device()

    device._async_group = hat.aio.Group()
    device._event_client = event_client
    device._event_type_prefix = event_type_prefix
    device._async_group.spawn(device._main_loop)

    device._async_group.spawn(device._feedback_loop)

    return device


class Device(hat.gateway.common.Device):

    @property
    def async_group(self):
        return self._async_group

    async def _main_loop(self):
        """
        establishes connection
        receives data from network and sends it to module

        """

        connection = await establish_connection()

        await asyncio.sleep(3)

        # load all data
        await self.send_init_data(connection)

        # breakpoint()
        # with open("log.txt", "a") as myfile:
        #     myfile.write(str([type_name, value]))
        #     myfile.write("\n")

        while True:

            result = await connection.receive()


            asdu_address = result[0].asdu_address
            io_address = result[0].io_address

            type_name = Address.get_formatted_name(asdu_address,
                                                   io_address)
            value = result[0].value.value

            with open("log.txt", "a") as myfile:
                myfile.write(str((type_name, value)))
                myfile.write("\n")
            await self.register(type_name, value)

    async def send_init_data(self, connection):
        """
        gets all initial (current) data
        """

        raw_data = await connection.interrogate(asdu_address=65535)

        for result in raw_data:

            value = result.value.value

            asdu_address = result.asdu_address
            io_address = result.io_address

            type_name = Address.get_formatted_name(asdu_address,
                                                   io_address)
            print(type_name, value)
            with open("log.txt", "a") as myfile:
                myfile.write(str(("init---", type_name, value)))
                myfile.write("\n")

            await self.register(type_name, value)

    async def register(self, type_name, value):
        self._event_client.register([
            hat.event.common.RegisterEvent(
                event_type=(*self._event_type_prefix,
                            'gateway', type_name),
                source_timestamp=None,
                payload=hat.event.common.EventPayload(
                    type=hat.event.common.EventPayloadType.JSON,
                    data=value
                )
            )
        ])

    async def _feedback_loop(self):
        """
        reverse communication
        tries 3 times to update network with sent params
        """

        address = hat.drivers.iec104.Address("127.0.0.1", 19999)
        connection = await hat.drivers.iec104.connect(address)

        while True:
            events = await self._event_client.receive()

            for e in events:
                switch_asdu = e.payload.data["asdu"]
                switch_val = e.payload.data["value"]

                print("type", type(switch_val), switch_val)

                val = hat.drivers.iec104.SingleValue.OFF if switch_val == 0 \
                    else hat.drivers.iec104.SingleValue.ON

                command = iec104.Command(
                    action=iec104.Action.EXECUTE,
                    value=val,
                    asdu_address=switch_asdu,
                    io_address=0,
                    time=None,
                    qualifier=1,
                )

                print("command", command)

                result = await connection.send_command(command)

                '''num of tries'''
                for i in range(4):
                    if result:
                        break

                    result = await connection.send_command(command)
