let mongoose = require('mongoose');

let SubCategorySchema = new mongoose.Schema({
    name: String,
    slug: String,
    date: String,
});

module.exports = mongoose.model(
    'subcategory', SubCategorySchema, 'SubCategory');