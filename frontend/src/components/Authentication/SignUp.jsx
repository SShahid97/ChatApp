import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {ViewIcon,ViewOffIcon} from '@chakra-ui/icons';
import { APIClient } from '../../service/ApiClient';


const SignUp = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [confirmpassword, setconfirmpassword] = useState();
    const [pic, setPic] = useState();
    const [image, setImage]=useState();
    const [showPassword, setShowPassword] = useState(false);
    const [showconfirmpassword, setShowconfirmpassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePasswordShow = ()=> setShowPassword(!showPassword)
    const handleconfirmpasswordShow = ()=> setShowconfirmpassword(!showconfirmpassword)
    const toast = useToast();
    const history = useHistory();


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
              setLoading(false);
            //   toast({
            //     title: "Image uploaded successfully!",
            //     status: "success",
            //     duration: 5000,
            //     isClosable: true,
            //     position: "bottom",
            //   });
            // return true; 
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
            return true; 
        }
        pics =undefined;
    }

    const submitHandler = async()=>{
        setLoading(true);
        if(!name || !email || !password || !confirmpassword){
            toast({
                title: "Please fill all the fields",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        if(password !== confirmpassword){
            toast({
                title: "Password do not match",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            setLoading(false);
            return;
        }

        const responseAfterImageUpload = postDetails(image);
        if(responseAfterImageUpload){
            try{
                const config = {
                    headers: {
                        "Content-type":"application/json",
                    }
                }
                const {data} = await APIClient.post("/api/user",{name, email,password, pic},config);
                toast({
                    title: "Successfully Registered",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
    
                localStorage.setItem("userInfo",JSON.stringify(data));
                setLoading(false);
                history.push("/chats")
            }catch(error){
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
        }
       
    }

  return (
    <VStack spacing={'5px'}>
        <FormControl id='first-name' isRequired>
            <FormLabel>Name</FormLabel>
                <Input 
                    placeholder="Enter your name"
                    onChange={(e)=>setName(e.target.value)}
                />
        </FormControl>

        <FormControl id='email' isRequired>
            <FormLabel>Email</FormLabel>
                <Input 
                    placeholder="Enter your email"
                    onChange={(e)=>setEmail(e.target.value)}
                />
        </FormControl>

        <FormControl id='password' isRequired>
            <FormLabel>Password</FormLabel>
                <InputGroup>
                <Input 
                    type={showPassword?"text":"password"}
                    placeholder="Enter your password"
                    onChange={(e)=>setPassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handlePasswordShow}>
                        { showPassword? <ViewIcon w={6} h={6}/>  :<ViewOffIcon w={6} h={6} />}
                    </Button>
                </InputRightElement>
                </InputGroup>
        </FormControl>
        
        <FormControl id='confirmpassword' isRequired>
            <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                <Input 
                    type={showconfirmpassword?"text":"password"}
                    placeholder="Confirm password"
                    onChange={(e)=>setconfirmpassword(e.target.value)}
                />
                <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleconfirmpasswordShow}>
                        { showconfirmpassword? <ViewIcon  w={6} h={6}/>  :<ViewOffIcon w={6} h={6} />}
                    </Button>
                </InputRightElement>
                </InputGroup>
        </FormControl>

        <FormControl id='pic' isRequired>
            <FormLabel>Upload your picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept='image/*' 
                    // onChange={(e)=>postDetails(e.target.files[0])}
                    onChange={(e)=>setImage(e.target.files[0])}
                />
        </FormControl>

        <Button
            colorScheme='blue'
            width="100%"
            style={{marginTop:15}}
            onClick={submitHandler}
            isLoading={loading}
        >
            Sign Up
        </Button>

    </VStack>
  )
}

export default SignUp