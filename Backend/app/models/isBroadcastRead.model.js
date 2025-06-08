"use strict";
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const isBroadcastRead = new Schema({
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        default: null
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "notifications",
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

const isBroadcastRead_model = model("isBroadcastRead", isBroadcastRead);
module.exports = isBroadcastRead_model;
