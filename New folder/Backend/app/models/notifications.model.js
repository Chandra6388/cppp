"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const Notifications = Schema({
    UserId: {
        userId: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    Rating: {
        type: String,
        require: true,
        trim: true,
        enum: ['0', '1', '2', '3', '4', '5'],
        default: 0
    },
    Action: {
        type: String,
        require: true,
        trim: true,
        default: null
    },
},
    {
        timestamps: true
    },

)
const Notifications_model = model('notificatons', Notifications);

module.exports = Notifications_model;