const router = require("express").Router();
const ctrl = require("../controllers/candidateController");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const { candidateSchema} = require("../validations/candidateValidation");


// View all Candidates
router.get("/", auth, ctrl.getAllCandidates);

//Add Candidates
router.get("/add", auth, ctrl.addCandidate);

// Create
router.post("/", auth, validate(candidateSchema),ctrl.create);

// Edit
router.get("/edit/:id", auth, ctrl.editCandidate);

// Delete
router.post("/update/:id", auth, validate(candidateSchema),ctrl.updateCandidate);

// Get one
router.get("/:id", auth, ctrl.getOneCandidate);

// Delete
router.delete("/:id", auth, ctrl.deleteCandidate);

module.exports = router;







