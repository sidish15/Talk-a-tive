import React, { useEffect, useState } from 'react'
import axios from "axios";
import { ChatState } from '../Context/ChatProvider';
import { Box } from '@chakra-ui/react';
import SideDrawer from '../components/miscellaneous/SideDrawer';
import MyChats from '../components/MyChats';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {

//state for fetching the data again after selecting a chat(parent)
const [fetchAgain,setFetchAgain]=useState(false);
const {user}=ChatState()

  return (<>
  {/* header and side drawer */}
    <div style={{width:"100%"}} >
    {user && <SideDrawer/>}

    {/* My chats & ChatBox */}
    <Box 
    display="flex"
    justifyContent="space-between"
    w="100%"
    h="91.5vh"
    p="10px"
    border="1px solid red"
    >
      {user && <MyChats fetchAgain={fetchAgain} />}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    </div>
  </>
  )
}

export default ChatPage
