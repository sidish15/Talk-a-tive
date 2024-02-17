import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider';
import { ArrowBackIcon, SpinnerIcon } from '@chakra-ui/icons';
import { getSender, getSenderFull } from '../config/ChatLogics';
import ProfileModal from './miscellaneous/ProfileModal';
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal';
import axios from 'axios';
import "./styles.css"
import ScrollableChat from './ScrollableChat';
import io from "socket.io-client";
import Lottie, {  } from "react-lottie"
import animationData from "../animations/typing.json"

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
const SingleChat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing,setTyping]=useState(false);
  const [isTyping,setIsTyping]=useState(false);

  const toast = useToast();
  const { user, selectedChat, setSelectedChat ,notification,setNotification} = ChatState();

  // function for fetching all of the chat 
  const fetchMessages = async () => {
    if (!selectedChat) return;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      setLoading(true);
      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      // console.log("fetched msg", messages)
      setLoading(false);
      // emit the signal to join room
      socket.emit("join chat", selectedChat._id)

    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  }
  // below one should be at top so that socket get initialize first
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true)
    })
    // connecting to that room which is typing
    
    socket.on("typing",()=>setIsTyping(true))
    socket.on("stop typing",()=>setIsTyping(false))

  },[])
  useEffect(() => {
    fetchMessages()

    selectedChatCompare = selectedChat;
  }, [selectedChat])


  // console.log(notification, "---------------");
// receiving the msg from socket
  useEffect(()=>{
    socket.on("message received",(newMessageReceived)=>{
      // if none of chat is selected or the chat which is selected doesnt match the currently chat
      if(!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.chat._id ){
        // give notification
        // check if notification that are already there does not include the message that is coming in
        if(!notification.includes(newMessageReceived)){
          //  add the new message received to notification array
               setNotification([newMessageReceived, ...notification])
              //  update the list of our chat so that latest msg is updated accordingly
               setFetchAgain(!fetchAgain);
        }

      }else{
        // add it to list of our messages
        setMessages([...messages,newMessageReceived])
      }
    })
  })

  // function for sending a message
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      // stop the loading after hitting the enter button
      socket.emit("stop typing",selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        // empty the input box
        setNewMessage("");

        const { data } = await axios.post("/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          }, config
        );
        // console.log(data)

        // sending msg from socket(newMessage will contain data that we received from our api call)
       socket.emit("new message",data)

        //whatever coming from the above api take it and append it to messages
        setMessages([...messages, data])
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }
  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    // Typing Indicator Logic
    if(!socketConnected) return ;
    
    // as typing is initializes with false
    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id)
    }

    let lastTypingTime=new Date().getTime();
    var timerLength=3000;
    setTimeout(()=>{
      var timeNow=new Date().getTime();
      var timeDiff=timeNow - lastTypingTime;
      // if typing is going on and nothing is typed more than 3 sec than stop the socket
      if(timeDiff  >=timerLength && typing ){
        socket.emit("stop typing",selectedChat._id)
        setTyping(false);
      }
    },timerLength)

  }

  const defaultOptions={
    loop:true,
    autoplay:true,
    animationData:animationData,
    rendererSettings:{
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  return (
    <>
      {
        selectedChat ? (
          <>
            <Text
              fontSize={{ base: "28px", md: "30px" }}
              pb={3}
              px={2}
              w="100%"
              fontFamily="Work-sans"
              display="flex"
              justifyContent={{ base: "space-between" }}
              alignItems="center"
            >
              <IconButton
                display={{ base: "flex", md: "none" }}
                icon={<ArrowBackIcon />}
                onClick={() => setSelectedChat("")}
              //       none is selected onclicking so we go back to our list of chats only in mobile mode
              />

              {!selectedChat.isGroupChat ? (
                <>
                  {/* Name of the Chat */}
                  {getSender(user, selectedChat.users)}
                  {/* Profile Model icon */}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}

                  {/* defining component for updating the group if the selectedChat is Group Chat */}
                  {<UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />}
                </>
              )

              }

            </Text>

            <Box
              display="flex"
              flexDir="column"
              justifyContent="flex-end"
              p={3}
              bg="#E8E8E8"
              w="100%"
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
            >
              {/* Messages here */}
              {loading ? (
                <Spinner
                  size="xl"
                  w={20}
                  h={20}
                  alignSelf="center"
                  margin="auto"
                />
              ) : (
                <div className="messages">
                  {/* Messages */}
                  <ScrollableChat messages={messages} />
                </div>

              )}
              {/*  all the messages*/}
              {/*  input bar where messages is type*/}
              <FormControl onKeyDown={sendMessage} isRequired mt={3}>
                {isTyping ? <div>
                 <Lottie 
                 options={defaultOptions}
                 width={70}
                 style={{marginBottom:15,marginLeft:0}}
                 />
                </div> : <></>}
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />

              </FormControl>


            </Box>
          </>
        ) : (
          <Box display="flex" alignItems="center" justifyContent="center" h="100%">
            <Text fontSize="3xl" pb={3} fontFamily="Work sans">
              Click on a user to start chatting
            </Text>
          </Box>
        )
      }
    </>
  )
}

export default SingleChat
