"use strict";
const mongoose = require("mongoose");
const unreadSupportChatSchema = new mongoose.Schema({}, { strict: false });
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
  isBroadcastReadDB: require('./isBroadcastRead.model'),
  blogsDB: require('./blog.model'),
  ContactUsDb: require('./contactUs.model'),




  UnreadSupportChat: UnreadSupportChat
};
