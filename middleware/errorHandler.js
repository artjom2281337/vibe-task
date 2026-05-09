module.exports = (err, req, res, next) => {
    console.log(err);

    req.flash("error", "Something went wrong");
    res.redirect("/auth/login")
}