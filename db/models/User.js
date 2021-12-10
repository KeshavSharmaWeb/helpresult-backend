let mongoose = require('mongoose');
//user schema 
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    roles: [{type: String, required: true}],
    datetime: {type: String, required: true},
})

module.exports = mongoose.model('user', userSchema, 'User');