var express = require('express');
var router = express.Router();

router.get('/api/:id', function(req, res){

    let id = req.params.id;

    console.log("get", id);

    const delay = ms => new Promise(res => setTimeout(res, ms));

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    (async () => {
    
       await delay(1000);

       res.json({
        '/adapter/20;2': getRandomInt(50),
        '/adapter/20;3': 2.3,
       });
       
    })();

});

module.exports = router;