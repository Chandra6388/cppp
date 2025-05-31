const db = require('../../models');
const SupportTicketDB = db.SupportTicketDB;
const supportChatDb = db.supportChatDb;
require("dotenv").config();
const mongoose = require('mongoose');

class Ticket {

    async getAllTicket(req, res) {
      const { userId } = req.body;
      if (!userId) {
        return res.status(400).send({ status: false, message: "User ID is required." });
      }
    
      try {
        const tickets = await SupportTicketDB.aggregate([
          { $match: { assignee: new mongoose.Types.ObjectId(userId) } },
          {
            $lookup: {
              from: "supportchats",        
              localField: "_id",
              foreignField: "ticketId",
              as: "chatHistory"
            }
          },
          { $sort: { createdAt: -1 } }    
        ]);
     
    
        return res.status(200).send({
          status: true,
          message: "Tickets fetched successfully",
          data: tickets
        });
      } catch (error) {
        console.error("Error fetching tickets:", error);
        return res.status(500).send({
          status: false,
          message: "An error occurred while fetching tickets."
        });
      }
    }

    async getChatHistory(req, res) {
        const { ticketId } = req.body;
        if (!ticketId) {
            return res.status(400).send({ status: false, message: "Ticket ID is required." });
        }
        try {
            const chatHistory = await supportChatDb.find({ ticketId: ticketId });
            return res.send({
                status: true,
                message: "Chat history fetched successfully",
                data: chatHistory
            });
        } catch (error) {
            console.error("Error fetching chat history:", error);
            return res.status(500).send({
                status: false,
                message: "An error occurred while fetching chat history."
            });
        }
    }
}

module.exports = new Ticket();