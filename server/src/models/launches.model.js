const launches = require('./launches.mongo');

//const launches = new Map();

//let latestFlightNumber = 100;
const DEFAULT_FLIGHT_NUMBER = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launcheDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b', 
    customers: ['ZTM', 'NASA'],
    upcoming: true,
    success: true,
};

saveLaunch(launch);

//launches.set(launch.flightNumber, launch); : using the map

async function existsLaunchWithId(launchId) {
    return await launches.findOne({
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
async function getAllLaunches() {
   // return Array.from(launches.values());
    return await launches.
        find({}, {'_id':0, '__v':0 });
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
    existsLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
}
