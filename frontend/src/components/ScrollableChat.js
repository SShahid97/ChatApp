import React, { useState } from "react";
import ScrollableFeed from "react-scrollable-feed";
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from "../config/ChatLogics";
import { Avatar, Tooltip } from "@chakra-ui/react";
import { ChatState } from "../Context/ChatProvider";
import { getDayName, getMonthName } from "../service/dateTimeConversions";
const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  let prevDate = null;
  let showDay = false;

  console.log("message: ",messages);
  const formatAMPM = (date) => {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }


 
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message, index) => {
          const d = message.createdAt;
          const date = new Date(d);
          const timeToDisplay = formatAMPM(date);
          console.log("messages: ", messages[index>0?index-1:index]);
          if(prevDate !== null) {
            if( date.getDate() !== prevDate.getDate()){
              showDay=true;
            }else{
              showDay=false;
            }
          }
          prevDate = date;
          return (
          <>
           {
            //index is used for displaying date for first message
            //because showDay will not display for first message as in the first iteration prevDate is null
            showDay || index===0 ? (   
              <div style={{display:"flex", justifyContent:"center", fontSize:"11px"}}>
              <div style={{
                borderRadius: "5px",
                padding: "2px 5px",
                backgroundColor:"rgb(218 255 232)",
                margin:"3px 0px",
                color:"grey"
              }}>
                {
                  getDayName(new Date().getDay()) ===  getDayName(date.getDay()) ? 
                  "Today" :
                  getDayName(new Date().getDay() - 1) ===  getDayName(date.getDay()) ? 
                   "Yesterday"
                   :(
                    <>
                       {getDayName(date.getDay())} {getMonthName(date.getMonth(),"full")}, {date.getDate()}/{date.getFullYear()} 
                    </>
                  )
                }
               
              </div>
            </div>
            ):(<></>)
           }
            <div style={{ display: "flex" }} key={message._id}>
              {(isSameSender(messages, message, index, user._id) ||
                isLastMessage(messages, index, user._id)) && (
                <Tooltip
                  label={message.sender.name}
                  placement="bottom-start"
                  hasArrow
                >
                  <Avatar
                    mt="7px"
                    mr={1}
                    size="sm"
                    cursor={"pointer"}
                    name={message.sender.name}
                    src={message.sender.pic}
                  />
                </Tooltip>
              )}
              <div style={{
                display:"flex",
                flexDirection:"column", 
                justifyContent:"space-between",
                fontSize:"14px",
                backgroundColor: `${
                  message.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                borderRadius: "10px",
                padding: "3px 7px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, message, index, user._id),
                marginTop: isSameUser(messages, message, index, user._id) ? 3: 10
                }}>
              <div
              >
                {message.content}
              </div>
              <div style={{
                 placeSelf:"end",
                color:"grey",
                fontSize:"11px"
                }}>
                  {timeToDisplay}
                </div>
              </div>
            </div>
            </>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
