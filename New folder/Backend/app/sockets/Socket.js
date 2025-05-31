const db = require('../models');
const supportChatDb = db.supportChatDb;

// Maintain a map of connected users and their socket IDs
const userSocketMap = new Map();

function supportChatSocketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("typing", ({ ticketId, senderId }) => {
      socket.to(ticketId).emit("typingsuport", { senderId });
    });
    
    

    // Join a ticket room for message thread
    socket.on("join_ticket", ({ ticketId }) => {
      socket.join(ticketId);
      console.log(`📥 Socket ${socket.id} joined room ${ticketId}`);
    });

    // Join a user-specific room for private notifications
    socket.on("join_user_room", ({ userId }) => {
      if (userId) {
        socket.join(userId);
        userSocketMap.set(userId, socket.id);
        console.log(`👤 Socket ${socket.id} joined personal room ${userId}`);
      }
    });

    // Handle incoming messages
    socket.on("support_message", async ({ chatDetails }) => {
      try {
        const savedMessage = await supportChatDb.create({
          ticketId: chatDetails.ticketId,
          reciverId: chatDetails.reciverId,
          senderId: chatDetails.senderId,
          text: chatDetails.text,
          sender: chatDetails.sender,
          timestamp: new Date(),
          isRead: false,
        });

        io.to(chatDetails.ticketId).emit("receive_support_message", savedMessage);

        const countUnreadMsg = await supportChatDb.countDocuments({
          reciverId: chatDetails.reciverId,
          isRead: false,
          sender: chatDetails.sender,
        });

        io.to(chatDetails.reciverId).emit("unreadCountResponse", {
          userId: chatDetails.reciverId,
          count: countUnreadMsg,
        });

      } catch (err) {
        console.error("❌ DB Error (support_message):", err);
        socket.emit("error_message", {
          message: "Message couldn't be sent. Please try again.",
        });
      }
    });

    // Mark messages as read
    socket.on("mark_as_read", async ({ ticketId, readerType, reciverId }) => {
      try {
        await supportChatDb.updateMany(
          {
            ticketId,
            sender: { $ne: readerType },
            isRead: false,
          },
          { $set: { isRead: true } }
        );

        socket.emit("messages_marked_as_read", { ticketId, readerType });
        socket.to(ticketId).emit("messages_marked_as_read", { ticketId, readerType });

        const countUnreadMsg = await supportChatDb.countDocuments({
          reciverId,
          isRead: false,
          sender: readerType,
        });

        console.log("🔁 Unread messages left for", reciverId, ":", countUnreadMsg);

        const readerSocketId = userSocketMap.get(reciverId);
        if (readerSocketId) {
          io.to(readerSocketId).emit("unreadCountResponse", {
            userId: reciverId,
            count: countUnreadMsg,
          });
        } else {
          // fallback: emit to current socket just in case
          socket.emit("unreadCountResponse", {
            userId: reciverId,
            count: countUnreadMsg,
          });
        }

      } catch (err) {
        console.error("❌ Error marking messages as read:", err);
      }
    });

    // Manual unread count request
    socket.on("unreadCountUpdate", async ({ userId, readerType }) => {
      try {
        const countUnreadMsg = await supportChatDb.countDocuments({
          reciverId: userId,
          isRead: false,
          sender: readerType,
        });

        socket.emit("unreadCountResponse", {
          userId,
          count: countUnreadMsg,
        });

      } catch (err) {
        console.error("❌ Error in unreadCountUpdate:", err);
      }
    });

    // Handle socket disconnection
    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);

      for (const [userId, sockId] of userSocketMap.entries()) {
        if (sockId === socket.id) {
          userSocketMap.delete(userId);
          console.log(`🗑️ Removed user ${userId} from socket map`);
          break;
        }
      }
    });
  });
}

module.exports = {
  supportChatSocketHandler,
};
