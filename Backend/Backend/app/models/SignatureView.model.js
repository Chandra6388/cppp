const mongoose = require('mongoose');
const { Schema } = mongoose;

const ViewCountSchema = new Schema({
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
    viewedAt: {
        type: Date,
        default: Date.now
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
);

module.exports = mongoose.model('ViewCount', ViewCountSchema);
