"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const ChatMessageSchema = Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    username: {
        type: String,
        required: true
    },
    sender: {
        type: String,
        enum: ['user', 'support'],
        required: true
    },
    content: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

const ChatMessage_model = model('ChatMessage', ChatMessageSchema);

module.exports = ChatMessage_model;



