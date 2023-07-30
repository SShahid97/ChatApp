import React, { useEffect, useState } from 'react'
import { ChatState } from '../Context/ChatProvider'
import { Avatar, Box, Button, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react';
import { ArrowBackIcon, ArrowForwardIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getSender, getSenderName } from '../config/ChatLogics';
import ProfileModal from './Miscellaneous/ProfileModal';
import UpdateGroupChatModal from './Miscellaneous/UpdateGroupChatModal';
import { APIClient } from '../service/ApiClient';
import './styles.css';
import ScrollableChat from './ScrollableChat';
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client"

const ENDPOINT = "http://localhost:5000";
// const ENDPOINT = "https://940b-117-210-156-156.ngrok-free.app";
// const ENDPOINT = process.env.REACT_APP_BACK_END_BASE_URL
var socket, selectedChatCompare;

const SingleChat = ({fetchAgain, setFetchAgain}) => {
   const [messages, setMessages] = useState([]);
   const [loading, setLoading] = useState(false);
   const [newMessage, setNewMessage]= useState();  
   const [socketConnected, setSocketConnected] = useState(false);
   const [typing, setTyping]=useState(false);
   const [isTyping, setIsTyping]= useState(false);
   
   const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
        preserveAspectRatio:"xMidYMid slice"
    }
   }
   
   const {user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();
   const toast = useToast(); 
   useEffect(()=>{
    socket = io(ENDPOINT);
    socket.emit("setup",user);
    socket.on("connected", ()=> setSocketConnected(true) )
    socket.on('typing', ()=>setIsTyping(true));
    socket.on('stop typing', ()=>setIsTyping(false));

    },[])

    const fetchMessages = async ()=>{
        if(!selectedChat) return;

        try {

            setLoading(true);
            const config = {
                headers:{
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data }  = await APIClient.get(`/api/message/${selectedChat._id}`,config
            );
            setMessages( data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured!",
                description: "Failed to load the messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false);
        }   
    }

    useEffect(()=>{
        fetchMessages();
        selectedChatCompare = selectedChat;
    },[selectedChat])

    useEffect(()=>{
        socket.on("message recieved", (newMessageRecieved)=>{
            if(!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id ){
                // give notification
                if(!notification.includes(newMessageRecieved)){
                    setNotification([newMessageRecieved, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            }else{
                setMessages([...messages, newMessageRecieved]);
            }
        })
    })

    

   const sendMessage = async(e)=>{
    // for using enter to send message add this
    // e.key === "Enter" &&
        if( newMessage){
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers:{
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("");
                const { data }  = await APIClient.post("/api/message",{
                    content: newMessage,
                    chatId: selectedChat._id
                },
                config
                );
                socket.emit("new message",data)
                setMessages([...messages, data]);
            } catch (error) {
                console.log(error);
                toast({
                    title: "Error Occured!",
                    description: "Failed to send the message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                  });
            }   
        }

        
   }


   const typingHandler = (e)=>{
    setNewMessage(e.target.value);
    if(!socketConnected) return;
    if(!typing){
        setTyping(true);
        socket.emit('typing', selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(()=>{
        var timeNow = new Date().getTime();
        var timeDiff = timeNow - lastTypingTime;
        if(timeDiff >= timerLength && typing){
            socket.emit('stop typing', selectedChat._id);
            setTyping(false);
        }
    },timerLength)
   }
  return (
    <>
        {selectedChat ? (<>
            <Text
                fontSize={{base:"28px", md:"30px"}}
                // pb={3}
                // px={2}
                w="100%"
                fontFamily={"Work sans"}
                display={"flex"}
                justifyContent={{base:"space-between"}}
                alignItems={"center"}
            >
                <IconButton 
                    display={{base:"flex", md:"none"}}
                    icon={<ArrowBackIcon/>}
                    onClick={()=> setSelectedChat("")}
                />
                {!selectedChat.isGroupChat 
                ? (<>
                     <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                        <Avatar
                            p={1} 
                            mr={2}
                            size="md"
                            cursor={"pointer"}
                            src={getSender(user, selectedChat.users).pic}
                        />
                        {getSenderName(user, selectedChat.users)}
                     </div>
                    <ProfileModal user={getSender(user, selectedChat.users)} />
                </>)
                :(
                    <>
                    {
                        selectedChat.chatName.toUpperCase()
                    }
                    <UpdateGroupChatModal
                        fetchAgain={fetchAgain}
                        setFetchAgain={setFetchAgain}
                        fetchMessages={fetchMessages}
                    />   
                    
                    </>
                )}

            </Text>

            <Box 
                display={"flex"}
                flexDir={"column"}
                justifyContent={"flex-end"}
                p={3}
                bg="#E8E8E8"
                w="100%"
                h="100%"
                borderRadius={"lg"}
                overflowY="hidden"
            >
                {/* Messages will be displayed here */}

                { loading ? (
                    <Spinner 
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf={"center"}
                        margin={"auto"}
                    />
                ) : (
                    <>
                    <div className='messages'> 
                        {/* messages */}
                        <ScrollableChat messages={messages} />
                    </div>
                    {isTyping ? 
                        <div>
                            <Lottie 
                                options={defaultOptions}
                                width={70}
                                style={{margin: 0}}
                            /> 
                        </div> 
                        :<></> }
                    <FormControl  
                    // onKeyDown={sendMessage} 
                    isRequired mt={3} 
                    style={{display:"flex"}} >
                       
                        <Input
                            style={{backgroundColor:"white", width:"100%"}} 

                            variant ="filled"
                            // bg="#E0E0E0"
                            placeholder='Enter a message..'
                            onChange = {typingHandler}
                            value={newMessage}
                        />
                        <IconButton
                        _hover={{
                            background: '#38B2AC', // Change the background color on hover.
                        }} 
                        display={{base:"flex"}}
                        width={{sm:"10%", md: "10%", lg:"5%" }}
                        style={{ position:"absolute", right:"0px", padding:"2px 3px", borderBottomLeftRadius:"0px",borderTopLeftRadius:"0px"}}
                        icon={<ChevronRightIcon/>}
                        onClick={sendMessage}
                        size={15}
                        bgColor={"#38B2AC"}
                        fontSize={35}
                        color={"white"}
                        />
                    </FormControl>
                        
                    

                    </>
                ) }
            </Box>
        </>)
        :(<>
            <Box 
                display={"flex"}
                alignItems={"center"}
                justifyContent={"center"}
                h="100%"
            >
               <Text
                fontSize={"3xl"}
                fontFamily={"Work sans"}
                pb={3}
               >
                 Click on a user to start chatting
                </Text> 
            </Box>
        </>) }
    </>
  )
}

export default SingleChat
