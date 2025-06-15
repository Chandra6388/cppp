const db = require('../../models')
const ContactUsDb = db.ContactUsDb
const nodemailer = require("nodemailer");
require("dotenv").config();
class ContactUs {

    async addContactUs(req, res) {
        const { name, email, message } = req.body;
        if (!name) {
            return res.status(400).json({ status: false, message: "Name is required." });
        }
        if (!email) {
            return res.status(400).json({ status: false, message: "Email is required." });
        }
        if (!message) {
            return res.status(400).json({ status: false, message: "Message is required." });
        }

        try {
            const newContact = new ContactUsDb({ name, email, message });
            const savedContact = await newContact.save();
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: `Thanks for contacting us, ${name}!`,
                html:
                    `<div style="font-family: Arial, sans-serif; line-height: 1.5;">
                        <h2>Hi ${name},</h2>
                        <p>Thank you for reaching out to us. We have received your message:</p>
                        <blockquote style="margin: 10px 0; padding: 10px; background-color: #f5f5f5; border-left: 4px solid #0ba5e9;">
                            ${message}
                        </blockquote>
                        <p>We will get back to you within 24 hours.</p>
                        <p>Best regards,<br />Support Team</p>
                    </div>`
            }

            await transporter.sendMail(mailOptions);
            return res.status(201).json({
                status: true,
                message: "Thank you! Your message has been received. A confirmation email has been sent.",
                data: savedContact,
            });

        } catch (error) {
            console.error("AddContactUs Error:", error);
            return res.status(500).json({
                status: false,
                message: "Internal server error. Please try again later.",
                error: error.message,
            });
        }
    }

    async getAllContactUsFrom(req, res) {
        try {
            const data = await ContactUsDb.find().sort({createdAt: -1})
            return res.send({ status: true, message: "All contact us form get successfully", data: data })
        }
        catch (error) {
            console.error("AddContactUs Error:", error);
            return res.status(500).json({
                status: false,
                message: "Internal server error. Please try again later.",
                error: error.message,
            });
        }

    }
}

module.exports = new ContactUs();
