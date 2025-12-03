const express = require('express');
const User = require('../models/user.model');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// 🟢 GET USER BIO
router.get('/dashboard', authMiddleware, async (req, res) => {
    try {

        const userId = req.user.id;
        const user = await User.findById(userId)
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });


        } else {
            return res.status(200).json({
                success: true,
                user : user
            });
        }
       


        
    } catch (error) {
        console.log('Get Bio Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
})

// 🟢 UPDATE USER BIO

router.put('/dashboard/edit', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio } = req.body;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }
        user.bio = bio;
        await user.save();
        res.status(200).json({
            success: true,
            message: 'Bio updated successfully',
        });
        
    } catch (error) {
        console.log('Update Bio Error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server Error',
        });
    }
})

module.exports = router;