const db = require('../../models')
const mongoose = require('mongoose');
const NotificationDb = db.NotificationDb

class Notification {
    async getAllNotification(req, res) {
        const { reciverId } = req.body;
        if (!reciverId) {
            return res.status(400).send({status:false, message: "Receiver ID is required" });
        }
        try {
            const notifications = await NotificationDb.find({reciverId: reciverId}).sort({ createdAt: -1 }).exec();
            return res.send({status: true, message: "Notifications fetched successfully", data: notifications});
        }
        catch (err) {
            console.error("Error fetching notifications:", err);
            return res.status(500).send({status: false, message: "Error fetching notifications" , error: err.message });
        }
    }
}

module.exports = new Notification();
