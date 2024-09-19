import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { API_BASE_URL, headersList, LoginData } from "./types";
import { Group, User } from "../components/types";

const request = async (
  url: string,
  method: string,
  data?: any
): Promise<{ isOk: boolean; data?: any }> => {
  const token = localStorage.getItem("token");
  const reqOptions: AxiosRequestConfig = {
    url: `${API_BASE_URL}${url}`,
    method,
    headers: {
      ...headersList,
      Authorization: token ? `Bearer ${token}` : undefined,
    },
    data,
  };

  try {
    const response: AxiosResponse<any> = await axios.request(reqOptions);
    const successStatusCodes = [200, 201, 202, 204];
    const isOk = successStatusCodes.includes(response.status);
    return { isOk: isOk, data: response.data };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    console.error("API request error:", error);
    return { isOk: false };
  }
};

export const login = async (data: LoginData) => {
  const { username, password } = data;
  const bodyContent = JSON.stringify({ username, password });

  const result = await request("/api/auth/login", "POST", bodyContent);
  if (result.isOk && result.data) {
    return { isOk: true, data: result.data };
  }
  return { isOk: false, data: {} };
};

export const createUser = async (user: User) => {
  return request("/api/admin/users", "POST", user);
};

export const editUser = async (id: string, userUpdateData: User) => {
  return request(`/api/admin/users/${id}`, "PUT", userUpdateData);
};

export const deleteUser = async (id: string) => {
  return request(`/api/admin/users/${id}`, "DELETE");
};

export const getUsers = async () => {
  return request("/api/groups/users/all", "GET");
};

export const createGroup = async (data: Group) => {
  return request("/api/groups", "POST", data);
};

export const updateGroup = async (id: string, data: Group) => {
  return request(`/api/groups/${id}`, "PUT", data);
};

export const deleteGroup = async (id: string) => {
  return request(`/api/groups/${id}`, "DELETE");
};

export const getUserGroups = async () => {
  return request("/api/groups", "GET");
};

export const getGroupById = async (id: string) => {
  return request(`/api/groups/${id}`, "GET");
};

export const getMessagesByGroupId = async (groupId: string) => {
  return request(`/api/messages/${groupId}`, "GET");
};

export const sendMessage = async (groupId: string, text: string) => {
  const bodyContent = { groupId, text };
  return request("/api/messages", "POST", bodyContent);
};

export const likeMessage = async (messageId: string) => {
  const bodyContent = { messageId };
  return request("/api/messages/like", "POST", bodyContent);
};