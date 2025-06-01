"use strict";
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const Notifications = new Schema({
  reciverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "supporttickets",
    default: null
  },
  type: {
    type: String,
    required: true,
    enum: ["message", "announcement", "system"],
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    default: null
  },
  message: {
    type: String,
    required: true,
    trim: true,
    default: null
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

const Notifications_model = model("notifications", Notifications);
module.exports = Notifications_model;
