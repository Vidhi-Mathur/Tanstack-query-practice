/* eslint-disable no-undef */
const express = require('express');
const app = express()
const bodyParser = require('body-parser')
const eventRoutes = require('./routes/event-routes')

//Setting views
app.use(express.static('public'))

//Parsing
app.use(bodyParser.json())

//Setting headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS'); // Combined methods into one string
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type'); // Combined headers into one string
    next();
});

//Forwarding
app.use('/events', eventRoutes)


//Listening to server 
app.listen(3000)