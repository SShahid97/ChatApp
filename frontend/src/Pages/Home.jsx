import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Login from "../components/Authentication/Login";
import SignUp from "../components/Authentication/SignUp";
import { useHistory } from "react-router-dom";

const Home = () => {
  const history = useHistory();

  useEffect(()=>{
      const user = JSON.parse(localStorage.getItem("userInfo"));
      console.log("user: ", user)
      if(user){
          history.push("/chats") ; 
      }
  },[history])

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize={"4xl"} fontFamily={"Work sans"} color={"black"} textAlign={"center"} >
          Let-Us-Chat
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius={"lg"} borderWidth={"1px"} color={"black"}>
        <Tabs variant="soft-rounded" >
          <TabList mb={"1em"}>
            <Tab width="50%">Login</Tab>
            <Tab width="50%">Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login/>
            </TabPanel>
            <TabPanel>
              <SignUp/>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Home;
