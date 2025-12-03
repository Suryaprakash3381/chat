import React, { useState, useEffect } from "react";
import Detail from "../components/Detail.jsx";
import axios from "axios";
import Nomessage from "../components/Nomessage.jsx";
import Default from "../assets/Default.png";
import { io } from "socket.io-client";

// SOCKET CLIENT
const socket = io("http://localhost:7000");

function Dashboard() {
  const [searchText, setSearchText] = useState("");
  const [searchedUser, setSearchedUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState("");
  const [chatId, setChatId] = useState(null);
  const [friendProfile, setFriendProfile] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [messages, setMessages] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);

  // GET ALL CHATS
  useEffect(() => {
    axios
      .get("http://localhost:7000/api/auth/allChats", { withCredentials: true })
      .then((res) => {
        if (res.data.success) setChats(res.data.data);
      });
  }, []);

  // GET CURRENT USER
  useEffect(() => {
    axios
      .get("http://localhost:7000/api/user/dashboard", { withCredentials: true })
      .then((res) => setLoggedInUser(res.data.user));
  }, []);

  // SEARCH USER
  const HandleClick = () => {
    axios
      .post(
        "http://localhost:7000/api/auth/searchUser",
        { name: searchText },
        { withCredentials: true }
      )
      .then((res) => setSearchedUser(res.data.data))
      .catch(() => setSearchedUser(null));
  };

  // START CHAT
  const HandleChat = () => {
    axios
      .post(
        "http://localhost:7000/api/auth/startChat",
        { userId: searchedUser._id },
        { withCredentials: true }
      )
      .then(() =>
        axios.get("http://localhost:7000/api/auth/allChats", {
          withCredentials: true,
        })
      )
      .then((res) => setChats(res.data.data));

    setSearchText("");
    setSearchedUser(null);
  };

  // WHEN USER OPENS A CHAT
  const getChat = (chat) => {
    setChatId(chat._id);

    const otherUser = chat.members.find(
      (m) => m._id !== loggedInUser._id
    );

    setFriendProfile(otherUser);

    // JOIN SOCKET ROOM
    socket.emit("joinRoom", chat._id);

    axios
      .get(`http://localhost:7000/api/auth/getSms/${chat._id}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data.data));
  };

  // RECEIVE REALTIME MESSAGE
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [chatId]);

  // SEND MESSAGE
  const handleSendMessage = () => {
    if (!messageText.trim() || !chatId) return;

    const payload = {
      chatId,
      sender: loggedInUser._id,
      message: messageText,
      reciever: friendProfile._id,
    };

    // SEND MESSAGE VIA SOCKET
    socket.emit("sendMessage", payload);

    // SAVE TO DB
    axios
      .post("http://localhost:7000/api/auth/sendSms", payload, {
        withCredentials: true,
      })
      .then(() => setMessageText(""));
  };

  return (
    <>
      <div className="flex h-screen bg-gray-100">
        
        {/* LEFT MENU */}
        <div
          className={`fixed md:static top-0 left-0 z-30 h-full w-72 bg-white shadow-md border-r transform 
          ${mobileMenu ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
          transition-transform duration-300`}
        >
          <div className="p-4 overflow-y-auto h-full flex flex-col gap-4">

            <Detail />

            {/* SEARCH */}
            <input
              type="text"
              placeholder="Search for friends"
              className="border rounded-lg p-3 w-full bg-gray-50 focus:ring-2 focus:ring-blue-400 outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <button
              onClick={HandleClick}
              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 font-semibold"
            >
              Find Friends
            </button>

            {/* SEARCH RESULT */}
            {searchedUser && (
              <div className="p-3 bg-white border rounded-lg flex justify-between items-center shadow-sm">
                <div>
                  <p className="font-bold">{searchedUser.username}</p>
                  <p className="text-gray-500 text-sm">{searchedUser.email}</p>
                </div>
                <button
                  onClick={HandleChat}
                  className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-green-500"
                >
                  Chat
                </button>
              </div>
            )}

            {/* CHAT LIST */}
            <p className="font-bold text-lg mt-2">Your Chats</p>

            <div className="space-y-2 overflow-y-auto">
              {chats.map((chat) => {
                const otherUser = chat.members.find(
                  (m) => m._id !== loggedInUser._id
                );
                return (
                  <div
                    key={chat._id}
                    onClick={() => {
                      getChat(chat);
                      setMobileMenu(false);
                    }}
                    className="p-3 bg-white rounded-lg shadow cursor-pointer hover:bg-blue-100"
                  >
                    <p className="font-semibold">{otherUser?.username}</p>
                    <p className="text-sm text-gray-600">{otherUser?.email}</p>
                  </div>
                );
              })}
            </div>

          </div>
        </div>

        {/* RIGHT CHAT AREA */}
        <div className="flex-1 flex flex-col">

          {/* MOBILE TOP BAR */}
          <div className="md:hidden p-3 bg-white shadow flex items-center gap-3">
            <button
              onClick={() => setMobileMenu(true)}
              className="p-2 bg-gray-200 rounded-md"
            >
              ☰
            </button>
            <p className="font-bold text-lg">Messages</p>
          </div>

          {/* NO CHAT SELECTED */}
          {!chatId ? (
            <div className="flex items-center justify-center flex-1">
              <Nomessage />
            </div>
          ) : (
            <>
              {/* HEADER */}
              <div className="bg-white p-4 shadow-md flex items-center gap-4">
                <img
                  src={friendProfile?.profilePic || Default}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <p className="font-bold text-lg">{friendProfile?.username}</p>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`flex ${
                      msg.sender === loggedInUser._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-2xl max-w-xs ${
                        msg.sender === loggedInUser._id
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="p-4 bg-white border-t flex items-center gap-3">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-100 p-3 rounded-xl outline-none"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>

      </div>
    </>
  );
}

export default Dashboard;
