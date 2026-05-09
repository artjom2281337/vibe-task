const express = require("express");
const Application = require("../models/Application")
const applicationRouter = express.Router();
const auth = require ("../middleware/auth");

const statusList = ["applied", "interview", "evaluation", "accepted", "rejected"];

applicationRouter.get("/", auth, async (req, res) => {
    try {
        const result = await Application.find();
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(404).json({ msg: "Applications not found"});
    }
});

applicationRouter.get("/:id", auth, async (req, res) => {
    const id = req.params.id;
    try {
        const application = await Application.findById(id);
        if (application) {
            res.status(200).json(application);
        } else {
            res.status(404).json({ msg: "Application not found"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Invalid Id or server error"});
    }
});

applicationRouter.post("/", auth, async (req, res) => {
    if (req.body.candidateID && req.body.position && req.body.status && req.body.source && req.body.applied_at) {
        if (statusList.includes(req.body.status)) {
            const application = new Application({
                candidateID: req.body.candidateID,
                position: req.body.position,
                status: req.body.status,
                source: req.body.source,
                applied_at: req.body.applied_at
            });
            try {
                const result = await application.save();
                res.status(200).json(result);
                console.log(result);
            } catch (err) {
                res.status(500).json({msg: "Server error"});
                console.log(err);
            }
            } else {
                res.status(500).json({msg: "Invalid status"});
            }
        } else {
            res.status(500).json({msg: "Invalid data format"});
        }
    }
);

applicationRouter.patch("/:id/status", auth, async (req, res) => {
    const id = req.params.id;
    try {
        if (req.body.status && statusList.includes(req.body.status)) {
            const updated_status = await Application.findByIdAndUpdate(id, {status: req.body.status}, {new: true});
            res.status(200).json(updated_status);
        } else {
            res.status(500).json({msg: "invalid status"});
        }
    } catch (err) {
        res.status(500).json({msg: "Error"});
        console.log(err);
    }
});

applicationRouter.put("/:id", auth, async (req, res) => {
    const id = req.params.id;
    if (req.body.candidateID && req.body.position && req.body.status && req.body.source && req.body.applied_at) {
        if (statusList.includes(req.body.status)) {
            const updates = req.body;
            try {
                const result = await Application.updateOne({_id: id}, {$set: updates});
                res.status(200).json(result);
            } catch (err) {
                res.status(500).json({msg: "error"});
                console.log(err);
            }
        } else {
            res.status(500).json({msg: "invalid status"});
        }
    }
});

applicationRouter.delete("/:id", auth, async (req, res) => {
    const id = req.params.id;
    try {
        const result = await Application.deleteOne({_id: id});
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({msg: "error"});
    }
});
module.exports = applicationRouter;