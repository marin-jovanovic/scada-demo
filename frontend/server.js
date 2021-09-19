const express = require('express');
const app = express();
var path = require('path');

const WebSocketManager = require("./pr_scripts/pure_ws");
let webSocketManager = new WebSocketManager();
// let webSocketManagerInstance = webSocketManager.getInstance();

// const eventManager = require('./pr_scripts/eventManager');
// let eventManagerInstance = new eventManager().getInstance();


const homeRouter = require('./routes/home');
const commonRouter = require('./routes/comm');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
    extended: true
}));

app.use("/", homeRouter);
app.use("/", commonRouter);

app.listen(3000);
