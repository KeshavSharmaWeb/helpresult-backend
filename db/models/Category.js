let mongoose = require('mongoose');

let CategorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    date: String,
});

module.exports = mongoose.model(
    'category', CategorySchema, 'Category');