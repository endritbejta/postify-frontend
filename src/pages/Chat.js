import React, { useEffect, useRef, useState } from "react";
import Navigation from "../components/header/Navigation";
import classes from "./styles/Chat.module.css";
import { useSelector } from "react-redux";
import { selectUser } from "../store/slices/authSlice";
import { userChats } from "../api/ChatRequests";
import Conversation from "../components/chats/Conversation";
import ChatBox from "../components/chats/ChatBox";
import { io } from "socket.io-client";

const Chat = () => {
  const user = useSelector((state) => selectUser(state));
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState();
  const [sendMessage, setSendMessage] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState(null);
  const socket = useRef();

  useEffect(() => {
    const getChats = async () => {
      try {
        const { data } = await userChats(user?._id);
        setChats(data);
      } catch (error) {
        console.log(error);
      }
    };
    getChats();
  }, [user]);

  useEffect(() => {
    socket.current = io("http://localhost:5000");
    socket.current.emit("new-user-add", user?._id);
    socket.current.on("get-users", (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  //sending message to socket server
  useEffect(() => {
    if (sendMessage !== null) {
      socket.current.emit("send-message", sendMessage);
    }
  }, [sendMessage]);

  //receiving message from socket server
  useEffect(() => {
    socket.current.on("receive-message", (data) => {
      console.log(data);
      setReceivedMessage(data);
    });
  }, []);

  // Handle the received message and update the chat's messages
  useEffect(() => {
    if (
      receivedMessage !== null &&
      receivedMessage.chatId === currentChat?._id
    ) {
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === receivedMessage.chatId
            ? { ...chat, messages: [...(chat.messages || []), receivedMessage] }
            : chat
        )
      );
    }
  }, [receivedMessage, currentChat, setChats]);

  const checkOnlineStatus = (chat) => {
    const chatMember =
      chat.members && chat.members.find((member) => member !== user._id);
    const online =
      onlineUsers && onlineUsers.find((user) => user.userId === chatMember);
    return online ? true : false;
  };

  return (
    <>
      <Navigation />
      <div className={classes.Chat}>
        {/**Left Side */}
        <div className={classes["left-side-chat"]}>
          <div className={classes["chat-container"]}>
            <h3
              style={{
                fontFamily: "Montserrat, sans-serif",
                fontWeight: "500",
                fontSize: "22px",
              }}
            >
              Messages
            </h3>
            <div className={classes["chat-list"]}>
              {chats.map((chat) => (
                <div key={chat?._id} onClick={() => setCurrentChat(chat)}>
                  <Conversation
                    data={chat}
                    currentUserId={user._id}
                    online={checkOnlineStatus(chat)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/**Right Side */}
        <div className={classes["right-side-chat"]}>
          <ChatBox
            chat={currentChat}
            currentUser={user?._id}
            setSendMessage={setSendMessage}
            receivedMessage={receivedMessage}
          />
        </div>
      </div>
    </>
  );
};

export default Chat;
