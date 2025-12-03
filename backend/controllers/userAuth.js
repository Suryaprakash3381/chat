const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const chat = require('../models/chat.js')
const Message = require('../models/message.js')
const httpStatus = require('http-status');
const authMiddleware = require('../middlewares/authMiddleware');
const Chat = require('../models/chat.js');

const router = express.Router();

// 🟢 REGISTER
router.post('/check', (req, res) => {
  console.log('Body received:', req.body);
  res.json({ received: req.body });
});


router.post('/register', async (req, res) => {
 
  try {
    const { username, email, password } = req.body;

    console.log('Incoming body:', req.body);

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
    });

  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

// 🟢 LOGIN
router.post('/login', async (req, res) => {
  
  const { email, password } = req.body;


  try {

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

   

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.SECRET_TOKEN,
      { expiresIn: '1h' }
    );

    res.cookie('token', token, { httpOnly: true });

    res.json({
      success: true,
      message: 'Login successful',
      token,
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: error.message || 'Internal server error' });
  }
});

// 🟢 LOGOUT
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: false,      // set true if using HTTPS
      sameSite: "lax",    // must match your login cookie
      path: "/"           // VERY IMPORTANT
    });

    return res.json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🟢 search friend route
router.post('/searchUser' , authMiddleware , async(req , res) => {
  try {
        const {name}  = req.body;
        const searchedUser = await User.findOne({username: name}).select('-password');
         
        if(!searchedUser){
          return res.status(404).send({
            message : "No user found",
            success : false
          })
        } else {
          res.status(200).send({
            message : "User found successfully",
            success : true,
            data : searchedUser
          })
        }
          
  } catch (error) {
    console.log(error.message)
    res.status(500).send({
      message : error.message,
      success : false
    })
  }
})

// // 🟢 GET ALL USERS (except logged-in one)
// router.get('/Allusers', authMiddleware, async (req, res) => {
//   try {
//     const loggedInUserId = req.userId;
//     const users = await User.find({ _id: { $ne: loggedInUserId } }).select('-password');

//     res.status(200).json({
//       success: true,
//       message: 'All users fetched successfully',
//       data: users,
//     });
//   } catch (error) {
//     console.error('AllUsers Error:', error.message);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// 🟢   start chat api

router.post("/startChat", authMiddleware, async (req, res) => {
  try {
    const loggedInUserId = req.user.id;  
    const otherUserId = req.body.userId;

    // ❗ Check if chat already exists
    let existingChat = await chat.findOne({
      members: { $all: [loggedInUserId, otherUserId] }
    });

    if (existingChat) {
      return res.status(200).send({
        success: true,
        message: "Chat already exists",
        data: existingChat,
      });
    }

    // ❗ Create a new chat
    const newChat = new chat({
      members: [loggedInUserId, otherUserId],
    });

    const savedChat = await newChat.save();

    res.status(201).send({
      message: "A new chat is created",
      success: true,
      data: savedChat,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
});


//🟢  Get all chats
router.get("/allChats" , authMiddleware , async (req , res)=>{
  try {
    const allChats = await chat
  .find({ members: { $in: req.user.id } })
  .populate("members", "username email");
    res.status(200).send({
      message : "All chat found successfully.",
      success : true,
      data :  allChats
    })
    
  } catch (error) {
    console.log(error.message)
    res.status(200).send({
      message: error.message,
      success : false,

    })
  }
})

//🟢  send a new sms
router.post("/sendSms" , authMiddleware , async(req , res) =>{
  try {
    //save the message in the message collection
    const newMessage = new Message(req.body)
    console.log(req.body)
    const savedMessage = await newMessage.save()

    //update the last message in chat collection

    const currentChat =  await Chat.findOneAndUpdate({
      _id : req.body.chatId
    } , {
      lastMessage : savedMessage._id,
      $inc : {unreadmessageCount : 1}
    })

    res.status(200).send({
      message: "Sms send successfully",
      success: true,
      data : savedMessage
    })
    
  } catch (error) {
    console.log(error.message)
    res.status(400).send({
      message : error.message,
      success: false
    })
  }
})

//🟢 get sma route

router.get("/getSms/:chatId", authMiddleware, async (req, res) => {
  try {
    const allMessages = await Message.find({ chatId: req.params.chatId })
      .sort({ createdAt: 1 }); // ascending (old → new)

    res.status(200).send({
      message: "All messages found",
      success: true,
      data: allMessages
    });

  } catch (error) {
    console.log(error.message);

    res.status(400).send({
      message: error.message,
      success: false
    });
  }
});




module.exports = router;
