let mongoose = require('mongoose');

let RecordSchema = new mongoose.Schema({
    name: String,
    post_display_name: String,
    slug: String,
    created_at: String,
    updated_at: String,
    short_information: String,
    last_date: Date,
    more_data_html: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
});

module.exports = mongoose.model(
    'record', RecordSchema, 'Record');