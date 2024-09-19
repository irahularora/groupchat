export const API_BASE_URL = "http://localhost:5000";

export var headersList = {
  Accept: "*/*",
  "Content-Type": "application/json",
};

export interface LoginData {
  username: string;
  password: string;
}

export interface ApiGroup {
  _id: string; 
  name: string;
  description: string;
  members: string[];
  admin: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}