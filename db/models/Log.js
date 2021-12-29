let mongoose = require('mongoose');
//user schema 
const logSchema = new mongoose.Schema({
    user: {type: String, required: true},
    action: {type: String, required: true},
    datetime: {type: String, required: true},
})

module.exports = mongoose.model('log', logSchema, 'Log');