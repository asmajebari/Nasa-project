const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const planets = require('./planets.mongo');

function isHabitable(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6;
}

/*
const promise = new Promise((resolve, reject) = > {
    resolve(42); //42 is bassed as a result when we call promise.then
});

promise.then(result) => {
    
});

const result = await.promise; // await the result of the promise 
//the code would block the promise to resolve before continuing


*/

function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        fs.createReadStream(path.join(__dirname, '..', '..', 'data', 'kepler_data.csv')) //gives an event emitter
            .pipe(parse({
                comment: '#',
                columns: true,
            })) //connecting the two strams together (readable stream source
            //to writable stream destination)
            .on('data', async (data) => {
                if (isHabitable(data)) {
                    savePlanet(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', async () => {
                /*
                console.log(habitablePlanets.map((planet) => {
                    return planet['kepler_name'];
                })) */
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`Found ${countPlanetsFound} habitable planets.`);
                resolve(); //we're not passing anything as a result into the resolve function
                //because we're setting the habitableplanets array

            });
    });
};


//we return a promise which resolves when our habitable planets have been found
//we'll wait for the promise to resolve before listening to requets from the server



//It's a good idea to stream large data sets
//the reutrn value from the csv-parse module is a function:

//parse();
/*returns an event emitter that deals with streams of data coming in
from that file
it only deals with streams so we need to use the node's built in
file system module (fs) */

//the module exports the planets befpre they necessarily been loaded because
// the streams are read asynchronously
//the code is ran when we require the module from the controller
//if the request comes in from the frontend, the data might not have been loaded yet
// => we light get an empty list of planets => we create a js promise for the loading code
//and we wait for the promise to resolve before accepting any incoming requests

/*function getAllPlanets() {
    return habitablePlanets;
}
*/

async function getAllPlanets() {
    return await planets.find({}, {
        '_id': 0, '__v':0,
    });
}

async function savePlanet(planet) {
    try {
        //we use upsert: insert + update: so that the function loadPlanetsData doesnt
    //upload the same data many times instead of create
    await planets.updateOne(
        {
          keplerName: planet.kepler_name,
        },
        {
          keplerName: planet.kepler_name,
        },
        {
          upsert: true,
        }
      );
    } catch (err) {
        console.log(`Could not save planet ${err}`);
    }

    
}

module.exports = {
    getAllPlanets,
    loadPlanetsData,
};


 