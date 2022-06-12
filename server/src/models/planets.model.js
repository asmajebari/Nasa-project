const { parse } = require('csv-parse');
const fs = require('fs');
const path = require('path');

const habitablePlanets = [];

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
            .on('data', (data) => {
                if (isHabitable(data)) {
                    habitablePlanets.push(data);
                }
            })
            .on('error', (err) => {
                console.log(err);
                reject(err);
            })
            .on('end', () => {
                /*
                console.log(habitablePlanets.map((planet) => {
                    return planet['kepler_name'];
                })) */
                console.log(habitablePlanets.length);
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
function getAllPlanets() {
    return habitablePlanets;
}

module.exports = {
    getAllPlanets,
    loadPlanetsData,
};


 