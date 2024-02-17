import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuItemOption, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";

import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ChatLoading from '../ChatLoading.jsx';
import UserListItem from '../UserAvatar/UserListItem';
import { getSender } from '../../config/ChatLogics';
import { Effect } from "react-notification-badge"
import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge';

const SideDrawer = () => {
        const navigate = useNavigate();
        const [search, setSearch] = useState("");
        const [searchResult, setSearchResult] = useState([])
        const [loading, setLoading] = useState(false);
        const [loadingChat, setLoadingChat] = useState(false);

        const { user, setSelectedChat, chats, setChats,notification,setNotification} = ChatState();
        const { isOpen, onOpen, onClose } = useDisclosure()

        const logoutHandler = () => {
                localStorage.removeItem("userInfo");
                navigate("/")
        }
        const toast = useToast();
        const handleSearch = async () => {
                if (!search) {
                        toast({
                                title: "Please Enter something in search",
                                status: "warning",
                                duration: 5000,
                                isClosable: true,
                                position: "top-left",
                        });
                        return;
                }
                try {
                        setLoading(true);
                        const config = {
                                headers: {
                                        Authorization: `Bearer ${user.token}`
                                }
                        }
                        const { data } = await axios.get(`/api/user?search=${search}`, config)
                        setLoading(false);
                        setSearchResult(data);
                        console.log("searchResult", searchResult)
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
        }
        //create one or one chat or render one to one chat
        const accessChat = async (userId) => {
                console.log(userId);
                try {
                        setLoadingChat(true);
                        const config = {
                                headers: {
                                        "Content-type": "application/json",
                                        Authorization: `Bearer ${user.token}`,
                                },
                        }
                         const { data } = await axios.post(`/api/chat`, { userId }, config);
                        
                         //checking whether the chat that we are about to create by clicking do exist already in chats or not
                         if (!chats.find((c) => c._id === data._id)) {
                                //click karne wali chat fetch data main nahi mili...do update chats
                                setChats([data, ...chats]);
                        }
                        setSelectedChat(data);
                        setLoadingChat(false);
                        onClose();

                } catch (error) {
                        toast({
                                title: "Error fetching the chat",
                                description: error.message,
                                status: "error",
                                duration: 5000,
                                isClosable: true,
                                position: "bottom-left",
                              });
                }
        }
        return (
                <>
                        <Box

                                display="flex"
                                justifyContent="space-between"
                                alignItems="center"
                                bg="white"
                                w="100%"
                                p="5px 10px 5px 10px"
                                borderWidth="5px"

                        >
                                {/* sidedrawer */}

                                <Tooltip label="Search Users to chat" hasArrow placement='bottom-end'>
                                        <Button variant="ghost" onClick={onOpen}>
                                                <i className="fas fa-search"></i>
                                                <Text display={{ base: "none", md: "flex" }} px={4}>
                                                        Search User
                                                </Text>
                                        </Button>

                                </Tooltip>

                                {/* title */}
                                <Text fontSize="2xl" fontFamily="Work sans">
                                        Talk-A-Tive
                                </Text>

                                {/* Menu button */}
                                <div>
                                        {/* Bell icon */}
                                        <Menu>
                                                <MenuButton p={1}>
                                                        {/* displaying notification indicator */}
                                                        <NotificationBadge
                                                        count={notification.length}
                                                        effect={Effect.SCALE}
                                                        />
                                                        <BellIcon fontSize="2xl" m={1} />
                                                </MenuButton>
                                                <MenuList
                                                pl={2}
                                                >
                                                        {!notification.length && "No New Messages"}
                                                        {notification.map(notif => (
                                                                <MenuItem key={notif._id} 
                                                                onClick={()=>{
                                                                        setSelectedChat(notif.chat);
                                                                        // remove that notification after clicking by filter it out
                                                                        // if the current chat in notification is not equal to notif then dont return it ,return only notif
                                                                        setNotification(notification.filter((n)=>n!==notif))

                                                                }}>
                                                                        {notif.chat.isGroupChat 
                                                                        ? `New Message in ${notif.chat.chatName}`
                                                                        :`New Message from ${getSender(user,notif.chat.users)}`}

                                                                </MenuItem>
                                                        ))}
                                                </MenuList>
                                        </Menu>
                                        {/* Avatar and ProfileModal */}
                                        <Menu>
                                                <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
                                                        <Avatar
                                                                size="sm"
                                                                cursor="pointer"
                                                                name={user.name}
                                                                src={user.pic}
                                                        />
                                                </MenuButton>
                                                <MenuList>
                                                        <ProfileModal user={user}>

                                                                <MenuItem>My Profile</MenuItem>
                                                        </ProfileModal>
                                                        <MenuDivider />
                                                        <MenuItem onClick={ logoutHandler}>Logout</MenuItem>
                                                </MenuList>
                                        </Menu>

                                </div>

                        </Box>

                        <Drawer placement='left' onClose={onClose} isOpen={isOpen}>
                                <DrawerOverlay />
                                <DrawerContent>
                                        <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                                        <DrawerBody>
                                                <Box display="flex" pb={2} >
                                                        <Input
                                                                placeholder="Search by name or email"
                                                                mr={2}
                                                                value={search}
                                                                onChange={(e) => setSearch(e.target.value)}
                                                        />
                                                        <Button
                                                                onClick={handleSearch}
                                                        >
                                                                Go
                                                        </Button>

                                                </Box>
                                                {loading ? (
                                                        <ChatLoading />
                                                ) : (
                                                        searchResult?.map((user) => (
                                                                <UserListItem
                                                                        key={user._id}
                                                                        user={user}
                                                                        handleFunction={() => accessChat(user._id)}
                                                                />
                                                        ))
                                                )}
                                                {loadingChat && <Spinner ml="auto" display="flex"/>}
                                        </DrawerBody>
                                </DrawerContent>

                        </Drawer>
                </>
        )
}

export default SideDrawer
