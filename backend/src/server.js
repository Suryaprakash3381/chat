const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

// Route files
const userAuthRoutes = require('../controllers/userAuth.js');
const userRoutes = require('../controllers/userBio.js');

// EXPRESS APP
const app = express();

// CREATE HTTP & SOCKET SERVER
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true
    }
});

// SOCKET.IO REALTIME LOGIC
io.on("connection", (socket) => {
    console.log("🔥 A user connected:", socket.id);

    socket.on("joinRoom", (chatId) => {
        socket.join(chatId);
        console.log(`User joined chat room: ${chatId}`);
    });

    socket.on("sendMessage", (data) => {
        io.to(data.chatId).emit("receiveMessage", data);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

// MIDDLEWARE
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ROUTES
app.use('/api/auth', userAuthRoutes);
app.use('/api/user', userRoutes);

// CONNECT MONGODB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));

// DEFAULT ROUTE
app.get("/", (req, res) => {
    res.send("Hello World");
});

// START SERVER
server.listen(process.env.PORT, () => {
    console.log(`🚀 Server running on port ${process.env.PORT}`);
});
