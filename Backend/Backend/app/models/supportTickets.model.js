"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const SupportTicketModel = Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER',
        required: true
    },
    userName: {
        type: String,
        trim: true,
        require: true,
        default: null
    },
    subject: {
        type: String,
        trim: true,
        require: true,
        default: null
    },
    message: {
        type: String,
        trim: true,
        require: true,
        default: null
    },
    status: {
        type: String,
        enum: ["Open", "Progress", "Resolved", "Closed"],
        default: 'Open'
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high", null],
        default: null
    },
    category: {
        type: String,
        trim: true,
        default: null
    },
    assignee: {
        type: String,
        trim: true,
        default: null
    }
},
    {
        timestamps: true
    },

)
const SupportTicket_Model = model('SupportTicket', SupportTicketModel);

module.exports = SupportTicket_Model;