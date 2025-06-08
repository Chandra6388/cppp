"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const supportChatSchema = Schema({
    ticketId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SupportTicket',
        required: true
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    reciverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ["message", "announcement", "system"],
        trim: true
    },
    sender: {
        type: String,
        enum: ['user', 'support'],
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
},
    {
        timestamps: true
    },
);

const supportChat_model = model('supportChat', supportChatSchema);

module.exports = supportChat_model;




