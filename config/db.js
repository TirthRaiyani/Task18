const mongoose = require('mongoose')
const config = require('./config')

const connectDB = async () => {

    await mongoose.connect(config.DB_URL).then(() => {
        console.log('Connected to MongoDB');
    })
}

module.exports = connectDB
