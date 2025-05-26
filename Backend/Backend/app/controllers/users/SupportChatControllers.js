const db = require('../../models');
const ChatMessageDb = db.ChatMessageDb;

class Chat {
  async getChatMessage(req, res) {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        status: false, 
        message: "User ID is required." 
      });
    }

    try {
      const messages = await ChatMessageDb.find({ userId }).sort({ timestamp: 1 });
      return res.status(200).json({ 
        status: true, 
        message: "Chat messages retrieved successfully.", 
        data: messages 
      });
    } catch (error) {
      return res.status(500).json({ 
        status: false, 
        message: "An error occurred while fetching chat messages.", 
        error: error.message 
      });
    }
  }
}

module.exports = new Chat();
