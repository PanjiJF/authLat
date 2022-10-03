const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    first_name :{
        type: String,
        required: true
    },
    last_name :{
        type: String,
        default: null
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String,
        required : true
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        ref:"role"
    }
})

module.exports = mongoose.model("user", userSchema)