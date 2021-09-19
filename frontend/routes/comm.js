var express = require('express');
var router = express.Router();

router.get('/api/:id', function(req, res){

    let id = req.params.id;

    const eventManager = require('../pr_scripts/eventManager');
    let eventManagerInstance = new eventManager().getInstance();
    
    const delay = ms => new Promise(res => setTimeout(res, ms));

    (async () => {
    
       await delay(1000);
    
       res.json({
           value: eventManagerInstance.getValSingle(id),
       });
       
    })();

});

router.get('/api-single/:id', function(req, res){

    let id = req.params.id;

    const eventManager = require('../pr_scripts/eventManager');
    let eventManagerInstance = new eventManager().getInstance();
    
    (async () => {
        
       res.json({
           value: eventManagerInstance.getValSingle(id),
       });
       
    })();

});

router.get('/api-all', function(req, res){

    const eventManager = require('../pr_scripts/eventManager');
    let eventManagerInstance = new eventManager().getInstance();
    
    const delay = ms => new Promise(res => setTimeout(res, ms));

    // function getRandomInt(max) {
    //     return Math.floor(Math.random() * max);
    // }

    function sortObjectByKeys(o) {
        return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
    }

    (async () => {
        
       await delay(1000);
    
       res.json(
        sortObjectByKeys(eventManagerInstance.getVals())
        //   eventManagerInstance.getVals()
       );
       
    })();

});

router.get('/refresh', function(req, res){

    const eventManager = require('../pr_scripts/eventManager');
    let eventManagerInstance = new eventManager().getInstance();
    
    const webSocket = require('../pr_scripts/pure_ws');
    let webSocketInstance = new webSocket().getInstance();
    webSocketInstance.send_data("curr_data");

    (async () => {
            
       res.json(
        "done"
       );
       
    })();

});


module.exports = router;