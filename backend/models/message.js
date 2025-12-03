const mongoose = require('mongoose');
const Chat = require('./chat');
const User = require('./user.model');

const messageSchema = new mongoose.Schema({
  chatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chats", // use string name of model instead of variable
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reciever: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,  // ✅ Capitalized
    required: true,
  },
  read: {
    type: Boolean, // ✅ Capitalized
    default: false,
  },
}, { timestamps: true }); // optional but good for tracking message time

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
