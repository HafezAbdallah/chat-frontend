import { Avatar, Typography } from "@mui/material";
import React from "react";
import "./ChatUser.css";
const ChatUser = (props: { name: string; isOnline?: boolean }) => {
  return (
    <div className="container">
      <div className="avatar-container">
        <Avatar className="avatar"> {props.name.substring(0, 2)}</Avatar>
        <span
          className={`status-dot ${
            props.isOnline ? "online" : "offline"
          }`}></span>
      </div>

      <div className="avatar-container">
        <Typography fontWeight={400}> {props.name} </Typography>
      </div>
    </div>
  );
};

export default ChatUser;
