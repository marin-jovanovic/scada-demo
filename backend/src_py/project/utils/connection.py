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
    # host: 0.0.0.0
    # port: 19999
    connection = await iec104.connect(addr)

    # raw_data = await connection.interrogate(asdu_address=65535)
    # [print(i) for i in raw_data]
    # print()

    print("waiting")

    # result = await connection.receive()
    result = await connection.interrogate(asdu_address=65535)
    [print(i) for i in result]

    # conn2_future = asyncio.Future()
    # srv = await iec104.listen(conn2_future.set_result, addr)
    # conn1 = await iec104.connect(addr)
    # conn2 = await conn2_future
    #
    # data = iec104.Data(value=iec104.SingleValue.ON,
    #                    quality=iec104.Quality(invalid=False,
    #                                           not_topical=False,
    #                                           substituted=False,
    #                                           blocked=False,
    #                                           overflow=False),
    #                    time=None,
    #                    asdu_address=123,
    #                    io_address=321,
    #                    cause=iec104.Cause.SPONTANEOUS,
    #                    is_test=False)
    #
    # # send data from conn1 to conn2
    # conn1.notify_data_change([data])
    # result = await conn2.receive()
    # print(result)
    # assert result == [data]
    #
    # # send data from conn2 to conn1
    # conn2.notify_data_change([data])
    # result = await conn1.receive()
    # assert result == [data]
    #
    # await conn1.async_close()
    # await conn2.async_close()
    # await srv.async_close()

def main():
    hat.aio.run_asyncio(async_main())

if __name__ == '__main__':
    main()

