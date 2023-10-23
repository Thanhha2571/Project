const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const HistoryCourseModel = new Schema({
    email: {
        type: String,
        required: true
    },
    course_id: {
        type: String,
        required: true,
    }

}, {
    timestamps: true
})
module.exports = mongoose.model('History', HistoryCourseModel)