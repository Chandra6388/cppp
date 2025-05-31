"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const ReviewModel = Schema({
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
    reviewText: {
        type: String,
        require: true,
        trim: true,
        default: null
    },
    IsApprove: {
        type: String,
        require: true,
        trim: true,
        enum: ['0', '1'],
        default: '0'
    },

},
    {
        timestamps: true
    },

)
const Review_model = model('Review', ReviewModel);

module.exports = Review_model;