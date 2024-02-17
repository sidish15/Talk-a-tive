import { ViewIcon } from '@chakra-ui/icons';
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import axios from 'axios';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain ,fetchMessages}) => {
        const { isOpen, onOpen, onClose } = useDisclosure();

        //state for updated group chat(same as we were doing when we are creating a group in left box)
        const [groupChatName, setGroupChatName] = useState();
        const [search, setSearch] = useState("");
        const [searchResult, setSearchResult] = useState([]);
        const [loading, setLoading] = useState(false);

        const [renameLoading, setRenameLoading] = useState(false);

        const toast = useToast();
        //Context
        const { selectedChat, setSelectedChat, user } = ChatState();

        const handleAddUser=async(user1)=>{
                //check whether the selected user is already in the group 
                if(selectedChat.users.find((u)=>u._id ===user1._id)){
                        toast({
                                title: "User Already in group!",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom",
                        });
                        return ;
                }
                //check whether the selected user is group admin or not(as only admin is allowed to add someone)
                if(selectedChat.groupAdmin._id!==user._id){
                        toast({
                                title: "Only admins can add someone!",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom",
                        });
                        return ;
                }
                try {
                        setLoading(true);
                        const config = {
                                headers: {
                                        Authorization: `Bearer ${user.token}`,
                                },
                        };
                        const {data}=await axios.put("/api/chat/groupadd",{
                              chatId:selectedChat._id,
                              userId:user1._id
                        },config)
                        
                        // setselectedchat
                        setSelectedChat(data);
                        // fetch the chats again
                        setFetchAgain(!fetchAgain)
                        // loading false
                        setLoading(false)
                } catch (error) {
                        toast({
                                title: "Error Occured!",
                                description:error.response.data.message,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom",
                        });
                        // loading false
                        setLoading(false);
                }
               };
       
        const handleRemove = async (user1) => {
                if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
                  toast({
                    title: "Only admins can remove someone!",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  return;
                }
            
                try {
                  setLoading(true);
                  const config = {
                    headers: {
                      Authorization: `Bearer ${user.token}`,
                    },
                  };
                  const { data } = await axios.put(
                    `/api/chat/groupremove`,
                    {
                      chatId: selectedChat._id,
                      userId: user1._id,
                    },
                    config
                  );
             
                  user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
                  setFetchAgain(!fetchAgain);
                  //fetching msg when someone is removed from the group so that all the msg got refreshed
                  fetchMessages();
                  setLoading(false);
                } catch (error) {
                  toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                  });
                  setLoading(false);
                }
                
              };
              
       const  handleRename=async()=>{
      if(!groupChatName) return;
      try {
        setRenameLoading(true);
        const config={
                headers:{
                        Authorization:`Bearer ${user.token}`
                }
        }
        const {data}=await axios.put("/api/chat/rename",{
                chatId:selectedChat._id,
                chatName:groupChatName
        },config)
        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        // fetchAgain was initialized by false ,now it is true means fetchdata again and we have provide this function in dependency array in the MyChats.jsx
        setRenameLoading(false);


      } catch (error) {
         toast({
                                title: "Error Occured!",
                                description: "error.response.data.message",
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom",
                        });
                        setRenameLoading(false)
      }
      //empty the box of rename
      setRenameLoading("")
       }

       const handleSearch = async (query) => {
        setSearch(query);
        if (!query) {
                return;
        }
      

        try {
                setLoading(true);
                const config = {
                        headers: {
                                Authorization: `Bearer ${user.token}`,
                        },
                };
                const { data } = await axios.get(`/api/user?search=${search}`, config);
                console.log(data);
                setLoading(false);
                setSearchResult(data);
        } catch (error) {
                toast({
                        title: "Error Occured!",
                        description: "Failed to Load the Search Results",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-left",
                });
        }
};

    
     

        return (
                <>
                        <IconButton display={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

                        <Modal isOpen={isOpen} onClose={onClose} isCentered>
                                <ModalOverlay />
                                <ModalContent>
                                        <ModalHeader
                                                fontSize="35px"
                                                fontFamily="Work sans"
                                                display="flex"
                                                justifyContent="center"
                                        >{selectedChat.chatName}</ModalHeader>
                                        <ModalCloseButton />

                                        <ModalBody>
                                                {/* rendering all of the user which is already inside this group */}
                                                <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
                                                        {selectedChat.users.map((u)=>(
                                                                <UserBadgeItem
                                                                key={u._id}
                                                                user={u}
                                                                handleFunction={() => handleRemove(u)}
                                                                />
                                                        )

                                                        )}
                
                                                </Box>

                                                {/* First Form Control for renaming the group */}
                                                <FormControl display="flex">
                                                        <Input
                                                        placeholder="Chat Name"
                                                        mb={3}
                                                        value={groupChatName}
                                                        onChange={(e)=>setGroupChatName(e.target.value)}
                                                        />
                                                        <Button
                                                        variant="solid"
                                                        colorScheme='teal'
                                                        ml={1}
                                                        isLoading={renameLoading}
                                                        onClick={handleRename}
                                                        >
                                                                Update

                                                        </Button>

                                                </FormControl>

                                                <FormControl>
                                                        <Input
                                                        placeholder='Add User to group'
                                                        mb={1}
                                                        onChange={(e)=>handleSearch(e.target.value)}
                                                        />
                                                </FormControl>
                                       {/* rendering all the users after searching  ,exactly the same as group update*/}
                                       {
                                        loading ? (
                                                <Spinner size="lg"/>
                                        ):(
                                                searchResult?.map((user)=>(
                                                        <UserListItem
                                                        key={user._id}
                                                        user={user}
                                                        handleFunction={()=>handleAddUser(user)}
                                                        />
                                                ))
                                        )
                                       }

                                        </ModalBody>

                                        <ModalFooter>
                                                <Button colorScheme='red'  onClick={()=>handleRemove(user)}>
                                                      Leave Group
                                                </Button>
                                        </ModalFooter>
                                </ModalContent>
                        </Modal>
                </>
        )
}

export default UpdateGroupChatModal
