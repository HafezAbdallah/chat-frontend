import { AxiosResponse } from "axios";
import axios from "./axiosConfiguration";
import hash from "string-hash";
import { ChatMessages, User } from "interfaces/Interfaces";

export const login = (username: string, password: string) => {
  const hashedPassword = hash(password);
  return axios.post("UserManagement/Login", {
    username,
    password: String(hashedPassword)
  });
};

export const register = (username: string, password: string) => {
  const hashedPassword = hash(password);
  return axios.post("UserManagement/register", {
    username,
    password: String(hashedPassword)
  });
};

export const getUsersStatus = (): Promise<AxiosResponse<User[]>> => {
  return axios.get("UserManagement/GetUsersStatus");
};
export const getUserMessages = (): Promise<
  AxiosResponse<Map<string, ChatMessages[]>>
> => {
  return axios.get("UserManagement/GetUserMessages");
};
