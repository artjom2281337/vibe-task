const Candidate = require("../models/Candidate");
const Application = require("../models/Application");
const {Note} = require("../models/note");
const sendEmail = require("../utils/nodemailer");


// Get All Candidates
exports.getAllCandidates = async(req, res, next) => {
    try {
        const candidates = await Candidate.find().lean();
        res.render("candidates", { candidates });
    } catch (err) {
        next(err);
    }
};

// Get One Candidate
exports.getOneCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id).lean();
        const applicationID = (await Application.findOne({candidateID: req.params.id}, {id: 1}).lean())._id;

        if (!candidate) {
            req.flash("error", "Candidate not found");
            return res.redirect("/candidates/view")
        }

        res.render("candidate", { candidate, applicationID });
    }catch (err){
        next(err);
    }
};

// Add Form
exports.addCandidate = (req, res) => {
    res.render("addCandidate");
};

//Create Add Form
exports.create = async (req, res, next) => {
    try {
        req.body.skills = req.body.skills
        ? req.body.skills.split(",").map(s => s.trim())
        : [];

        const exists = await Candidate.findOne({email: req.body.email});
        if (exists) {
            req.flash("error", "Invalid request");
            return res.redirect("/candidates/add");
        }

        const candidate = await Candidate.create(req.body);

        // Email Notification
        sendEmail(
            candidate.email,
            "Welcome",
            `Hello ${candidate.name}, your profile has been created successfuly.`
        ).catch(err => console.log("Email error", err.message));

        req.flash("success", "Candidate created successfully");
        res.redirect("/candidates/view");
    } catch (err) {
        next(err);
    }
};

// Edit Form
exports.editCandidate = async (req, res, next) => {
    try {
        const candidate = await Candidate.findById(req.params.id);

        if (!candidate) {
            req.flash("error", "Candidate not found");
            return res.redirect("/candidates/view");
        }

        res.render("editCandidate", { candidate });
    }catch (err){
        next(err);
    }
};

//Update Form
exports.updateCandidate = async (req, res, next) => {
    try {
        req.body.skills = req.body.skills
        ? req.body.skills.split(",").map(s => s.trim())
        : [];

        const exists = await Candidate.findOne({
            email: req.body.email,
            _id: { $ne: req.params.id}
        });

        if (exists) {
            req.flash("error", "Invalid Request");
            return res.redirect(`/candidates/edit/${req.params.id}`);
        }

        const updated = await Candidate.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updated) {
            req.flash("error", "Candidate not found");
            return res.redirect("/candidates/view")
        }

        req.flash("success", "Candidate updated");
        res.redirect("/candidates/view")
    } catch(err) {
        next(err);
    }
};

// Delete Form
exports.deleteForm = async (req, res, next) => {
    try{
        const deleted = await Candidate.findByIdAndDelete(req.params.id);

        if (!deleted) {
            req.flash("error", "Candidate not found");
            return res.redirect("/candidates/view");
        }

        req.flash("success", "Candidate deleted successfully");
        res.redirect("/candidates/view");
    } catch (err) {
        next(err);
    }
};

exports.deleteCandidate = async (req, res, next) => {
    try{
        let deleted = await Candidate.findOneAndDelete({_id: req.params.id}).lean();

        if (!deleted) {
            req.flash("error", "Candidate not found");
            return res.redirect("/candidates");
        }

        req.flash("success", "Candidate deleted successfully");

        deleted = await Application.findOneAndDelete({candidateID: req.params.id}).lean();

        if (deleted) {
            await Note.deleteMany({applicationID: deleted._id});
        } else {
            req.flash("error", "Candidate doesn't have application");
            return res.redirect("/candidates");
        }

        res.redirect("/candidates");
    } catch (err) {
        next(err);
    }
}