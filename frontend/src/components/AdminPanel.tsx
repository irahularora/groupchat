import React, { useState, useEffect, FormEvent } from "react";
import { createUser, editUser, deleteUser, getUsers } from "../api/api"; // Ensure this path is correct
import { AlertType, User, UserInfo } from "../components/types";

interface Props {
  showAlert: (message: AlertType) => void;
  adminInfo: UserInfo;
}

const AdminPanel: React.FC<Props> = ({ showAlert, adminInfo }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User>({
    username: "",
    password: "",
    is_admin: false,
  });
  const [editMode, setEditMode] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const result = await getUsers();
    if (result.isOk) {
      setUsers(result.data || []);
    } else {
      console.error("Error fetching users");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (editMode) {
      await handleUpdateUser();
    } else {
      await handleCreateUser();
    }
  };

  const handleCreateUser = async () => {
    const result = await createUser(user);
    if (result.isOk) {
      showAlert({ msg: "Group Created Successfully", type: "success" });
      fetchUsers();
      resetForm();
    } else {
      console.error("Error creating user");
    }
  };

  const handleUpdateUser = async () => {
    if (user._id) {
      const updateData = { ...user };
      if (!updateData.password) {
        delete updateData.password;
      }
      const result = await editUser(user._id, updateData);
      if (result.isOk) {
        showAlert({ msg: "User Updated Successfully", type: "success" });
        fetchUsers();
        resetForm();
      } else {
        console.error("Error updating user");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await deleteUser(userId);
    if (result.isOk) {
      fetchUsers();
    } else {
      console.error("Error deleting user");
    }
  };

  const handleEditUser = (userToEdit: User) => {
    setUser(userToEdit);
    setEditMode(true);
  };

  const resetForm = () => {
    setUser({ username: "", password: "", is_admin: false });
    setEditMode(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="admin-panel-container">
      <h1>User Management</h1>

      <form className="form-div" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={user.username}
            onChange={(e) => setUser({ ...user, username: e.target.value })}
            required
            minLength={3}
            maxLength={20}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              minLength={8}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="isAdmin">Admin Role</label>
          <label className="switch">
            <input
              type="checkbox"
              id="isAdmin"
              checked={user.is_admin}
              onChange={(e) => setUser({ ...user, is_admin: e.target.checked })}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={!user.username || (!user.password && !editMode)}
          >
            {editMode ? "Update" : "Create"} User
          </button>
          {editMode && (
            <button
              type="button"
              style={{ backgroundColor: "orangered", marginTop: "1rem" }}
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="user-list">
        <h2>User List</h2>
        <table>
          <thead>
            <tr>
              <th>Sno.</th>
              <th>Username</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <>
                {user._id !== adminInfo.id && (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.is_admin ? "Admin" : "User"}</td>
                    <td>
                      <button
                        onClick={() => handleEditUser(user)}
                        className="edit-btn"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user._id || "")}
                        className="delete-btn"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
