"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const TrackBtnClicked = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'USER',
        required: true
    },
    signatureId: {
        type: Schema.Types.ObjectId,
        ref: 'Signature',
        required: true
    },
    BtnName: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    ClickCount: {
        type: Number,
        require: true,
        trim: true,
        default: 0
    },
    linkType: {
        type: String,
        trim: true,
        default: null
    },
    deviceType: {
        type: String,
        default: null
    },
    os: {
        type: String,
        default: null
    },
    browser: {
        type: String,
        default: null
    }

},
    {
        timestamps: true
    },

)
const TrackBtnClicked_Model = model('TrackBtn', TrackBtnClicked);

module.exports = TrackBtnClicked_Model;