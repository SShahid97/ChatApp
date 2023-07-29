import React, { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";

import { APIClient } from "../../service/ApiClient";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFormDataSent, setIsFormDataSent] = useState(false);

  const toast = useToast();
  const { user, chats, setChats } = ChatState();

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

  const handleSubmit = async() => {
    if(!groupChatName || !selectedUsers){
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setIsFormDataSent(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        }
      };
      const { data } = await APIClient.post(`/api/chat/group`,{
        name: groupChatName,
        users: selectedUsers.map(u=>u._id)
      } ,config);

      setChats([data, ...chats]);
      onClose();
      setIsFormDataSent(false);
      toast({
        title: "New Group Chat Created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to create the group",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsFormDataSent(false);
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  };


  // useEffect(()=>{
  //   if(selectedUsers.length > 0){
  //     console.log(selectedUsers)
  //   }
  // },[selectedUsers])

  const handleDelete = (userToDelete) => {

    setSelectedUsers(selectedUsers.filter(sel=>sel._id !== userToDelete._id))
  };

  const closeModal = () => {
    onClose();
    setSearchResult([]);
    setSelectedUsers([]);
  };

  return (
    <>
      {/* {children ? (<span onClick={onOpen}>{children}</span>):(
        <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen} />
    )} */}
      <span onClick={onOpen}>{children}</span>
      <Modal isCentered isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Add users eg: John, Jane, Janu"
                mb={1}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {/* selected users */}
           <Box w="100%" display="flex" flexWrap="wrap">
            {selectedUsers?.map((user) => {
               return <UserBadgeItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />;

              })}
           </Box>

            {/* render searched users */}
            {loading ? (
              //    <ChatLoading numberOfSkeletons={4}/>
              <Spinner />
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleGroup(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button isLoading={isFormDataSent} colorScheme="blue" onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
