const mongoose = require('mongoose');

// Create the schema
const requestSchema = new mongoose.Schema({
    api_key: String,
    instructions: String,
    attachment: String,
    attachment_type: String,
    objects_to_annotate: [String],
    with_labels: Boolean,
    callback_url: String,
    error_list: [String],
    completed: Boolean
})

module.exports = mongoose.model('tasks', requestSchema)