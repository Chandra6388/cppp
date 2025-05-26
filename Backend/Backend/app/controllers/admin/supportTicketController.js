const db = require('../../models');
const SupportTicketDB = db.SupportTicketDB;

class Tickets {
    async allTickets(req, res) {
        try {
            const data = await SupportTicketDB.find().sort({ createdAt: -1 });
            return res.send({ status: true, message: "All ticket fetch successfully", data: data })
        }
        catch (error) {
            return res.send({ status: false, message: "Internal server error", error: error.message })
        }

    }

    async assigneToSupport(req, res) {
        const { _id, priority, category, assignee } = req.body;

        try {
            if (!_id) {
                return res.status(400).send({
                    status: false,
                    message: "Ticket ID is required to process the assignment.",
                });
            }
            if (!priority) {
                return res.status(400).send({
                    status: false,
                    message: "Please specify the priority level for this ticket.",
                });
            }
            if (!category) {
                return res.status(400).send({
                    status: false,
                    message: "Please select a valid category for this ticket.",
                });
            }
            if (!assignee) {
                return res.status(400).send({
                    status: false,
                    message: "Please assign this ticket to a support team member.",
                });
            }

            const updateTicket = await SupportTicketDB.findByIdAndUpdate(
                _id,
                { priority, category, assignee },
                { new: true }
            );

            if (!updateTicket) {
                return res.status(404).send({
                    status: false,
                    message: "No ticket found with the provided ID.",
                });
            }

            return res.send({
                status: true,
                message: "The ticket has been successfully assigned to the support team.",
                data: updateTicket,
            });

        } catch (error) {
            console.error("Error while assigning ticket:", error);
            return res.status(500).send({
                status: false,
                message: "An unexpected error occurred while assigning the ticket. Please try again later.",
                error: error.message,
            });
        }
    }

    async changeStatus(req, res) {
        const { _id, status } = req.body;
    
        try {
            if (!_id) {
                return res.status(400).send({
                    status: false,
                    message: "Ticket ID is required to update the status.",
                });
            }
    
            if (!status) {
                return res.status(400).send({
                    status: false,
                    message: "Please provide a valid status to update the ticket.",
                });
            }
    
            const updateTicket = await SupportTicketDB.findByIdAndUpdate(
                _id,
                { status },
                { new: true }  
            );
    
            if (!updateTicket) {
                return res.status(404).send({
                    status: false,
                    message: "No ticket found with the given ID.",
                });
            }
    
            return res.send({
                status: true,
                message: "Ticket status updated successfully.",
                data: updateTicket,
            });
    
        } catch (error) {
            console.error("Error while updating ticket status:", error);
            return res.status(500).send({
                status: false,
                message: "An error occurred while updating the ticket status. Please try again later.",
                error: error.message,
            });
        }
    }
    


}


module.exports = new Tickets();