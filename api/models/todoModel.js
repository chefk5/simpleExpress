// Import mongoose
    const mongoose = require("mongoose");
    mongoose.set('debug', true)
// Declare schema and assign Schema class
    const Schema = mongoose.Schema;

// Create Schema Instance and add schema propertise
    const TodoSchema = new Schema({
        note: {
            type:String,
            required:true
        },
        author:{
            type:String,
            required:true
        },
        createdOn: {
            type:Date,
            default:Date.now
        }
    });

// create and export model
module.exports = mongoose.model("todoModel", TodoSchema);