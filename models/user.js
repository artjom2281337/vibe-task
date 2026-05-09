const mongoose = require("mongoose");


// Schema
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    createdAt: Date
})


// Model
module.exports = mongoose.model("User", userSchema);