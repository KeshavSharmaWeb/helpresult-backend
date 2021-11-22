let mongoose = require('mongoose');

let CategorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model(
    'category', CategorySchema, 'Category');