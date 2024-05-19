import { UserStatus } from "enums/Enums";

export interface User {
  username: string;
  status: UserStatus;
}

export interface ChatMessages {
  type: number;
  message: string;
}
