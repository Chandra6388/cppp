"use strict"
const { Schema, model } = require('mongoose');
const ContactUsSchema = Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
}
    , {
        timestamps: true,
    }

);

const ContactUs_model = model('contactus', ContactUsSchema);

module.exports = ContactUs_model;



