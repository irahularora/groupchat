import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  createGroup,
  updateGroup,
  getGroupById,
  getUsers,
  deleteGroup,
} from "../api/api";
import { AlertType, UserInfo } from "./types";

interface Props {
  userInfo: UserInfo;
  showAlert: (message: AlertType) => void;
}

const EditGroup: React.FC<Props> = ({ showAlert, userInfo }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const groupId = searchParams.get("id");
  const isEdit = groupId !== null;
  const [groupAdmin, setGroupAdmin] = useState<any>({});
  const [groupName, setGroupName] = useState<string>("");
  const [groupDescription, setGroupDescription] = useState<string>("");
  const [members, setMembers] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<{ _id: string; username: string }[]>(
    []
  );
  const [newMember, setNewMember] = useState<string>("");
  const [memberSuggestions, setMemberSuggestions] = useState<
    { _id: string; username: string }[]
  >([]);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isGroupNameValid, setIsGroupNameValid] = useState<boolean>(true);
  const [isGroupDescriptionValid, setIsGroupDescriptionValid] =
    useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersList = await getUsers();
        setAllUsers(usersList.data);

        if (isEdit && groupId) {
          const groupDetails = await getGroupById(groupId!);
          const adminDetails = usersList.data.find(
            (user: any) => user._id === groupDetails.data.admin
          );
          setGroupAdmin(adminDetails);
          setGroupName(groupDetails.data.name);
          setGroupDescription(groupDetails.data.description);
          setMembers(groupDetails.data.members);
        }
      } catch (error) {
        setErrorMessage("Error fetching data.");
      }
    };

    fetchData();
  }, [isEdit, groupId]);

  const validateGroupName = () => {
    setIsGroupNameValid(groupName.length >= 3 && groupName.length <= 50);
  };

  const validateGroupDescription = () => {
    setIsGroupDescriptionValid(groupDescription.length <= 500);
  };

  const searchMembers = () => {
    if (newMember.length > 0) {
      const suggestion = allUsers.filter(
        (user) =>
          user._id !== groupAdmin?._id &&
          user.username.toLowerCase().includes(newMember.toLowerCase())
      );
      setMemberSuggestions(suggestion);
    } else {
      setMemberSuggestions([]);
    }
  };

  const selectMember = (user: { _id: string; username: string }) => {
    setNewMember(user.username);
    setMemberSuggestions([]);
  };

  const addMember = () => {
    const selectedUser = allUsers.find((user) => user.username === newMember);
    if (selectedUser && !members.includes(selectedUser._id)) {
      setMembers([...members, selectedUser._id]);
      setNewMember("");
      setMemberSuggestions([]);
    } else if (selectedUser && members.includes(selectedUser._id)) {
      setErrorMessage("Member already exists in the group.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
  };

  const isFormValid = (): boolean => {
    return isGroupNameValid && isGroupDescriptionValid && groupName.length > 0;
  };

  const deleteGroupHandler = async () => {
    if (groupId) {
      try {
        await deleteGroup(groupId);
        showAlert({ msg: "Group Deleted Successfully", type: "success" });
        navigate("/");
      } catch (error) {
        setErrorMessage("Error deleting group.");
      }
    }
  };

  const saveGroup = async () => {
    if (isFormValid()) {
      setIsSaving(true);
      try {
        if (isEdit) {
          const response = await updateGroup(groupId!, {
            name: groupName,
            description: groupDescription,
            members,
          });
          if (response.isOk) {
            showAlert({ msg: "Group Updated Successfully", type: "success" });
          } else {
            setErrorMessage("Error updating group.");
          }
        } else {
          const response = await createGroup({
            name: groupName,
            description: groupDescription,
            members,
          });
          if (response.isOk) {
            showAlert({ msg: "Group Created Successfully", type: "success" });
            navigate("/");
          } else {
            setErrorMessage("Error creating group.");
          }
        }
      } catch (error) {
        setErrorMessage("Error saving group.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const isGroupAdmin = !isEdit || userInfo.id === groupAdmin?._id;

  return (
    <div className="group-management">
      <button onClick={() => navigate(-1)} className="back-button">
        <i className="fa-solid fa-arrow-left"></i> Back
      </button>
      {isGroupAdmin && (
        <>
          <h2 style={{ textAlign: "left" }}>
            {isEdit ? "Edit Group" : "Create Group"}
          </h2>

          <div className="form-group">
            <label htmlFor="groupName">Group Name</label>
            <input
              type="text"
              id="groupName"
              value={groupName}
              onChange={(e) => {
                setGroupName(e.target.value);
                validateGroupName();
              }}
              className={!isGroupNameValid ? "invalid" : ""}
              aria-describedby="groupNameError"
            />
            <small
              id="groupNameError"
              className="error-message"
              style={{ display: isGroupNameValid ? "none" : "block" }}
            >
              Group name must be between 3 and 50 characters.
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="groupDescription">Group Description</label>
            <textarea
              id="groupDescription"
              value={groupDescription}
              onChange={(e) => {
                setGroupDescription(e.target.value);
                validateGroupDescription();
              }}
              className={!isGroupDescriptionValid ? "invalid" : ""}
              aria-describedby="groupDescriptionError"
            ></textarea>
            <small className="character-count">
              {500 - groupDescription.length} characters remaining
            </small>
            <small
              id="groupDescriptionError"
              className="error-message"
              style={{ display: isGroupDescriptionValid ? "none" : "block" }}
            >
              Description must not exceed 500 characters.
            </small>
          </div>
        </>
      )}

      <div className="form-group">
        <label>Members</label>
        <ul className="member-list">
          <li key={groupAdmin.username} className="member-item">
            <span>{groupAdmin.username} (Admin)</span>
          </li>
          {members.map((memberId, i) => {
            const user = allUsers.find((user) => user._id === memberId);
            return (
              user && (
                <li key={i} className="member-item">
                  <span>{user.username}</span>
                  {isGroupAdmin && (
                    <button
                      onClick={() => removeMember(i)}
                      aria-label={"Remove member"}
                    >
                      &times;
                    </button>
                  )}
                </li>
              )
            );
          })}
        </ul>
        {isGroupAdmin && (
          <>
            <div className="add-member">
              <input
                type="text"
                value={newMember}
                onChange={(e) => {
                  setNewMember(e.target.value);
                  searchMembers();
                }}
                placeholder="Add new member"
                aria-describedby="memberSuggestions"
              />
              <button
                onClick={addMember}
                disabled={!newMember}
                aria-label="Add member"
              >
                Add
              </button>
            </div>
            {memberSuggestions.length > 0 && (
              <ul id="memberSuggestions" className="member-suggestions">
                {memberSuggestions.map((suggestion) => (
                  <li
                    key={suggestion._id}
                    onClick={() => selectMember(suggestion)}
                  >
                    {suggestion.username}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

      {errorMessage && (
        <div className="error-alert" role="alert">
          {errorMessage}
        </div>
      )}

      {isGroupAdmin && (
        <>
          <button
            onClick={saveGroup}
            className="save-button"
            disabled={!isFormValid()}
          >
            {isSaving ? <span className="loader"></span> : "Save Group"}
          </button>
          <button
            className="save-button"
            onClick={deleteGroupHandler}
            style={{ backgroundColor: "red", marginTop: "1rem" }}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default EditGroup;
