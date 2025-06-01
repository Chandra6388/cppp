const db = require('../../models')
const SupportTicketDB = db.SupportTicketDB
const mongoose = require('mongoose');
const UserDb = db.UserDb;
require("dotenv").config();

class SupportTicket {
    async createSupportTicket(req, res) {
        const { userId, userName, subject, message } = req.body
        try {
            if (!userId) {
                return res.send({ status: false, message: "User id is require" })
            }
            if (!mongoose.Types.ObjectId.isValid(userId)) {
                return res.status(400).send({ status: false, message: "Invalid user id format" });
            }
            if (!userName) {
                return res.send({ status: false, message: "user name is require" })
            }
            if (!subject) {
                return res.send({ status: false, message: "subject is require" })
            }
            if (!message) {
                return res.send({ status: false, message: "message is require" })
            }

            const isExitUser = await UserDb.findOne({ _id: userId });


            if (!isExitUser) {
                return res.send({ status: false, message: "user is not found in this user id" })
            }

            const newData = new SupportTicketDB({
                userId,
                userName,
                subject,
                message
            })
            await newData.save()
            return res.send({ status: true, message: "Your support ticket has been submitted , We'll get back to you as soon as possible", data: newData })

        }
        catch (error) {
            console.log("error", error.message)
            res.send({ status: false, message: "Internal server error", error: error.message })
        }

    }
    async getAllSupportTicket(req, res) {
        const { userId } = req.body;
        if (!userId) {
            return res.send({ status: false, message: "User id is required" });
        }
        try {
            const tickets = await SupportTicketDB.aggregate([
                {
                    $match: {
                        userId: new mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        from: "supportchats",
                        localField: "_id",
                        foreignField: "ticketId",
                        as: "chatHistory"
                    }
                },
                {
                    $addFields: {
                        unreadMessageCount: {
                            $size: {
                                $filter: {
                                    input: "$chatHistory",
                                    as: "chat",
                                    cond: {
                                        $and: [
                                            { $eq: ["$$chat.isRead", false] },
                                            { $eq: ["$$chat.reciverId", new mongoose.Types.ObjectId(userId)] }
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {
                    $sort: { createdAt: -1 }
                }
            ]);


            return res.send({ status: true, message: "All support tickets fetched successfully", data: tickets });
        }
        catch (error) {
            console.log("error", error.message);
            return res.send({ status: false, message: "Internal server error", error: error.message });
        }
    }
}

module.exports = new SupportTicket();
