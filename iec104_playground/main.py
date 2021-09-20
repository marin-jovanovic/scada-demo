import asyncio

from hat.aio import run_asyncio
from hat.drivers import iec104


async def async_main():
    address = iec104.Address('127.0.0.1', 19999)

    connection = await iec104.connect(address)

    command = iec104.Command(value=iec104.SingleValue.OFF,
                             asdu_address=30,
                             io_address=0,
                             action=iec104.Action.EXECUTE,
                             time=None,
                             qualifier=1)

    await connection.send_command(command)

    while True:
        await asyncio.sleep(1)

        result = await connection.receive()

        result = result[0]
        print(f"{result=}")

        value = result.value.value
        asdu_address = result.asdu_address
        io_address = result.io_address

        print(f"{value=}")
        print(f"{asdu_address=}")
        print(f"{io_address=}")

    # await conn1.async_close()


def main():
    run_asyncio(async_main())


if __name__ == '__main__':
    main()
