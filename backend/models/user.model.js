const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    bio:{
        type: String,
        default: '',
    },
    profilePic : {
        type: String,
        default: '',
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

