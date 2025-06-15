"use strict"
const { Schema, model } = require('mongoose');
const BlogsSchema = Schema({
    authorName: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,

    },
    discription: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
        required: true
    },
    likes: {
        type: Number,
        trim: true,
        default: 0,
    }

}
    , {
        timestamps: true,
    }

);

const Blogs_model = model('blog', BlogsSchema);

module.exports = Blogs_model;



