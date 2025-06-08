const db = require('../models');
const supportChatDb = db.supportChatDb;
const NotificationDb = db.NotificationDb;
const isBroadcastReadDB= db.isBroadcastReadDB

const userSocketMap = new Map();
const openTicketWindows = new Map();  

function supportChatSocketHandler(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("receiver_chat_presence", ({ receiverId, ticketId }) => {
      if (!openTicketWindows.has(receiverId)) {
        openTicketWindows.set(receiverId, new Set());
      }
      openTicketWindows.get(receiverId).add(ticketId);
      console.log(`✅ Receiver ${receiverId} opened chat for ticket ${ticketId}`);
    });

    socket.on("receiver_chat_absence", ({ receiverId, ticketId }) => {
      if (openTicketWindows.has(receiverId)) {
        openTicketWindows.get(receiverId).delete(ticketId);
        if (openTicketWindows.get(receiverId).size === 0) {
          openTicketWindows.delete(receiverId);
        }
      }
      console.log(`❌ Receiver ${receiverId} closed chat for ticket ${ticketId}`);
    });

    socket.on("open_ticket_chat", ({ userId, ticketId }) => {
      if (!openTicketWindows.has(userId)) {
        openTicketWindows.set(userId, new Set());
      }
      openTicketWindows.get(userId).add(ticketId);
      console.log(`🟢 ${userId} opened ticket ${ticketId}`);
    });

    socket.on("close_ticket_chat", ({ userId, ticketId }) => {
      if (openTicketWindows.has(userId)) {
        openTicketWindows.get(userId).delete(ticketId);
        if (openTicketWindows.get(userId).size === 0) {
          openTicketWindows.delete(userId);
        }
      }
      console.log(`🔴 ${userId} closed ticket ${ticketId}`);
    });

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
          type: "message",
        });

        // 2. Emit message to the ticket room
        io.to(chatDetails.ticketId).emit("receive_support_message", savedMessage);

        // 3. Emit unseen message count to receiver
        const ticketUnreadCount = await supportChatDb.countDocuments({
          ticketId: chatDetails.ticketId,
          reciverId: chatDetails.reciverId,
          isRead: false,
          sender: chatDetails.sender,
        });

        io.to(chatDetails.reciverId).emit("unseen-message-count", {
          ticketId: chatDetails.ticketId,
          count: ticketUnreadCount,
        });

        // 4. Conditionally create notification based on receiver chat presence
        // const isChatOpen =
        //   openTicketWindows.has(chatDetails.reciverId) &&
        //   openTicketWindows.get(chatDetails.reciverId).has(chatDetails.ticketId);
 

        // if (!isChatOpen) {
        //   const newNotification = await NotificationDb.create({
        //     reciverId: chatDetails.reciverId,
        //     type: "message",
        //     title: chatDetails.sender == "user" ? "New User Message" : "New Support Message",
        //     ticketId: chatDetails.ticketId,
        //     message: chatDetails.text,
        //     isRead: false,
        //   });

        //   io.to(chatDetails.reciverId).emit("new_notification", newNotification);
        //   console.log("📨 Notification created.");
        // } else {
        //   console.log("🔕 Chat is open — notification skipped.");
        // }

      } catch (err) {
        console.error("❌ DB Error (support_message):", err);
        socket.emit("error_message", {
          message: "Message couldn't be sent. Please try again.",
        });
      }
    });

    socket.on("mark_as_read", async ({ ticketId, readerType, reciverId, senderId }) => {
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
            reciverId: senderId,
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

    socket.on("mark_all_notifications_read", async ({ userId, readerType }) => {
      try {

        await supportChatDb.updateMany({ reciverId: userId, sender: { $ne: readerType }, isRead: false, }, { $set: { isRead: true } });
        await NotificationDb.updateMany({ reciverId: userId, isRead: false }, { $set: { isRead: true } });
        socket.emit("all_notifications_read", { userId });

      } catch (err) {
        console.error("❌ Error marking all notifications as read:", err);
      }
    }
    );

    socket.on("broadcast_message", async ({ title, message, audience, time }) => {

    const newNotification =   await NotificationDb.create({
        type: "broadcast",
        title: "New Feature Announcement",
        message: message,
        audience: audience,
      })

      

      console.log("C", time, audience, title, message)

    })

    socket.on("disconnect", () => {
      console.log("🔴 Socket disconnected:", socket.id);
      for (const [userId, sockId] of userSocketMap.entries()) {
        if (sockId === socket.id) {
          userSocketMap.delete(userId);
          openTicketWindows.delete(userId);
          console.log(`🗑️ Removed user ${userId} from socket map and open ticket windows`);
          break;
        }
      }
    });
  });
}

module.exports = {
  supportChatSocketHandler,
};
