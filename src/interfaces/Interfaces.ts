import { UserStatus } from "enums/Enums";

export interface User {
  userName: string;
  status: UserStatus;
}

export interface ChatMessages {
  type: number;
  message: string;
}
