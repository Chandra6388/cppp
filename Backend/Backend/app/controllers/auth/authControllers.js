const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const db = require('../../models');
const UserDb = db.UserDb;
const moment = require("moment");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();
const {getDateRange , getPercentChange } = require("../../helper/helper")
const client = new OAuth2Client(process.env.ClientID);
 
class Auth {
    async login(req, res) {
        const { Email, Password } = req.body;
        if (!Email) {
            return res.send({ status: false, message: "Email is required" });
        }
        if (!Password) {
            return res.send({ status: false, message: "Password is required" });
        }


        const user = await UserDb.findOne({ Email: Email });



        if (!user) {
            return res.send({ status: false, message: "User not found" });
        }
        const isMatch = await bcrypt.compare(Password, user?.Password);
        if (!isMatch) {
            return res.send({ status: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user?._id }, process.env.SECRET, { expiresIn: "1h" });
        const { password: _, ...userWithoutPassword } = user?.toObject();


        return res.send({
            status: true,
            message: "Login successful",
            user: userWithoutPassword,
            token: token,
            expiresIn: 3600
        });


    }
    async register(req, res) {
        const { FirstName, LastName, Username, Email, PhoneNo, Password } = req.body;


        const existingUser = {
            $or: [
                { Email: Email },
                { Username: Username },
                { PhoneNo: PhoneNo }

            ]
        };
        const user = await UserDb.findOne(existingUser);
        if (user) {
            return res.send({ status: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new UserDb({
            FirstName,
            LastName,
            Username,
            Email,
            Password: hashedPassword,
            PhoneNo
        });

        try {
            const savedUser = await newUser.save();
            return res.send({ status: true, message: "User registered successfully", user: savedUser });
        } catch (error) {
            return res.send({ status: false, message: "Error registering user", error });
        }
    }

    async getAllUser(req, res) {
        try {
            const { filter_type, start_date, end_date } = req.body;

            const ranges = getDateRange(filter_type, start_date, end_date);

            if (!ranges.current || !ranges.previous) {
                return res.send({ status: false, message: "Invalid filter_type or date range." });
            }

            const currentFilter = { createdAt: ranges.current };
            const previousFilter = { createdAt: ranges.previous };
            const data = await UserDb.find(currentFilter).sort({ createdAt: -1 });

            const total_user = data.length;
            const total_active_user = await UserDb.countDocuments({ ...currentFilter, Is_Active: "1" });
            const total_inactive_user = total_user - total_active_user;

            const prev_total_user = await UserDb.countDocuments(previousFilter);
            const prev_total_active_user = await UserDb.countDocuments({ ...previousFilter, Is_Active: "1" });
            const prev_total_inactive_user = prev_total_user - prev_total_active_user;

            res.send({
                status: true,
                message: "User stats fetched successfully.",
                data,
                current: {
                    total_user,
                    total_active_user,
                    total_inactive_user
                },
                previous: {
                    total_user: prev_total_user,
                    total_active_user: prev_total_active_user,
                    total_inactive_user: prev_total_inactive_user
                },
                percentage_change: {
                    total_user: getPercentChange(total_user, prev_total_user),
                    total_active_user: getPercentChange(total_active_user, prev_total_active_user),
                    total_inactive_user: getPercentChange(total_inactive_user, prev_total_inactive_user)
                }
            });

        } catch (error) {
            console.error("Error in getAllUserStats:", error);
            res.send({ status: false, message: "Internal Server Error", error });
        }
    }

    async updateProfileImg(req, res) {
        const { id, url } = req.body;
        try {
            if (!id) {
                return res.send({ status: false, message: "User ID is required", data: [] });
            }

            if (!url) {
                return res.send({ status: false, message: "Please upload a profile image", data: [] });
            }

            const user = await UserDb.findById(id);

            if (!user) {
                return res.send({ status: false, message: "User not found", data: [] });
            }

            await UserDb.findByIdAndUpdate(id, { profile_img: url });

            return res.send({ status: true, message: "Profile updated successfully", data: [] });
        } catch (error) {
            return res.send({ status: false, message: "Internal server error", error });
        }
    }

    async getUserById(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.send({ status: false, message: "User ID is required", data: [], });
            }

            const data = await UserDb.findById({ _id: id });

            if (!data) {
                return res.send({ status: false, message: "User not found", data: [], });
            }

            return res.send({ status: true, message: "User retrieved successfully", data: data, });
        } catch (error) {
            console.error("Error in getUserById:", error);
            return res.send({ status: false, message: "Internal server error", error: error.message, });
        }
    }


    async forgotPassword(req, res) {
        const { Username, Email } = req.body;

        if (!Username || !Email) {
            return res.send({ status: false, message: "ID and Email are required." });
        }

        const user = await UserDb.findOne({ Username, Email });

        if (!user) {
            return res.send({ status: false, message: "User not found." });
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: '15m' });

        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 15 * 60 * 1000;
        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}reset-password`;
        const html = `
            <h2>Hello ${user.FirstName || "User"},</h2>
            <p>You requested to reset your password.</p>
            <p><a href="${resetLink}" target="_blank">Click here to reset your password</a></p>
            <p>This link will expire in 15 minutes.</p>
        `;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.Email,
            subject: "Reset Your Password",
            html: html,
        };

        try {
            const info = await transporter.sendMail(mailOptions);

            res.send({ status: true, message: "Reset link sent to email.", token: token });
        } catch (error) {
            console.error("Email Error:", error); 
            res.send({ status: false, msg: "Failed to send email.", error: error });
        }
    }
 

    async resetPassword(req, res) {
        const { newPassword, token } = req.body;

        if (!newPassword) {
            return res.send({ status: false, message: "New password is required." });
        }
        if (!token) {
            return res.send({ status: false, message: "Token is required." });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET);

            const user = await UserDb.findById(decoded.id);
            if (!user) {
                return res.send({ status: false, message: "User not found." });
            }
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const updatedUser = await UserDb.findOneAndUpdate({ _id: decoded.id }, { Password: hashedPassword }, { new: true });
            if (!updatedUser) {
                return res.send({ status: false, message: "Failed to update password." });
            }
            return res.send({ status: true, message: "Password reset successfully." });

        }
        catch (error) {
            console.error("Error in resetPassword:", error);

            if (error.name === "TokenExpiredError") {
                return res.send({ status: false, message: "Token has expired.", expiredAt: error.expiredAt });
            }

            return res.send({ status: false, message: "Internal server error", error: error.message });
        }
    }

    async googleLogin(req, res) {
        const { token } = req.body;
        if (!token) {
            return res.send({ status: false, message: 'Token is required' });
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: process.env.ClientID
            });
            const payload = ticket.getPayload();

            let IfExitingUser = await UserDb.findOne({ Email: payload.email })
            return res.send({ status: true, message: "User Login Successfully", data: IfExitingUser ? IfExitingUser : payload, isNewUser: IfExitingUser ? true : false });

        } catch (err) {
            console.error('Google login failed:', err);
            res.send({ status: false, message: 'Invalid token' });
        }
    }

    async AddNewUser(req, res) {
        const { FirstName, LastName, Username, profile_img, Email, PhoneNo, Password } = req.body

        if (!Username) {
            return res.send({ status: false, message: "User name is require" })

        }
        if (!PhoneNo) {
            return res.send({ status: false, message: "Phone number is require" })

        }
        if (!Password) {
            return res.send({ status: false, message: "Password is require" })
        }

        const isExistingUser = await UserDb.findOne({
            $or: [
                { Username: Username },
                { PhoneNo: PhoneNo }
            ]
        });

        if (isExistingUser) {
            if (isExistingUser?.Username == Username) {
                return res.send({ status: false, message: "Username Already exit" })
            }

            if (isExistingUser?.PhoneNo == PhoneNo) {
                return res.send({ status: false, message: "Phone number Already exit" })
            }
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = new UserDb({
            FirstName,
            LastName,
            Username,
            Email,
            Password: hashedPassword,
            PhoneNo,
            profile_img
        });

        try {
            const savedUser = await newUser.save();

            const jwtToken = jwt.sign(
                { id: savedUser._id, email: savedUser.Email },
                process.env.SECRET,
                { expiresIn: '1h' }
            );
            res.send({ status: true, message: "User Login Successfully", token: jwtToken, data: savedUser });

        } catch (error) {
            return res.send({ status: false, message: "Error registering user", error });
        }
    }

}


module.exports = new Auth();