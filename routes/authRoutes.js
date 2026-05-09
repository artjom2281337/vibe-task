const router = require("express").Router();
const ctrl = require("../controllers/authContoller")
const validate = require("../middleware/validate")
const {registerSchema, loginSchema } = require("../validations/authValidation");


// Show Login
router.get("/login", (req, res) => {
    res.render("login" , {
        style: "auth"
    })
});

//Login
router.post("/login", validate(loginSchema), ctrl.login);

// Show Register
router.get("/register", (req, res) => {
    res.render("register", {
        style: "auth"
    })
})

// Register
router.post("/register", validate(registerSchema), ctrl.register);

// Logout
router.get("/logout", (req, res) => {
    res.locals.user = null;
    res.clearCookie("token");
    res.redirect("/auth/login");
})

module.exports = router;