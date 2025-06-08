"use strict";
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const Notifications = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    default: null
  },
  type: {
    type: String,
    required: true,
    enum: ["message", "announcement", "broadcast"],
    trim: true
  },
  audience: {
    type: String,
    enum: ["all", "user", "employee"],
    default: "all"
  },

  isRead: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
      },
      status: {
        type: Boolean,
        required: true,
        default: false
      },
    }
  ]

}, {
  timestamps: true
});

const Notifications_model = model("notifications", Notifications);
module.exports = Notifications_model;
