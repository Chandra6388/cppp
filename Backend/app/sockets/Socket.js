const db = require('../models');
const supportChatDb = db.supportChatDb;
const userSocketMap = new Map();
const NotificationDb = db.NotificationDb

function supportChatSocketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("typing", ({ ticketId, senderId }) => {
      socket.to(ticketId).emit("typingsuport", { senderId });
    });

    socket.on("join_ticket", ({ ticketId }) => {
      socket.join(ticketId);
      console.log(`📥 Socket ${socket.id} joined room ${ticketId}`);
    });

    socket.on("join_user_room", ({ userId }) => {
      if (userId) {
        socket.join(userId);
        userSocketMap.set(userId, socket.id);
        console.log(`👤 Socket ${socket.id} joined personal room ${userId}`);
      }
    });

    socket.on("support_message", async ({ chatDetails }) => {
      try {
        // 1. Save the chat message
        const savedMessage = await supportChatDb.create({
          ticketId: chatDetails.ticketId,
          reciverId: chatDetails.reciverId,
          senderId: chatDetails.senderId,
          text: chatDetails.text,
          sender: chatDetails.sender,
          timestamp: new Date(),
          isRead: false,
        });

        // 2. Emit message to the ticket room
        io.to(chatDetails.ticketId).emit("receive_support_message", savedMessage);

        // 3. Emit unseen message count to receiver
        const ticketUnreadCount = await supportChatDb.countDocuments({
          ticketId: chatDetails.ticketId,
          reciverId: chatDetails.reciverId,
          isRead: false,
          sender: chatDetails.sender, // Only from sender
        });

        io.to(chatDetails.reciverId).emit("unseen-message-count", {
          ticketId: chatDetails.ticketId,
          count: ticketUnreadCount,
        });

        // 4. Create a notification for the receiver
        await NotificationDb.create({
          reciverId: chatDetails.reciverId,
          type: "message",
          title: "New Support Message",
          ticketId: chatDetails.ticketId,
          message: chatDetails.text,
          isRead: false,
        });

      } catch (err) {
        console.error("❌ DB Error (support_message):", err);
        socket.emit("error_message", {
          message: "Message couldn't be sent. Please try again.",
        });
      }
    });

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

        await NotificationDb.updateMany(
          {
            ticketId, 
            reciverId,
            isRead: false,
          },
          { $set: { isRead: true } }
        );


        socket.emit("messages_marked_as_read", { ticketId, readerType });
        socket.to(ticketId).emit("messages_marked_as_read", { ticketId, readerType });

        const ticketUnreadCount = await supportChatDb.countDocuments({
          ticketId,
          reciverId,
          isRead: false,
          sender: readerType,
        });

        io.to(reciverId).emit("unseen-message-count", {
          ticketId,
          count: ticketUnreadCount,
        });

      } catch (err) {
        console.error("❌ Error marking messages as read:", err);
      }
    });

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
