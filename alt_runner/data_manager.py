"""
utils for address translations
"""

from hat.aio import run_asyncio
from hat.drivers import iec104
from collections import defaultdict

ADDRESSES = []


class Address:

    @staticmethod
    def get_formatted_name(asdu_address, io_address):
        return str(asdu_address) + ";" + str(io_address)

    def __init__(self, asdu_address, io_address):
        self.asdu_address = asdu_address
        self.io_address = io_address

    def __str__(self):
        return f"{self.asdu_address=} {self.io_address=}"

    def formatted_name(self):
        return Address.get_formatted_name(self.asdu_address, self.io_address)


async def init_data_manager():
    data_manager = DataManager("127.0.0.1", 19999)

    data_manager.connection = await data_manager.connect()

    return data_manager

class DataManager:

    def __init__(self, domain_name, port):
        self.domain_name = domain_name
        self.port = port

    async def get_init_data(self):
        raw_data = await self.connection.interrogate(asdu_address=65535)

        t = {}

        for i in raw_data:
            t[(i.asdu_address, i.io_address)] = i.value

        return t

    async def get_curr_data(self):
        raw_data = await self.connection.receive()

        t = {}

        for i in raw_data:
            t[(i.asdu_address, i.io_address)] = i.value

        return t

    async def connect(self):
        address = iec104.Address(self.domain_name, self.port)

        while True:
            connection = await iec104.connect(address)
            return connection

            # try:
            #     connection = await iec104.connect(address)
            #     return connection
            # except:
            #     n = 3
            #     for i in range(n):
            #         print("trying to reconnect in", n - i)
            #         await asyncio.sleep(1)
            #     print("reconnecting\n")

    async def send_data(self, value, asdu, io):
        from hat.drivers import iec104
        print(value)

        # print(message)
        print(asdu, io, value, type(value))

        asdu = int(asdu)
        io = int(io)

        if value == "closed":
            val = iec104.common.SingleValue.OFF
        else:
            val = iec104.common.SingleValue.ON

        command = iec104.Command(
            value=val,
            asdu_address=asdu,
            io_address=io,
            action=iec104.Action.EXECUTE,
            time=None,
            qualifier=1
        )

        print("command", command)

        await self.connection.send_command(command)




async def async_main():

    data_manager = await init_data_manager()

    t = await data_manager.get_init_data()
    print("init data")
    [print(i) for i in t]

    t = await data_manager.get_curr_data()
    print("curr data")
    [print(i) for i in t]

    #
    # connection = await connect()
    #
    # raw_data = await connection.interrogate(asdu_address=65535)
    #
    # print("init data send", len(raw_data))
    # print("fetch")
    #
    # while True:
    #
    #     try:
    #         raw_data = await connection.receive()
    #         print("r", len(raw_data))
    #
    #     except ConnectionError:
    #         connection = connect()


def main():
    run_asyncio(async_main())


if __name__ == '__main__':
    main()


