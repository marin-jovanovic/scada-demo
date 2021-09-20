"""
utils for address translations
"""
import asyncio

from hat.aio import run_asyncio
from hat.drivers import iec104

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


async def load_addresses(connection=None):
    global ADDRESSES

    if not connection:
        address = iec104.Address('127.0.0.1', 19999)

        connection = await iec104.connect(address)

    raw_data = await connection.interrogate(asdu_address=65535)

    for result in raw_data:
        asdu_address = result.asdu_address
        io_address = result.io_address

        ADDRESSES.append(Address(asdu_address, io_address))

    [print(i.formatted_name()) for i in ADDRESSES]


async def async_main():
    address = iec104.Address('127.0.0.1', 19999)
    connection = await iec104.connect(address)

    raw_data = await connection.interrogate(asdu_address=65535)
    print("r", raw_data)

    while True:

        try:

            print("fetch")
            raw_data = await connection.receive()
            print("r", raw_data)

        except ConnectionError:
            print("conn error")
            await asyncio.sleep(3)


def main():
    run_asyncio(async_main())


if __name__ == '__main__':
    main()
