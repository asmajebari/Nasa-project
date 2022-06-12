const { getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById,
} = require('../../models/launches.model');

function httpGetAllLaunches(req, res) {//returns a response
    //return res.status(200).json(Array.from(launches.values()));
    return res.status(200).json(getAllLaunches());
    //controller shouldn't care where the data came from or the format
}

function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        }); //bad request
    }

    launch.launchDate = new Date(launch.launchDate);
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }

    addNewLaunch(launch);
    return res.status(201).json(launch);
}

function httpAbortLaunch(req, res) {
    const launchId = +req.params.id; //string => converted with the +


    //if launch doesn't exsit 
    if (!existsLaunchWithId(launchId)) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    }

    //if launche does exist
    const aborted = abortLaunchById(launchId);
    return res.status(200).json(aborted);
        
}


module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
}