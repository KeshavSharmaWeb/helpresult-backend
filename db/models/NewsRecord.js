let mongoose = require('mongoose');
//user schema 
const newsrecord = new mongoose.Schema({
    name: String,
    recordId: String,
    fillColor: String,
    datetime: String,
    box: Boolean
})

module.exports = mongoose.model('newsrecord', newsrecord, 'NewsRecord');