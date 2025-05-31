// 📍 app/utils/sendEmail.js

const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html, base64Data = null) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "chandra@eprimecomputers.com",
            pass: "gtor qsbe hlqu ladw", // 🔐 Make sure to use env in production!
        },
    });

    const mailOptions = {
        from: "chandra@eprimecomputers.com",
        to,
        subject,
        html,
        attachments: base64Data
            ? [
                {
                    filename: "profile.png",
                    content: base64Data,
                    encoding: "base64",
                    cid: "user-profile-img",
                },
            ]
            : [],
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email sending failed:", error);
                return reject(error);
            }
            resolve(info);
        });
    });
};

module.exports = sendEmail;
