var express = require('express');
var router = express.Router();
// const eventManager = require('../eventManager');
// let eventManagerInstance = eventManager().getInstance();

const eventManager = require('../pr_scripts/eventManager');
let eventManagerInstance = new eventManager().getInstance();

router.get('/', function(req, res, next) {

    res.render('home', {
        title: 'Home',
        linkActive: 'home',
        updates: eventManagerInstance.getVals(),
    });


    // res.reload();

});

module.exports = router;