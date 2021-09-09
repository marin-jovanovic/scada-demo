base template used from 'Windmill Dashboard'

pr_scripts/ws.js
    establishes connection with backend

    contains mechanism for logging in on backend

    after establishing connection logs new data to eventManagerInstance
    using eventManagerInstance.emitEvent(element);

    