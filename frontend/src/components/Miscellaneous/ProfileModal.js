import { ViewIcon } from '@chakra-ui/icons';
import { IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, Tooltip, useToast } from '@chakra-ui/react'
import {useDisclosure} from "@chakra-ui/hooks";
import React, { useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import { APIClient } from '../../service/ApiClient';

const ProfileModal = ({user, children}) => {
  const [loading, setLoading]=useState(false);
  const [pic, setPic] = useState();
  
  const {user:loggedInUser, setUser} = ChatState();

  const {isOpen, onOpen, onClose} = useDisclosure();

  const toast = useToast();

  const sumbitProfilePic = async(pic)=>{
    try{
      const config = {
          headers: {
              "Content-type":"application/json",
              Authorization: `Bearer ${loggedInUser.token}`,
          }
  
      }
      const {data} = await APIClient.patch(`/api/user/${loggedInUser._id}`,{pic},config);
      const updatedUser = {...loggedInUser, pic: data.pic};
      console.log("updated user: ", updatedUser);
      localStorage.setItem("userInfo",JSON.stringify(updatedUser));
      toast({
        title: "Image uploaded successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setUser(updatedUser)
      console.log(data);
     }catch(error){
      toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
      });
    }
  }

  const postDetails = (pics) => {
    setLoading(true);

    if (pics === undefined) {
      toast({
        title: "Please Select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return false;
    }

    if (pics.type !== "image/jpeg" && pics.type !== "image/png") {
      toast({
        title: "Please Select a JPEG or PNG Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return false;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {

      const data = new FormData()
      data.append("file", pics)
      data.append("upload_preset", "chat-app")
      data.append("cloud_name", "doipb3a48")
      APIClient.post("https://api.cloudinary.com/v1_1/doipb3a48/image/upload", data)
        .then((response) => {
          console.log("Cloudinary response:", response);
          setPic(response.data.url.toString());
          sumbitProfilePic(response.data.url.toString());
          setLoading(false);
          toast({
            title: "Image uploaded successfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
        })
        .catch((error) => {
            toast({
                title: "Image could not be uploaded",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            }); 
          console.log("Cloudinary error:", error);
          setLoading(false);
        //   return false; 
        });
    }
}
  return (
    <> 
        {children ? (<span onClick={onOpen}>{children}</span>):(
            <IconButton display={{base: "flex"}} icon={<ViewIcon/>} onClick={onOpen} />
        )}
         <Modal 
          // size="lg"
          isCentered
         isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          h={{md:"410px", sm:"300px"}}
        >
          <ModalHeader
            fontSize={"40px"}
            fontFamily={"Work sans"}
            display={"flex"}
            justifyContent={"center"}
          >{user.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"space-around"}
          >
            {user._id !== loggedInUser._id ? (

              <Image
              borderRadius={"full"}
              boxSize={"150px"}
              border={"1px solid grey"}
              padding={"2px"}
              src={user.pic}
              alt={user.name}
            />
            ):
              <>
              
              { loading ? (
              <Spinner 
                  size="lg"
                  w={20}
                  h={20}
                  alignSelf={"center"}
                  margin={"auto"}
              />):(<>
               <Tooltip label="Click to upload image" hasArrow placement='bottom-end' > 
                <Image
                  _hover={{
                      opacity:"0.8"
                  }}
                  cursor={"pointer"}
                  onClick={() => document.getElementById("getFile").click()}
                  borderRadius={"full"}
                  boxSize={"150px"}
                  border={"1px solid grey"}
                  padding={"2px"}
                  src={user.pic}
                  alt={user.name}
                />
                </Tooltip>
              </>)}
          
            {/* ..........for changing profile picture......... */}
            <div >
              <input
                type="file"
                id="getFile"
                accept="image/*"
                style={{ display: "none" }}
                name="photo"
                onChange={(e)=>postDetails(e.target.files[0])}
              />
             </div> 
              </>
            }
             

            {/* ........................... */}
            <Text
              fontSize={{base:"20px", md:"22px"}}
              fontFamily={"Work sans"}
            >
              Email: {user.email}
            </Text>
          </ModalBody>  

          <ModalFooter>
            {/* <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModal