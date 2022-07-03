const axios = require('axios');

const launches = require('./launches.mongo');
const planets = require('./planets.mongo');
//const launches = new Map();

//let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"; 
/*
hard-coded launch:
const launch = {
    flightNumber: 100, //flight_number
    mission: 'Kepler Exploration X', //name
    rocket: 'Explorer IS1', //rocket.name
    launcheDate: new Date('December 27, 2030'), //date_local
    target: 'Kepler-442 b', //NA
    customers: ['ZTM', 'NASA'],//payload.customers for each payload
    upcoming: true, //upcoming
    success: true, //success
};

saveLaunch(launch);
*/


async function populateLaunches() {
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false,
            populate: [
                {
                    path: 'rocket',
                    select: {
                        'name':1
                    }
                },
                {
                    path: 'payloads',
                    select: {
                        'customers':1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed');
    }

    const launchDocs = response.data.docs //data coming from the body of the response
    for (const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        })
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        };
        await saveLaunch(launch);    
        console.log(`${launch.flightNumber} ${launch.mission}`);
    }
}

async function loadLaunchesData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    });
    if (firstLaunch) {
        console.log('Launch data was already loaded!');
    } else {
       await populateLaunches();
    }
    
    console.log("Downloading launch data... ");
}

//launches.set(launch.flightNumber, launch); : using the map

async function findLaunch(filter){
    return await launches.findOne(filter);
}

async function existsLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
}

async function getLatestFlightNumber() {
    const latestLaunch = await launches
        .findOne()
        .sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}
async function getAllLaunches(skip, limit) {
   // return Array.from(launches.values());
    return await launches.
        find({}, { '_id': 0, '__v': 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch) {
    //par1: if the data already exists,
    //we update it, otherwise, we insert with the 2nd par
    await launches.findOneAndUpdate({
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    }); //better than updateOne bc it will only return properties set in the update(in the launch object)
}

async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });
    if (!planet) {
        throw new Error('No matching planet found!');
    }

    const newFlightNumber = await getLatestFlightNumber() + 1
    const newLaunch = Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["ZTM", "NASA"],
      flightNumber: newFlightNumber,
    });

    await saveLaunch(newLaunch);
}

/* function addNewLaunch(launch) {
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            success: true,
            upcoming:true,
            customers: ['ZTM', 'NASA'],
            flightNumber: latestFlightNumber,
        })//adding fields besides the ones sent by the client
    );
} */ 

async function abortLaunchById(launchId) {
    const aborted = await launches.updateOne({
        flightNumber: launchId,
    }, {
        upcoming: false,
        success: false
    });
    /* const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted; */
    return aborted.modifiedCount === 1;
}


module.exports = {
    loadLaunchesData,
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}
