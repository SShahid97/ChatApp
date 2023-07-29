import { CloseIcon } from '@chakra-ui/icons'
import { Box, Tooltip } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../Context/ChatProvider'

const UserBadgeItem = ({user, handleFunction, isAdmin}) => {
  const {user:loggedInUser }=ChatState();
  console.log(user);
  return (
    <Tooltip label={isAdmin ? "Admin":"User"} hasArrow placement='bottom-end' >
       <Box
        px={2}
        py={1}
        borderRadius={"lg"}
        m={1}
        mb={2}
        variant="solid"
        fontSize={12}
        backgroundColor={isAdmin ? "green" : "purple"}
        color="white"
        cursor={"pointer"}
        onClick={handleFunction}
    >
        {loggedInUser._id === user._id ? "You" : user.name}
        {/* {isAdmin && } */}
        <CloseIcon pl={1}/>
    </Box>
    </Tooltip>
   
  )
}

export default UserBadgeItem