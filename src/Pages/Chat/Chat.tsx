import React, { useState, useEffect } from "react";
import * as signalR from "@microsoft/signalr";
import "./Chat.css";
import ChatUser from "./ChatUser/ChatUser";
import {
  Button,
  Divider,
  IconButton,
  InputAdornment,
  TextField
} from "@mui/material";
import { getUserMessages, getUsersStatus } from "apis/userManagementApis";
import { deleteAllCookies, getCookie } from "utils/cookiesHelper";
import ChatArea from "./ChatArea/ChatArea";
import SendIcon from "@mui/icons-material/Send";
import { MessageType, UserStatus } from "enums/Enums";
import { ChatMessages, User } from "interfaces/Interfaces";

const Chat = (props: { onLogOut: () => void }) => {
  const [connection, setConnection] = useState<signalR.HubConnection>(null);
  const [selectedUser, setSelectedUser] = useState<User>();
  const [users, setUsers] = useState<User[]>([]);
  const loggedInUser = getCookie("username"); // TODO : memo
  const [messages, setMessages] = useState<Map<string, ChatMessages[]>>(
    new Map<string, ChatMessages[]>()
  );

  const [inputValue, setInputValue] = useState<string>("");
  useEffect(() => {
    getUsersStatus().then((res) => {
      // this api can be removed to reduce api calls and instead we can get all users from the next api
      const allUsers = res.data.filter((x) => x.username != loggedInUser);
      setUsers(allUsers);
    });
    getUserMessages().then((res) => {
      const messagesMap = new Map<string, ChatMessages[]>();
      for (const key in res.data) {
        messagesMap.set(key, res.data[key]);
      }
      setMessages(messagesMap);
    });

    const newConnection = new signalR.HubConnectionBuilder()
      // url should be dynamic according to the env
      .withUrl("http://localhost:5151/chatHub", {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets,
        accessTokenFactory: () => "Token"
      })
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => {
        console.log("SignalR Connected");
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    newConnection.on("UserConnected", (username: string) => {
      setUsers((prev) => {
        const allUsers = [...prev];
        const connectedUser = allUsers.find((x) => x.username == username);
        if (connectedUser) connectedUser.status = UserStatus.Online;
        allUsers.sort((a, b) => {
          if (
            a.status === UserStatus.Online &&
            b.status !== UserStatus.Online
          ) {
            return -1; // a should come before b
          } else if (
            a.status !== UserStatus.Online &&
            b.status === UserStatus.Online
          ) {
            return 1; // a should come after b
          } else {
            return 0; // a and b are equal in terms of order
          }
        });
        return allUsers;
      });
    });
    newConnection.on("UserDisconnected", (username: string) => {
      setUsers((prev) => {
        const allUsers = [...prev];
        const disconnectedUser = allUsers.find((x) => x.username == username);
        if (disconnectedUser) disconnectedUser.status = UserStatus.Offline;
        allUsers.sort((a, b) => {
          if (
            a.status === UserStatus.Online &&
            b.status !== UserStatus.Online
          ) {
            return -1; // a should come before b
          } else if (
            a.status !== UserStatus.Online &&
            b.status === UserStatus.Online
          ) {
            return 1; // a should come after b
          } else {
            return 0; // a and b are equal in terms of order
          }
        });
        return allUsers;
      });
    });

    newConnection.onclose((e) => {
      console.log("Signal R Just Closed with error: ", e);
    });
    return () => {
      console.log("Stopping Connection");
      newConnection.stop();
    };
  }, []);

  useEffect(() => {
    // this was done in use effect so we can use the user latest state without closure
    // just as a poc of the ways we can use
    connection?.on("ReceiveMessage", (user: string, message: string) => {
      setSelectedUser(users.find((x) => x.username == user));
      setMessages((prev) => {
        const temp = new Map(prev);
        if (temp.has(user))
          temp.get(user).push({ type: MessageType.Received, message: message });

        return temp;
      });
    });
    return () => connection?.off("ReceiveMessage");
  }, [connection, users]);

  const handleSendMessage = async (message: string) => {
    if (connection) {
      try {
        await connection.send("SendMessage", selectedUser.username, message);
        const temp = new Map(messages);
        temp
          .get(selectedUser.username)
          .push({ message, type: MessageType.Sent });

        setMessages(temp);
        setInputValue("");
      } catch (error) {
        console.error("SignalR Send Error: ", error);
      }
    }
  };

  const handleLogOut = () => {
    deleteAllCookies();
    props.onLogOut();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSendMessage(inputValue);
    }
  };
  return (
    <div style={{ height: "100%", overflow: "hidden" }}>
      <div className="appHeader">
        <span> {loggedInUser}</span>
        <Button
          variant="contained"
          style={{ margin: 10 }}
          onClick={handleLogOut}>
          Log Out
        </Button>
      </div>

      <div className="chatLayout">
        <div className="usersList">
          {/* <Typography> User Lists</Typography> */}
          {users.map((user: User, index) => {
            return (
              <div key={index} onClick={() => setSelectedUser(user)}>
                <ChatUser
                  isOnline={user.status == UserStatus.Online}
                  name={user.username}
                />{" "}
              </div>
            );
          })}
        </div>

        <div className="chatArea">
          {selectedUser && (
            <>
              <div style={{ height: "10%" }}>
                <div className="chatHeader">
                  {" "}
                  <ChatUser
                    isOnline={selectedUser.status == UserStatus.Online}
                    name={selectedUser.username}
                  />
                </div>
                <Divider></Divider>
              </div>
              <div style={{ height: "80%" }}>
                <ChatArea
                  messages={messages.get(selectedUser.username) || []}
                />
              </div>
              <div className="chatInput">
                <TextField
                  autoFocus
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  value={inputValue}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() => handleSendMessage(inputValue)}>
                          <SendIcon color="info" />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
