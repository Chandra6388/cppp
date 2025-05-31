const db = require('../../models')
const UserDb = db.UserDb  

class Setting {

    async getEmailNotificationSettings(req, res) {
        const { userId, status } = req.body;
        if (!userId) {
            return res.send({ status: false, message: "User ID is required" });
        }

        if (!status) {
            return res.send({ status: false, message: "status is required" });
        }

        try {
            const settings = await UserDb.findByIdAndUpdate(userId, { isNotifyViaEmail: status }, { new: true });
            if (!settings) {
                return res.send({ status: false, message: "User is not found" });
            }

            return res.send({ status: true, message: "Email notification settings updated successfully" });
        } catch (error) {
            console.error("Error fetching email notification settings:", error);
            return res.send({ message: "Internal server error" });
        }
    }
    async getWhatsappNotificationSettings(req, res) {
        const { userId, status } = req.body;
        if (!userId) {
            return res.send({ status: false, message: "User ID is required" });
        }

        if (!status) {
            return res.send({ status: false, message: "status is required" });
        }

        try {
            const settings = await UserDb.findByIdAndUpdate(userId, { isNotifyViaWhatsapp: status }, { new: true });
            if (!settings) {
                return res.send({ status: false, message: "User is not found" });
            }

            return res.send({ status: true, message: "Whatsapp notification settings updated successfully" });
        } catch (error) {
            console.error("Error fetching Whatsapp notification settings:", error);
            return res.send({ message: "Internal server error" });
        }
    }




}

module.exports = new Setting();
