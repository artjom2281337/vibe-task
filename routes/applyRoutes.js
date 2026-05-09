const router = require("express").Router();
const Candidate = require("../models/Candidate");
const Application = require("../models/Application");

router.post("/candidate", async (req, res) => {
    const candidate = await Candidate.create({
        name: req.body["first-name"] + " " + req.body["last-name"],
        email: req.body["email-address"],
        phone: req.body["phone-number"],
        country: req.body["country"],
        age: req.body["age"],
        about: req.body["about"],
        createdAt: new Date()
    })

    res.redirect(307, `/api/apply/application/${candidate.id}`);
})

router.post("/application/:id", async (req, res) => {
    const candidateID = req.params.id;
    
    const application = await Application.create({
        candidateID,
        position: req.body["position"],
        status: "applied",
        startDate: req.body["start-date"],
        minimalPay: req.body["min-pay"],
        maximalPay: req.body["max-pay"],
        skills: req.body["skills"],
        experience: req.body["experience"]
    })

    res.redirect("/api/apply/thankyou");
})

router.get("/thankyou", (req, res) => {
    res.render("thankyou", {
        layout: false
    })
})

module.exports = router;