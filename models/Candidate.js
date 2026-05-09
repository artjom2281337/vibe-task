const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    age: Number,
    country: String,
    about: String,
    createdAt: Date
});

module.exports = mongoose.model("Candidate", candidateSchema);