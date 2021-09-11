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

        counter = 0

        # load all data
        await self.send_init_data(connection)

        while True:

            result = await connection.receive()

            # payload
            value = result[0].value.value
            asdu_address = result[0].asdu_address
            io_address = result[0].io_address

            type_name = Address.get_formatted_name(asdu_address,
                                                   io_address)

            self._event_client.register([
                hat.event.common.RegisterEvent(
                    # event_type=(*self._event_type_prefix,
                    #             'gateway', "data"),
                    event_type=(*self._event_type_prefix,
                                'gateway', type_name),
                    source_timestamp=None,
                    payload=hat.event.common.EventPayload(
                        type=hat.event.common.EventPayloadType.JSON,
                        data=value
                    )
                )
            ])

            # self._event_client.register([
            #     hat.event.common.RegisterEvent(
            #         event_type=(*self._event_type_prefix,
            #                     'gateway', 'data'),
            #         source_timestamp=None,
            #         payload=hat.event.common.EventPayload(
            #             type=hat.event.common.EventPayloadType.JSON,
            #             data=str(result)))])
            #
            # self._event_client.register([
            #     hat.event.common.RegisterEvent(
            #         event_type=(*self._event_type_prefix,
            #                     'gateway', 'counter'),
            #         source_timestamp=None,
            #         payload=hat.event.common.EventPayload(
            #             type=hat.event.common.EventPayloadType.JSON,
            #             data=counter))])
            #
            # self._event_client.register([
            #     hat.event.common.RegisterEvent(
            #         event_type=(*self._event_type_prefix,
            #                     'gateway', 'sw0'),
            #         source_timestamp=None,
            #         payload=hat.event.common.EventPayload(
            #             type=hat.event.common.EventPayloadType.JSON,
            #             data=counter + 5))])

            counter += 1

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

            self._event_client.register([
                hat.event.common.RegisterEvent(
                    # event_type=(*self._event_type_prefix,
                    #             'gateway', "data"),

                    # prefix = gateway, gateway, example, device,

                    event_type=(*self._event_type_prefix,
                                'gateway', type_name),
                    source_timestamp=None,
                    payload=hat.event.common.EventPayload(
                        type=hat.event.common.EventPayloadType.JSON,
                        # data=str(result)
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
                switch_val = e.payload.data["io"]
                command = hat.drivers.iec104.Command(
                    hat.drivers.iec104.Action.EXECUTE,
                    hat.drivers.iec104.SingleValue.OFF if switch_val == "1"
                    else hat.drivers.iec104.SingleValue.ON,
                    switch_asdu,
                    0,
                    None,
                    1
                )

                print("command", command)

                result = await connection.send_command(command)

                '''num of tries'''
                for i in range(4):
                    if result:
                        break

                    result = await connection.send_command(command)
