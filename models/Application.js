const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    candidateID: String,
    position: String,
    status: String,
    startDate: Date,
    minimalPay: Number,
    maximalPay: Number,
    skills: String,
    experience: String
});

module.exports = mongoose.model("Application", applicationSchema);