var express = require('express');
var router = express.Router();

router.get('/api/:id', function(req, res){

    let id = req.params.id;

    // console.log("get", id);


    const eventManager = require('../pr_scripts/eventManager');
    let eventManagerInstance = new eventManager().getInstance();
    

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    (async () => {
    
       await delay(1000);
    //    console.log("new vals", eventManagerInstance.getVals());

       res.json({
           id: eventManagerInstance.getValSingle(id)

       }


        );
    //    res.json({
    //     '/adapter/20;2': getRandomInt(50),
    //     '/adapter/20;3': 2.3,
    //    });
       
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