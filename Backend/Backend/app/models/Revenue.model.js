"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const RevenueSchema = Schema({
    UserId: {
        userId: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    Payment: {
        type: Number,
        require: true,
        trim: true,
        default: 0
    },
    SignatureId: {
        signatureId: mongoose.Schema.Types.ObjectId,
        ref : 'Signature'
    },
},
    {
        timestamps: true
    },

)
const RevenueSchema_model = model('Revenue', RevenueSchema);

module.exports = RevenueSchema_model;