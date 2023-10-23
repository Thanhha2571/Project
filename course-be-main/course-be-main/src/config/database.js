const mongoose = require('mongoose')
// const uri_compass = "mongodb://localhost:27017/server-khoa-hoc"
const uri_atlas = "mongodb+srv://MealsTxuphong:Xuanphong123@cluster0.pyld4tk.mongodb.net/server-khoa-hoc?retryWrites=true&w=majority";
async function connect() {
    try {
        await mongoose.set('strictQuery', true);
        await mongoose.connect(uri_atlas, {
            useNewUrlParser: true
        })
        console.log('connect db success')
    } catch (error) {
        console.log('connect db error')
    }
};
module.exports = { connect };