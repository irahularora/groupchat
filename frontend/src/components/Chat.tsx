import React, { useState, useEffect } from "react";
import {
  getUserGroups,
  getMessagesByGroupId,
  sendMessage,
  likeMessage,
} from "../api/api";
import { getProfileName, Message, UserInfo } from "../components/types";
import { ApiGroup } from "../api/types";
import { useNavigate } from "react-router-dom";

interface Props {
  userInfo: UserInfo;
}

const ChatPage: React.FC<Props> = ({ userInfo }) => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<ApiGroup | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  useEffect(() => {
    const fetchGroups = async () => {
      const result = await getUserGroups();
      if (result.isOk && result.data) {
        setGroups(result.data);
      }
    };
    fetchGroups();
  }, []);

  const fetchUpdatedMessages = async (id: string) => {
    const result = await getMessagesByGroupId(id);
    if (result.isOk && result.data) {
      setMessages(result.data.messages);
    }
  };

  const selectGroup = async (group: ApiGroup) => {
    setSelectedGroup(group);
    console.log(group)
    fetchUpdatedMessages(group._id);
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() !== "" && selectedGroup) {
      const result = await sendMessage(selectedGroup._id, newMessage);
      if (result.isOk && result.data) {
        fetchUpdatedMessages(selectedGroup._id);
        setNewMessage("");
      }
    }
  };

  const handleLikeMessage = async (message: Message) => {
    const result = await likeMessage(message._id);
    if (result.isOk && result.data && selectedGroup?._id) {
      fetchUpdatedMessages(selectedGroup._id);
    }
  };

  const handleCreateGroup = () => {
    navigate("/group");
  };

  const handleSettingsClick = () => {
    if (selectedGroup) {
      navigate(`/group/?id=${selectedGroup._id}`);
    }
  };

  return (
    <div className="chat-page">
      <div className="left-panel">
        <nav className="navbar">
          <h2 className="group-h2">Groups</h2>
          <button onClick={handleCreateGroup} className="create-group-btn">
            Create Group
          </button>
        </nav>
        <ul className="chat-list">
          {groups.map((group) => (
            <li
              key={group._id}
              onClick={() => selectGroup(group)}
              className={selectedGroup?._id === group._id ? "active" : ""}
            >
              <div className="contact-info">
                <div className="group-logo">{getProfileName(group.name)}</div>
                <h3>{group.name}</h3>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="right-panel">
        {selectedGroup ? (
          <div className="chat-container">
            <header className="chat-header">
              <div className="contact-info">
                <div className="group-logo">
                  {getProfileName(selectedGroup.name)}
                </div>
                <h3>{selectedGroup.name}</h3>
              </div>
              {userInfo.is_admin && (
                <button className="settings-btn" onClick={handleSettingsClick}>
                  <i className="fas fa-cog"></i>
                </button>
              )}
            </header>
            <div className="message-container">
              {messages.map((message) => (
                <div className="contact-info-message">
                  {message.sender.username !== userInfo.username && (
                    <div className="group-logo-message">
                      {getProfileName(message.sender.username)}
                    </div>
                  )}
                  <div
                    key={message._id}
                    className={`message ${
                      message.sender.username === userInfo.username
                        ? "sent"
                        : "received"
                    }`}
                  >
                    <p>{message.text}</p>
                    <div className="message-info">
                      {message.sender.username !== userInfo.username && (
                        <p>{message.sender.username}</p>
                      )}
                      <div>
                        <button
                          onClick={() => handleLikeMessage(message)}
                          className={`like-btn ${
                            message?.likes?.includes(userInfo.id) ? "liked" : ""
                          }`}
                        >
                          <i className="fas fa-heart"></i>{" "}
                          <span>{message.likes.length}</span>
                        </button>
                        <span className="timestamp">
                          {new Date(message.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="message-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div className="no-chat-selected">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
