"""
connection util functions

"""
import asyncio

from hat.drivers import iec104
import hat.aio

async def establish_connection():
    address = iec104.Address('127.0.0.1', 19999)

    connection = await iec104.connect(address)

    return connection

async def async_main():
    addr = iec104.Address('127.0.0.1', 19999)

    connection = await iec104.connect(addr)


    print("waiting")

    # result = await connection.receive()
    result = await connection.interrogate(asdu_address=65535)
    [print(i) for i in result]


def main():
    hat.aio.run_asyncio(async_main())

if __name__ == '__main__':
    main()

