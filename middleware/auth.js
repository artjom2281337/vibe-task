const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if(!token){
        req.flash("error", "Please login first");
        return res.redirect("/auth/login")
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.clearCookie("token");
        req.flash("error", "Session expired. Please, login again.")
        return res.redirect("/auth/login")
    }
    
}