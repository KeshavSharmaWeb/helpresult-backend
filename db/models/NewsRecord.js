let mongoose = require('mongoose');
//user schema 
const newsrecord = new mongoose.Schema({
    name: String,
    recordId: String,
    fillColor: String,
    datetime: String
})

module.exports = mongoose.model('newsrecord', newsrecord, 'NewsRecord');