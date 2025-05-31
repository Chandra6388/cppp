"use strict"
const { Schema, model } = require('mongoose');
const mongoose = require('mongoose')

const TemplatesModel = Schema({
    TemplatesName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        default: null
    },
    htmlCode: {
        type: String,
        require: true,
        trim: true,
        default: null
    }

},
    {
        timestamps: true
    },

)
const Templates_Model = model('Templates', TemplatesModel);

module.exports = Templates_Model;