var express = require('express');
var router = express.Router();

router.get('/api/:id', function(req, res){

    let id = req.params.id;

    const eventManager = require('../pr_scripts/eventManager');
    let eventManagerInstance = new eventManager().getInstance();
    
    const delay = ms => new Promise(res => setTimeout(res, ms));

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    (async () => {
    
       await delay(1000);
    
       res.json({
           id: eventManagerInstance.getValSingle(id),
       });
       
    })();

});

router.get('/api-all', function(req, res){

    const eventManager = require('../pr_scripts/eventManager');
    let eventManagerInstance = new eventManager().getInstance();
    
    const delay = ms => new Promise(res => setTimeout(res, ms));

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    (async () => {
    
       await delay(1000);
    
       res.json(
          eventManagerInstance.getVals()
       );
       
    })();

});

module.exports = router;