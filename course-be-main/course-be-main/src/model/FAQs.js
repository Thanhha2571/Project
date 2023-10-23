const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const FAQsModel = new Schema({
    faq_question: {
        type: String,
        required: true
    },
    faq_answer: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})
module.exports = mongoose.model('FAQs', FAQsModel)