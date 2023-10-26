const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug);

// const MarkModel = new Schema({
//     course_NameDetail: {
//         type: String,
//         // required: true,
//         // unique: true
//     },
//     // mark_id :{
//     //     type: String,
//     //     required: true,
//     //     unique: true
        
//     // },
//     lecture_NameDetail: {
//         type: String,
       
//     },
//     student_emailDeatail : {
//         type: String,
//     },
//     MarkStudent : {
//         type: Number,
//         // required: true
//     },
    
//     // mark_slug: {
//     //     type: String,
//     //     slug: 'course_name'
//     // }
// },);

// // module.exports = mongoose.model("Mark", MarkModel);

// const MarkModelST = mongoose.model("Mark", MarkModel);
// module.exports = MarkModelST

// const slug = require('mongoose-slug-generator');
// mongoose.plugin(slug);
const MarkModel = new Schema({
    student_email: {
        type: String,
        required: true,
    },
    lecture_name: {
        type: String,
        required: true,
    },
    course_name: {
        type: String,
        required: true,
    },
    
    mark: {
        type: String,
        required: true
    },
    
    
}, {
    timestamps: true
});
module.exports = mongoose.model("mark", MarkModel);