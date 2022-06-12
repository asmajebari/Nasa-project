const http = require('http');

const app = require('./app');

const PORT = process.env.PORT || 8000;

const { loadPlanetsData } = require('./models/planets.model');

const server = http.createServer(app);

//we can't call await at the top level of a file =>  it needs to be inside of an async function
async function startServer() {
    await loadPlanetsData(); //we wait for the promise
    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
};
//waits for the promise to resolve before the listen call

startServer();






