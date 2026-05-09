const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    const token = req.cookies.token;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            res.locals.user = decoded;
        } catch{
            res.locals.user = null;
        }
    } else {
        res.locals.user = null;
    }

    next();
};