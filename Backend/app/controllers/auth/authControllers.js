const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const db = require('../../models');
const UserDb = db.UserDb;
const moment = require("moment");
const nodemailer = require("nodemailer");
const { OAuth2Client } = require('google-auth-library');
require("dotenv").config();
const { getDateRange, getPercentChange } = require("../../helper/helper")
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

        if (user?.isGoogleLogin) {
            return res.send({ status: false, message: "You have logged in using Google. Please use the Google login option for future logins." });
        }
        const isMatch = await bcrypt.compare(Password, user?.Password);
        if (!isMatch) {
            return res.send({ status: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user?._id, Role: user?.Role }, process.env.SECRET, { expiresIn: "6h" });
        const { password: _, ...userWithoutPassword } = user?.toObject();


        return res.send({
            status: true,
            message: "Login successful",
            user: userWithoutPassword,
            token: token,
            expiresIn: "6h"
        });


    }
    async register(req, res) {
        const { FirstName, LastName, Email, PhoneNo, Password } = req.body;
        const existingUser = {
            $or: [
                { Email: Email },
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
    async updateUser(req, res) {

        const { id, name, value } = req.body;
        if (!id) {
            return res.send({ status: false, message: "User ID is required" });
        }
        if (!name) {
            return res.send({ status: false, message: "Name is required" });
        }
        try {
            const user = await UserDb.findById(id);
            if (!user) {
                return res.send({ status: false, message: "User not found" });
            }

            const updatedData = await UserDb.findByIdAndUpdate(id, { [name]: value }, { new: true });
            if (!updatedData) {
                return res.send({ status: false, message: "Error updating user" });
            }

            return res.send({ status: true, message: "User updated successfully" });
        } catch (error) {
            console.error("Error updating user:", error);
            return res.send({ status: false, message: "Internal server error", error });
        }
    }

    async getAllUser(req, res) {
        try {
            const { filter_type, start_date, end_date } = req.body;

            const ranges = getDateRange(filter_type, start_date, end_date);

            if (!ranges.current || !ranges.previous) {
                return res.send({ status: false, message: "Invalid filter_type or date range." });
            }

            const currentFilter = { createdAt: ranges.current, Role: "USER" };
            const previousFilter = { createdAt: ranges.previous, Role: "USER" };
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
        const { Email } = req.body;

        if (!Email) {
            return res.send({ status: false, message: "Email id is required." });
        }
        const user = await UserDb.findOne({Email });
        if (!user) {
            return res.send({ status: false, message: "User not found." });
        }
        console.log("user", user)
        if (user?.isGoogleLogin) {
            return res.send({
                status: false,
                message: "You signed up using Google. Please use 'Continue with Google' on the login page to sign in. Password reset is not available for Google login accounts."
              });
              
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

            res.send({ status: true, message: "A reset password link has been sent to your email.", token: token });
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



            if (!IfExitingUser) {
               const newUser = new UserDb({
                    FirstName: payload?.given_name,
                    LastName: payload?.family_name || "",
                    Username: payload?.name || payload?.email.split('@')[0],
                    Email: payload?.email,
                    PhoneNo: payload?.phone || null,
                    profile_img: payload?.picture || "",
                    isGoogleLogin: true
                });
                IfExitingUser = await newUser.save();
            }

            const logintoken = jwt.sign({ id: IfExitingUser?._id }, process.env.SECRET, { expiresIn: "6h" });

            return res.send({
                status: true,
                message: "User Login Successfully",
                data: IfExitingUser,
                logintoken: logintoken,
                expiresIn: "6h"
            });

        } catch (err) {
            console.error('Google login failed:', err);
            res.send({ status: false, message: 'Invalid token' });
        }
    }

    async updateUserStatus(req, res) {
        const { userId, status } = req.body;

        try {
            if (!userId) {
                return res.status(400).send({ status: false, message: "User ID is required." });
            }

            if (typeof status === 'undefined') {
                return res.status(400).send({ status: false, message: "Status is required." });
            }

            const data = await UserDb.findByIdAndUpdate(userId, { Is_Active: status }, { new: true });

            if (data) {
                return res.send({ status: true, message: `User status updated successfully.`, data });
            } else {
                return res.status(404).send({ status: false, message: "User not found." });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: "Something went wrong. Please try again later.", error: error.message });
        }
    }

    async deleteUserByAdmin(req, res) {
        const { userId } = req.body;

        try {
            if (!userId) {
                return res.status(400).send({ status: false, message: "User ID is required." });
            }


            const data = await UserDb.findByIdAndUpdate(userId, { Is_AdminDeleted: true }, { new: true });

            if (data) {
                return res.send({ status: true, message: `User deleted successfully.` });
            } else {
                return res.status(404).send({ status: false, message: "User not found." });
            }
        } catch (error) {
            return res.status(500).send({ status: false, message: "Something went wrong. Please try again later.", error: error.message });
        }
    }

    async getAllEmployee(req, res) {
        try {
            const { filter_type, start_date, end_date } = req.body;

            const ranges = getDateRange(filter_type, start_date, end_date);

            if (!ranges.current || !ranges.previous) {
                return res.send({ status: false, message: "Invalid filter_type or date range." });
            }

            const currentFilter = { createdAt: ranges.current, Role: "EMPLOYEE" };
            const previousFilter = { createdAt: ranges.previous, Role: "EMPLOYEE" };
            const data = await UserDb.find(currentFilter).sort({ createdAt: -1 });

            const total_employee = data.length;
            const total_active_employee = await UserDb.countDocuments({ ...currentFilter, Is_Active: "1" });
            const total_inactive_employee = total_employee - total_active_employee;

            const prev_total_employee = await UserDb.countDocuments(previousFilter);
            const prev_total_active_employee = await UserDb.countDocuments({ ...previousFilter, Is_Active: "1" });
            const prev_total_inactive_employee = prev_total_employee - prev_total_active_employee;

            res.send({
                status: true,
                message: "Employee stats fetched successfully.",
                data,
                current: {
                    total_employee,
                    total_active_employee,
                    total_inactive_employee
                },
                previous: {
                    total_employee: prev_total_employee,
                    total_active_employee: prev_total_active_employee,
                    total_inactive_employee: prev_total_inactive_employee
                },
                percentage_change: {
                    total_employee: getPercentChange(total_employee, prev_total_employee),
                    total_active_employee: getPercentChange(total_active_employee, prev_total_active_employee),
                    total_inactive_employee: getPercentChange(total_inactive_employee, prev_total_inactive_employee)
                }
            });

        } catch (error) {
            console.error("Error in getAllEmployeeStats:", error);
            res.send({ status: false, message: "Internal Server Error", error });
        }
    }

    async userCreateAnalytics(req, res) {
        const { filter_type, start_date, end_date } = req.body;

        try {

            const now = new Date();
            let dateFilter = {};
            let labelFormat = "%Y-%m-%d";

            if (filter_type === "today") {
                const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                dateFilter = { $gte: startOfDay, $lte: now };
            }
            else if (filter_type === "this_week") {
                const day = now.getDay();
                const diffToMonday = day === 0 ? 6 : day - 1;
                const startOfWeek = new Date(now);
                startOfWeek.setDate(now.getDate() - diffToMonday);
                startOfWeek.setHours(0, 0, 0, 0);
                dateFilter = { $gte: startOfWeek, $lte: now };
            }
            else if (filter_type === "this_month") {
                const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
                dateFilter = { $gte: startOfMonth, $lte: now };
            }
            else if (filter_type === "this_year") {
                const startOfYear = new Date(now.getFullYear(), 0, 1);
                dateFilter = { $gte: startOfYear, $lte: now };
                labelFormat = "%b"; // Jan, Feb, etc.
            }
            else if (filter_type === "custom") {
                if (!start_date || !end_date) {
                    return res.send({
                        status: false,
                        message: "Start and end dates are required for custom filter.",
                        data: []
                    });
                }

                dateFilter = {
                    $gte: new Date(start_date),
                    $lte: new Date(end_date)
                };
            }

            // MongoDB aggregation
            const rawData = await UserDb.aggregate([
                {
                    $match: {
                        Role: "USER",
                        createdAt: dateFilter
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: labelFormat, date: "$createdAt" } },
                        usage: { $sum: 1 }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id",
                        usage: 1
                    }
                },
                {
                    $sort: { date: 1 }
                }
            ]);

            // Post-processing: convert dates to weekdays if filter_type is 'this_week'
            let formattedData;

            if (filter_type === "this_week") {
                const weekdayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                formattedData = rawData.map(entry => {
                    const day = new Date(entry.date).getDay();
                    return {
                        name: weekdayMap[day],
                        usage: entry.usage
                    };
                });
            } else {
                formattedData = rawData.map(entry => ({
                    name: entry.date,
                    usage: entry.usage
                }));
            }

            return res.send({
                status: true,
                message: "success",
                data: formattedData
            });

        } catch (error) {
            console.error("Error in signatureCreatedAnalytics:", error);
            return res.send({
                status: false,
                message: "Internal server error",
                error: error.message
            });
        }
    };

}


module.exports = new Auth();