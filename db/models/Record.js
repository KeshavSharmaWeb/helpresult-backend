let mongoose = require('mongoose');

let RecordSchema = new mongoose.Schema({
    acitve: Boolean,
    name: String,
    post_display_name: String,
    slug: String,
    created_at: String,
    updated_at: String,
    short_information: String,
    last_date: {type: Date, required: false},
    more_data_html: String,
    subCategory: {type: mongoose.Schema.Types.ObjectId, ref: 'SubCategory', required: false},
    categoryIds: [{type: String, required: true}],
});

module.exports = mongoose.model(
    'record', RecordSchema, 'Record');