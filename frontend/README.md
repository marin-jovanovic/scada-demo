base template used from 'Windmill Dashboard'

pr_scripts/ws.js
    establishes connection with backend

    contains mechanism for logging in on backend

    after establishing connection logs new data to eventManagerInstance
    using eventManagerInstance.emitEvent(element);

pr_scripts/eventManager.js
    start with 
        EventManager.vals = {}
        EventManager.new_vals = []

    when new val arrives
        update dict
            EventManager.vals = {a: 1}
            EventManager.new_vals = [a: 1]

    if @a arrives again 
        if val is different
            update .vals and .new_vals
        
        if val is same
            continue

    
