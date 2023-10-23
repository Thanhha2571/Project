const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const SubjectModel = new Schema({
    teacher_email: {
        type: String,
        required: true
    },
    sub_id: {
        type: String,
        required: true,
        unique: true
    },
    sub_name: {
        type: String,
        required: true
    },
}, {
    timestamps: true
})
module.exports = mongoose.model('Subject', SubjectModel);