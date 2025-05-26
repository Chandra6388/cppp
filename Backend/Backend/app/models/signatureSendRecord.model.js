const mongoose = require('mongoose');
const { Schema } = mongoose;

const SignatureSendRecord = new Schema({
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
    
},
    {
        timestamps: true
    },
);

module.exports = mongoose.model('SignatureSendRecord', SignatureSendRecord);
