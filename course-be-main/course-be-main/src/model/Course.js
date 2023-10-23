const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const CourseModel = new Schema({
    teacher_email: {
        type: String,
        required: true,
    },
    course_id: {
        type: String,
        required: true,
        unique: true
    },
    sub_id: {
        type: String,
        // required: true,
        // unique: true
    },
    course_name: {
        type: String,
        required: true,
    },
    course_description: {
        type: String,
        required: true
    },
    course_price: {
        type: String,
        required: true
    },
    dateStart: {
        type: String,
        // required: true
    },
    dateEnd: {
        type: String,
        // required: true
    },
    course_status: {
        type: Boolean,
        default: false
        // unique: true
    },
    course_image: {
        type: String
    },
    document_link: {
        type: String
    },
    course_slug: {
        type: String,
        slug: 'course_name'
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Course", CourseModel);