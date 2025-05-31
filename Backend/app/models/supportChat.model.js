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
});

const supportChat_model = model('supportChat', supportChatSchema);

module.exports = supportChat_model;




