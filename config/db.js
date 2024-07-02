const mongoose = require('mongoose')
mongoose.set('strictQuery', true);

const connectDB = async () => {

    await mongoose.connect('mongodb://localhost:27017/task18').then(() => {
        console.log('Connected to MongoDB');
    })
}

module.exports = connectDB
