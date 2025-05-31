const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const SignatureModel = Schema({
    SignatureName: {
        type: String,
        required: true,
        trim: true,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'USER'
    },
    Templates_Id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Templates'
    },
    usageCount: {
        type: Number,
        trim: true,
        default: 0,
    },
    lastUsed: {
        type: String,
        trim: true,
        default: null,
    },
    viewedTrackers: {
        type: [String],
        default: []
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    details: {
        fullName: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
        },
        jobTitle: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        company: {
            type: String,
            required: true,
            trim: true,
        },
        website: {
            type: String,
            required: true,
            trim: true,
        },
        layout: {
            type: String,
            required: true,
            trim: true,
        },
        address: {
            type: String,
            required: true,
            trim: true,
        },
        headshot_url: {
            type: String,
            required: true,
            trim: true,
        },
        buttons: [
            {
                id: {
                    type: String,
                    trim: true,
                    require: true,
                },
                text: {
                    type: String,
                    required: true,
                    trim: true,
                },
                type: {
                    type: String,
                    enum: ['contact_us', 'join_meeting', 'visit_website', 'book_meeting', 'leave_review'],
                    required: true
                },
                connect_with: {
                    type: String,
                    required: true,
                    trim: true,
                },
                color: {
                    type: String,
                    required: true,
                    trim: true,
                },
                fontStyle: {
                    type: String,
                    required: true,
                    trim: true,
                }
            }
        ],
        socialMedia: [
            {
                id: {
                    type: String,
                    trim: true,
                    require: true,
                },
                type: {
                    type: String,
                    enum: ['Linkedin', 'Whatsapp', 'Twitter', 'Facebook', 'Instagram'],
                    required: true
                },
                link: {
                    type: String,
                    required: true,
                    trim: true,
                },
            }
        ],
        background: {
            id: {
                type: String,
                trim: true,
                require: true,
            },
            label: {
                type: String,
                trim: true,
                require: true,
            },
            background_type: {
                type: String,
                trim: true,
                default: null,
            },
            background_value: {
                type: String,
                trim: true,
                default: null
            }
        },
        html: {
            type: String,
            trim: true,
        }
    },
},
    {
        timestamps: true
    },

)
const Signature_model = model('Signature', SignatureModel);

module.exports = Signature_model;