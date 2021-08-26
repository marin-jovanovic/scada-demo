"""
connection util functions

"""

from hat.drivers import iec104


async def establish_connection():
    address = iec104.Address('127.0.0.1', 19999)

    connection = await iec104.connect(address)

    return connection
