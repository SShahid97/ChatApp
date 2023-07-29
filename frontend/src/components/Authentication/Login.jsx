import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import {useHistory} from 'react-router-dom'
import {ViewIcon,ViewOffIcon} from '@chakra-ui/icons';
import { APIClient } from '../../service/ApiClient';


const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const history = useHistory();
    const handlePasswordShow = ()=> setShowPassword(!showPassword)


    const submitHandler = async()=>{
        setLoading(true);

        if(!email || !password){
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

        try{
            const config = {
                headers: {
                    "Content-type":"application/json",
                }
            }
            const {data} = await APIClient.post("/api/user/login",{ email,password},config);
            toast({
                title: "Successfully logged in",
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

  return (
    <VStack spacing={'5px'}>
    <FormControl id='emailLogin' isRequired>
        <FormLabel>Email</FormLabel>
            <Input 
                value={email}
                placeholder="Enter your email"
                onChange={(e)=>setEmail(e.target.value)}
            />
    </FormControl>

    <FormControl id='passwordLogin' isRequired>
        <FormLabel>Password</FormLabel>
            <InputGroup>
            <Input 
                type={showPassword?"text":"password"}
                value={password}
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

    <Button
        colorScheme='blue'
        width="100%"
        style={{marginTop:15}}
        onClick={submitHandler}
        isLoading={loading}
    >
       Login
    </Button>

    <Button
        variant={"solid"}
        colorScheme='red'
        width="100%"
        onClick={()=>{
            setEmail("guest@example.com");
            setPassword("123456")
        }}
    >
        Get Guest User Credentials
    </Button>
</VStack>
  )
}

export default Login