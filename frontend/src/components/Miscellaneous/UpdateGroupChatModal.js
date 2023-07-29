import { useDisclosure } from '@chakra-ui/hooks'
import { ViewIcon } from '@chakra-ui/icons';
import React, { useState } from 'react'
import {
    Box,
    Button,
    FormControl,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    useToast,
    IconButton
  } from "@chakra-ui/react";
import { ChatState } from '../../Context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import { APIClient } from '../../service/ApiClient';
import UserListItem from '../UserAvatar/UserListItem';

const UpdateGroupChatModal = ({fetchAgain, setFetchAgain,fetchMessages}) => {
    const [groupChatName, setGroupChatName] = useState();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();
    const {isOpen, onOpen, onClose}= useDisclosure();
    const {selectedChat, setSelectedChat, user} = ChatState();
    
    const handleRename = async()=>{
        if(!groupChatName) return;
 
        try {
            setRenameLoading(true);
            const config = {
              headers: {
                Authorization: `Bearer ${user.token}`,
              }
            };

            const { data } = await APIClient.put(`/api/chat/rename`,{
              chatId: selectedChat._id,
              chatName: groupChatName
            } ,config);
            console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
        } catch (error) {
            toast({
                title: "Failed to update the group name",
                description: error.response.data,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
            setRenameLoading(false);
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query);
        if (query == "") {
          setSearchResult([]);
          return;
        }
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
    
          const { data } = await APIClient.get(`/api/user?search=${query}`, config);
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
      };

    const handleRemove = async(userToRemove)=>{
        if( selectedChat.groupAdmin._id !==user._id){
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
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }
              };
              const { data } = await APIClient.put(`/api/chat/groupremove`,{
               chatId: selectedChat._id,
               userId: userToRemove._id
              } ,config);
              console.log(data);

              userToRemove._id === user._id ? setSelectedChat():setSelectedChat(data)
              setFetchAgain(!fetchAgain);
              fetchMessages();
              setLoading(false)
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false)
        }
    }

    const handleAdduser = async(userToAdd)=>{
        if( selectedChat.users.find((u)=>u._id === userToAdd._id)){
            toast({
                title: "User already in group",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }
        if( selectedChat.groupAdmin._id !==user._id){
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                  Authorization: `Bearer ${user.token}`,
                }
              };
              const { data } = await APIClient.put(`/api/chat/groupadd`,{
               chatId: selectedChat._id,
               userId: userToAdd._id
              } ,config);
              console.log(data);
              setSelectedChat(data);
              setFetchAgain(!fetchAgain)
              setLoading(false)
        } catch (error) {
            console.log(error);
            toast({
                title: "Error Occured",
                description: error.response.data.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
              });
              setLoading(false)
        }
    }
    return (
        <>
        <IconButton 
            display={{base:"flex"}}
            icon={<ViewIcon/>}
            onClick={onOpen}
        />
        <Modal 
        isCentered 
        isOpen={isOpen} 
        onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <Box
                w="100%"
                display="flex"
                flexWrap={"wrap"}
                pb={3}
            >
                {
                    selectedChat.users.map((user)=>{
                        return <UserBadgeItem
                        key={user._id}
                        user={user}
                        handleFunction={() => handleRemove(user)}
                      />;
                    })
                }
            </Box>    
            
            <FormControl display={"flex"}>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            
                <Button 
                    variant={"solid"}
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
                placeholder="Add users eg: John, Jane, Janu"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
              <Spinner size="lg" />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAdduser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="red" onClick={()=> handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
        </>
    )
}

export default UpdateGroupChatModal