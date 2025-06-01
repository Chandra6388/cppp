"use strict";

const mongoose = require("mongoose");

// Define a schema (can be empty or just for reference fields)
const unreadSupportChatSchema = new mongoose.Schema({}, { strict: false });

// Bind it to the view name (collection name is the same as the view name)
const UnreadSupportChat = mongoose.model("UnreadSupportChat", unreadSupportChatSchema, "unreadSupportChats");

module.exports = {
  UserDb: require("./users"),
  SignatureDb: require("./signature.model"),
  SignatureViewDB: require('./SignatureView.model'),
  TrackBtnClickedDB: require("./TrackBtnClick"),
  TemplatesDb: require('./Template.model'),
  SignatureSendRecordDB: require('./signatureSendRecord.model'),
  SupportTicketDB: require('./supportTickets.model'),
  ChatMessageDb: require('./chatMessage.Model'),
  supportChatDb: require('./supportChat.model'),
  NotificationDb: require('./Notification.model'),
  UnreadSupportChat: UnreadSupportChat   // ✅ Add comma above
};
