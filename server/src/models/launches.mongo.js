const mongoose = require('mongoose');

const launchesSchema = new mongoose.Schema({
    flightNumber: {
        type: Number,
        required: true,
    },
    launchDate: {
        type: Date,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    rocket: {
        type: String, 
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    customers: [ String ],
    upcoming: {
        type: Boolean, 
        required: true, 
    },
    success: {
        type: Boolean, 
        required: true, 
        default: true,
    },
    
});

module.exports = mongoose.model('Launch', launchesSchema);
//=> compiling the model (mongoose):
//we cretaed an object that will allow us to write and read documents in our launches collection
//we use the model by exporting it
//first arg: singular name of the collection
//mongoose lower cases it and pluralise it and talks with the collection using it: connects launchesSchema
//with th "launches" collection