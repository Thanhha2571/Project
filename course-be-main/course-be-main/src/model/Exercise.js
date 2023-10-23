const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const slug = require('mongoose-slug-generator');
mongoose.plugin(slug);
const ExerciseModel = new Schema({
    teacher_email: {
        type: String,
        required: true,
    },
    lecture_id: {
        type: String,
        required: true,
        // unique: true
    },
    ex_id: {
        type: String,
        required: true,
        unique: true
    },
    ex_name: {
        type: String,
        required: true,
    },
    ex_question: {
        type: [Object],
    },
    ex_slug: {
        type: String,
        slug: 'ex_name',
    }
}, {
    timestamps: true
});
module.exports = mongoose.model("Exercise", ExerciseModel);