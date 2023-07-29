import { Skeleton, Stack } from '@chakra-ui/react'
import React from 'react'

const ChatLoading = ({numberOfSkeletons}) => {
  
  let arr=[]; 
  for(let i=0; i<numberOfSkeletons; i++){
    arr.push(i);
  }
  return (
    <Stack>
    {arr.map((item)=>{
      return (
       <div key = {item}> 
           <Skeleton height="45" />
       </div>
      )
    })}
    </Stack>
  )
}

export default ChatLoading
