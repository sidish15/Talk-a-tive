import { useNavigate } from "react-router-dom";
import React from "react";
const { createContext, useContext, useEffect, useState } = require("react");

const ChatContext = createContext()

const ChatProvider = ({ children }) => {

        //states
        //1.user:Current logged In user
        //2.selectedChat:a one on one chat with friend
        //3.chats:all the fetched chats from the db
        
        const navigate = useNavigate();
        const [user, setUser] = useState()
        const [selectedChat,setSelectedChat]=useState()
        const [chats,setChats]=useState([]);
        const [notification,setNotification]=useState([])
        
        useEffect(() => {
                const userInfo = JSON.parse(localStorage.getItem("userInfo"));
                setUser(userInfo);

                //if the user is not logged in ,its redirected to a login page
                if (!userInfo) {
                        navigate("/")
                }

        }, [])


        return (
                <ChatContext.Provider value={{ user, setUser ,selectedChat,setSelectedChat,chats,setChats,notification,setNotification}}>
                        {children}
                </ChatContext.Provider>
        )
}

export const ChatState = () => {

        return useContext(ChatContext);
}

export default ChatProvider;