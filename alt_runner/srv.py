import asyncio
import websockets

from data_manager import init_data_manager
from hat.aio import run_asyncio

import nest_asyncio

class Server:

    async def echo(self, websocket, path):
        async for message in websocket:

            if message == "init_data":
                await websocket.send(str(await self.data_manager.get_init_data()))

            elif message == "curr_data":
                await websocket.send(str(await self.data_manager.get_curr_data()))

            else:
                await websocket.send(str("joiajidoioa"))

    async def init_data_manager(self):
        self.data_manager = await init_data_manager()


async def init_server():
    server = Server()
    await server.init_data_manager()
    print("data manager configured")

    print("connect on ws://localhost:8765")

    asyncio.get_event_loop().run_until_complete(
        websockets.serve(server.echo, 'localhost', 8765))
    asyncio.get_event_loop().run_forever()

    return server


async def async_main():
    await init_server()


def main():
    run_asyncio(async_main())


if __name__ == '__main__':
    nest_asyncio.apply()

    main()
