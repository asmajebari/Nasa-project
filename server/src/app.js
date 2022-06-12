const path = require('path');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const planetsRouter = require('./routes/planets/planets.router'); 
const launchesRouter = require('./routes/launches/launches.router');
const app = express(); 

//chain of middleware:
//request comes in to express, gets checked for the json content type,
//goes through the express router

app.use(cors({
    origin: 'http://localhost:3000',
}));

app.use(morgan('combined'));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public'))); //serve the public files

app.use('/planets',planetsRouter);
app.use('/launches', launchesRouter);
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
})

module.exports = app;