const mongoose = require('mongoose');
const Message = require('../models/message')

const chatSchema = new mongoose.Schema({
    members: {
        type:[
            {type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
        ]
    },
    lastMessage : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    },
    unreadmessageCount: {
        type: Number,
        default: 0
    }
} , {timestamps: true});

const Chat = mongoose.model('Chats', chatSchema);
module.exports = Chat;