let mongoose = require('mongoose');

let RecordSchema = new mongoose.Schema({
    name: String,
    slug: String,
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    short_information: String,
    last_date: Date,
    more_data_html: String,
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'category' },
});

module.exports = mongoose.model(
    'record', RecordSchema, 'Record');