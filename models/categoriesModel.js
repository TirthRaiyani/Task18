const {Schema, mongoose} = require('mongoose')

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
})
const Categories = mongoose.model('Categories', categorySchema)

module.exports = Categories