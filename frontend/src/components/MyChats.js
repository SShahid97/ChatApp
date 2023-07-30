import React, { useEffect, useState } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar, Box, Button, Spinner, Stack, Text, useToast } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderName } from "../config/ChatLogics";
import GroupChatModal from "./Miscellaneous/GroupChatModal";
import { APIClient } from "../service/ApiClient";

const MyChats = ({fetchAgain}) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, setSelectedChat, selectedChat, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await APIClient.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[])

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems={"center"}
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius={"lg"}
      borderWidth={"1px"}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily={"Work sans"}
        display="flex"
        w="100%"
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <GroupChatModal>
          My Chats
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={"flex"}
        flexDir={"column"}
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius={"lg"}
        overflow={"hidden"}
      >
        {chats.length > 0 ? (
          <Stack overflowY={"auto"}>
            {chats.map((chat) => {
              return (
                <Box
                  style={{display:"flex", alignItems:"center"}}
                  onClick={() => setSelectedChat(chat)}
                  cursor={"pointer"}
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={2}
                  py={1}
                  borderRadius={"lg"}
                  key={chat._id}
                >
                  {!chat.isGroupChat ?
                    <Avatar
                    p={1} 
                    mr={2}
                    size="md"
                    cursor={"pointer"}
                    src={getSender(loggedUser, chat.users).pic}
                  />:
                  <>
                    <Avatar
                    p={1}
                    mr={2}
                    size="md"
                  />
                  </>
                  }
                  
                  <Text>
                    {!chat.isGroupChat
                      ? getSenderName(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                </Box>
              );
            })}
          </Stack>
        ) : (
          <ChatLoading  numberOfSkeletons={10}/>
          // <Spinner />
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
