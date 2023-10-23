const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const LectureModel = new Schema({
    teacher_email: {
        type: String,
        required: true,
    },
    course_id: {
        type: String,
        required: true,
    },
    lecture_id: {
        type: String,
        // required: true,
        // unique: true
    },
    lecture_name: {
        type: String,
        required: true,
    },
    lecture_content: {
        type: String,
        required: true
    },
    lecture_image: {
        type: [String]
    },
    lecture_document: {
        type: String
    },
    lecture_slug: {
        type: String,
        slug: 'lecture_name',
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Lecture", LectureModel);