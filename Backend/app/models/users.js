"use strict";

const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userModel = new Schema({
    FirstName: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    LastName: {
        type: String, 
        trim: true,
        default: null
    },
    
    profile_img: {
        type: String,
        trim: true,
        default: null
    },
    Email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null
    },
    PhoneNo: {
        type: String,
        trim: true,
        unique: true,
        default: null
    },
    Password: {
        type: String,
        trim: true,
        default: null
    },
    totalSignatureView: {
        type: Number,
        trim: true,
        default: 0
    },
    ActiveStatus: {
        type: String,
        enum: ['1', '0'],
        default: '1'
    },
    Subscribed_Plan: [{
        planId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'signatures'
        }
    }],
    DOB: {
        type: String,
        trim: true,
        default: null
    },
    address: {
        type: String,
        trim: true,
        default: null
    },
    country: {
        type: String,
        trim: true,
        default: null
    },
    Is_Active: {
        type: Boolean,
        default: true
    },
    Is_AdminDeleted: {
        type: Boolean,
        default: false
    },
    isNotifyViaEmail: {
        type: Boolean,
        default: true
    },
    isNotifyViaWhatsapp: {
        type: Boolean,
        default: true
    },
    isGoogleLogin : {
        type: Boolean,
        default: false
    },
    Role: {
        type: String,
        enum: ['ADMIN', 'USER', "EMPLOYEE", "SUPERADMIN"],
        required: true,
        default: 'USER'
    }
}, {
    timestamps: true
});

const User_model = model('USER', userModel);

module.exports = User_model;
