const db = require('../../models');
const SupportTicketDB = db.SupportTicketDB;
require("dotenv").config();
const { getDateRange } = require("../../helper/helper")

class Dashbaord {
    async getDashboardData(req, res) {
        const { userId, filter_type, start_date, end_date } = req.body;
   
        if (!userId) {
            return res.status(400).send({ status: false, message: "User ID is required." });
        }

        try {
            const range = getDateRange(filter_type, start_date, end_date);
            if (!range.current || !range.previous) {
                return res.status(400).send({ status: false, message: "Invalid filter_type or date range." });
            }

            const currentFilter = { createdAt: range.current, assignee: userId }; 

            // Parallelize DB operations
            const [assignedTickets, resolvedCount, pendingCount] = await Promise.all([
                SupportTicketDB.find(currentFilter).sort({ createdAt: -1 }),
                SupportTicketDB.countDocuments({ ...currentFilter, status: 'Resolved' }),
                SupportTicketDB.countDocuments({ ...currentFilter, status: 'Progress' }),
            ]);

            return res.status(200).send({
                status: true,
                message: "Dashboard data fetched successfully",
                data: {
                    totalAssignedTickets: assignedTickets.length,
                    totalResolvedTickets: resolvedCount,
                    totalPendingTickets: pendingCount,
                    assignedTickets 
                }
            });

        } catch (error) {
            console.error("Error fetching dashboard data:", error);
            return res.status(500).send({
                status: false,
                message: "An error occurred while fetching dashboard data."
            });
        }
    }
}

module.exports = new Dashbaord();