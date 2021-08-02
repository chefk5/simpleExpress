'use strict'

// require express and bodyParser
const  express = require("express");
const  bodyParser = require("body-parser");
require('dotenv').config()

require("./config/db"); 


// create express app
const app = express();

// define port to run express app
const  port = process.env.PORT || 3000;

// use bodyParser middleware on express app
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

// Add endpoint
// app.get('/', (req, res) => {
// res.send("Hello World");
// });
var routes = require('./api/routes/todoRoutes'); //importing route
routes(app);
// Listen to server
app.listen(port, () => {
console.log(`Server running at http://localhost:${port}`);
});