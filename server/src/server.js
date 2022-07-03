const http = require('http');

require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchesData } = require('./models/launches.model');

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

//we can't call await at the top level of a file =>  it needs to be inside of an async function
async function startServer() {
    await mongoConnect();
    await loadPlanetsData(); //we wait for the promise
    await loadLaunchesData();
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
};
//waits for the promise to resolve before the listen call

startServer();






