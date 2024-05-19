import React, { useState } from "react";
import "./ChatArea.css";
import { MessageType } from "enums/Enums";
import { ChatMessages } from "interfaces/Interfaces";

const ChatArea = (props: { messages: ChatMessages[] }) => {
  return (
    <div className="chatContainer">
      <div className="chatMessages">
        {props.messages.map((msg, index) => (
          <div
            key={index}
            className={`chatMessage ${
              msg.type === MessageType.Received ? "left" : "right"
            }`}>
            {msg.message}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatArea;
