import hat.aio
import hat.event.common
import hat.gui.common
import hat.util
from hat import json

json_schema_id = None
json_schema_repo = None


async def create_subscription(conf):
    return hat.event.common.Subscription([('*',)])
    # return hat.event.common.Subscription([('otherway', '*')])


async def create_adapter(conf, event_client):
    """
    Creates new adapter object

    Args:
        conf: adapter configuration

    Returns:
        subscribed event types filter

    """

    adapter = Adapter()

    adapter._async_group = hat.aio.Group()
    adapter._event_client = event_client
    adapter._state = {}
    adapter._state_change_cb_registry = hat.util.CallbackRegistry()

    adapter._async_group.spawn(adapter._main_loop)

    return adapter


class Adapter(hat.gui.common.Adapter):
    """
    Adapter for reverse communication (frontend to backend)

    """

    @property
    def async_group(self):
        return self._async_group

    @property
    def state(self):
        return self._state

    def subscribe_to_state_change(self, callback):
        return self._state_change_cb_registry.register(callback)

    async def create_session(self, juggler_client):
        return Session(self, juggler_client,
                       self._async_group.create_subgroup())

    async def _main_loop(self):
        pass


class Session(hat.gui.common.AdapterSession):

    def __init__(self, adapter, juggler_client, group):
        self._adapter = adapter
        self._juggler_client = juggler_client
        self._async_group = group
        self._async_group.spawn(self._run)

    @property
    def async_group(self):
        return self._async_group

    async def _run(self):
        """
        Catcher for events fired in SPA

        """

        try:

            self._on_state_change()

            with self._adapter.subscribe_to_state_change(self._on_state_change):
                while True:
                    raw_data = await self._juggler_client.receive()

                    self._adapter._event_client.register(([
                        hat.event.common.RegisterEvent(
                            event_type=('gateway', 'gateway', 'example',
                                        'device', 'system', 'example'),
                            source_timestamp=None,
                            payload=hat.event.common.EventPayload(
                                type=hat.event.common.EventPayloadType.JSON,
                                data=raw_data
                            )
                        )
                    ]))

        except Exception as e:
            breakpoint()
            print(e)
            await self.wait_closing()

    def _on_state_change(self):
        self._juggler_client.set_local_data(self._adapter.state)
