const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

module.exports = async (to, subject, text) => {
    await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        text
    });
}