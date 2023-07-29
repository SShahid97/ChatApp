import { BellIcon, ChevronDownIcon, SearchIcon } from '@chakra-ui/icons';
import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import {Spinner} from "@chakra-ui/spinner"
import React, { useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useHistory } from 'react-router-dom';
import ChatLoading from '../ChatLoading';
import UserListItem from '../UserAvatar/UserListItem';
import { APIClient } from '../../service/ApiClient';
import { getSender, getSenderName } from '../../config/ChatLogics';
import NotificationBadge, { Effect } from "react-notification-badge";

const SideDrawer = () => {
  const [search, setSearh]= useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const history = useHistory();

  const {isOpen, onOpen, onClose} = useDisclosure();

  const {user, setSelectedChat, chats, setChats, notification, setNotification} = ChatState()
  const toast = useToast();

  useEffect(()=>{
    if(search===""){
      setSearchResult([]);
    }
  },[search])

  const handleSearch = async()=>{
    
    if(!search){
      toast({
        title: "Please enter something in search",
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
            Authorization: `Bearer ${user.token}`,
          }
        }

        const {data} = await APIClient.get(`/api/user?search=${search} `,config)
       console.log(data);
        setLoading(false);
        setSearchResult(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
    });
    }
  }

  const accessChat = async(userId)=>{
    try {
        setLoadingChat(true);
        const config = {
          headers: {
            "Content-type":"application/json",
            Authorization: `Bearer ${user.token}`,
          }
        }

        const {data} = await APIClient.post('/api/chat',{userId}, config)  
        if (!chats.find((c)=>c._id === data._id ))
          setChats([data, ...chats])
        
        setSelectedChat(data);
        setLoadingChat(false);
        onClose();
      } catch (error) {
        toast({
          title: "Error Fetching the chat",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
      });
    }
  }

  const logoutHandler = ()=>{
    localStorage.removeItem("userInfo");
    history.push("/");
  }

  return (
    <>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg={"white"}
        w="100%"
        p="5px 10px"
        borderWidth={"5px"}
      >
        <Tooltip label="Search users to chat" hasArrow placement='bottom-end' >
          <Button variant={"ghost"} onClick={onOpen}>
            <SearchIcon/>
            <Text display={{base:"none", md:"flex"}} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text fontSize={"2xl"} fontFamily={"Work sans"} >
          Let-Us-Chat
        </Text>

        <div>
          <Menu>
            <MenuButton p={1}>
                <NotificationBadge  
                  count={notification.length}
                  effect={Effect.SCALE}
                />
                <BellIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif)=>(
                <MenuItem key={notif._id} onClick={()=>{
                  setSelectedChat(notif.chat)
                  setNotification(notification.filter(n=>n !== notif))
                }}>
                  {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSenderName(user, notif.chat.users)}` }
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

          <Menu>
          <Tooltip label={user.name} hasArrow placement='bottom-end' >
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>} >
              <Avatar size="sm" cursor={"pointer"} name={user.name} src={user.pic} />
            </MenuButton>
          </Tooltip>

            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement='left' onClose={onClose} isOpen={isOpen} >
            <DrawerOverlay/>
            <DrawerContent>
              <DrawerHeader borderBottomWidth={"1px"} >Search Users</DrawerHeader>
              <DrawerBody>
              <Box display={"flex"} pb={2} >
                <Input 
                  placeholder='Search by name or email'
                  mr={2}
                  value={search}
                  onChange={(e)=> setSearh(e.target.value)}
                />
                <Button onClick={handleSearch} >Go</Button>
              </Box>

              {loading ? (
                <ChatLoading numberOfSkeletons={12}/>  
              ):(
              searchResult && 
                searchResult.map((user)=>{
                  return  <UserListItem 
                  key={user._id}
                  user={user}
                  handleFunction={()=>accessChat(user._id)}
                />

                })
              )}
              {loadingChat && <Spinner ml="auto" display="flex"/> }
            </DrawerBody>
            </DrawerContent>
      </Drawer>
    </>
  )
}

export default SideDrawer