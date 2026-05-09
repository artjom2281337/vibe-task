const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const sendEmail = require("../utils/nodemailer");
const Validate = require("../validations/authValidation")
// Register
exports.register = async(req, res, next) => {
    try {
        const email = req.body.email.toLowerCase();
        const { password, confirmPassword } = req.body;

   // Check Password match
    if (password !== confirmPassword){
        req.flash("error", "Password do not match");
        return res.redirect("/auth/register");
    }
    
    // Check email exist
    const exists = await User.findOne({email});

    if (exists) {
        req.flash("error", "Email already exists");
        return res.redirect("/auth/register");
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 7);

    // Create user
    await User.create({
        email,
        password: hashPassword
    });

    sendEmail(
        email,
        "Your Account has been Created",
        "Welcome"
    ).catch(err => console.log("Email error", err.message));
    
    req.flash("success", "Account created")
    res.redirect("/dashboard")
    } catch (err) {
        next(err);
    }   
};

// Login
exports.login = async (req, res, next) => {
    try {
        const email = req.body.email.toLowerCase();
        const {password} = req.body;

        const user = await User.findOne({email});

        if (!user) {
            req.flash("error", "Invalid Login")
            return res.redirect("/auth/login")
        }
        
        //Compare password
        const comparePassword = await bcrypt.compare(password, user.password);

        if (!comparePassword) {
            req.flash("error", "Invalid credentials");
            return res.redirect("/auth/login")
        }

        // Create jwt token
        const token = jwt.sign(
            {id: user._id, email: user.email},
            process.env.JWT_SECRET,
            {expiresIn: "1d"}
        );

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "strict"
        });

        res.redirect("/dashboard");
    } catch (err) {
        next(err);
    }
};
