export interface AlertType {
  msg: string;
  type: string;
}

export interface UserInfo {
  id: string;
  username: string;
  is_admin: boolean;
}

export interface User {
  _id?: string;
  username: string;
  password?: string;
  is_admin: boolean;
}

export interface Group {
  name: string;
  description: string;
  members: string[];
}

export interface Message {
  _id: string;
  groupId: string;
  text: string;
  sender: {
    _id: string;
    username: string;
  };
  likes: string[];
  createdAt: string;
  updatedAt: string;
}

export const getProfileName = (name: string) => {
  const words = name.split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};
