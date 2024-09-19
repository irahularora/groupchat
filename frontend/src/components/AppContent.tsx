import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { AlertType, UserInfo } from "./types";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { jwtDecode } from "jwt-decode";

import { Alert } from "./Alert";
import Login from "./Login";
import AdminPanel from "./AdminPanel";
import EditGroup from "./EditGroup";
import ChatPage from "./Chat";

export const AppContent: React.FC = () => {
  const location = useLocation();
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return !!token;
  };

  const showAlert = (message: AlertType) => {
    setAlert({
      msg: message.msg,
      type: message.type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 1500);
  };

  const hideNavbar = location.pathname === "/login";

  useEffect(() => {
    if (!isLoggedIn() && location.pathname !== "/login") {
      window.location.href = "/login";
    } else {
      const token = localStorage.getItem("token");
      if (token) {
        const userInfo: UserInfo = jwtDecode(token);
        setUserInfo(userInfo);
      }
    }
  }, [location.pathname]);

  return (
    <div className="main-container">
      {!hideNavbar && userInfo && (
        <Navbar showAlert={showAlert} userInfo={userInfo} />
      )}
      {/* <Alert message={alert} /> */}
      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn() ? <Navigate to="/" /> : <Login showAlert={showAlert} />
          }
        />
        <Route
          path="/panel"
          element={
            isLoggedIn() && userInfo?.is_admin ? (
              <AdminPanel adminInfo={userInfo} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/group"
          element={isLoggedIn() ? <EditGroup /> : <Navigate to="/login" />}
        />
        <Route
          path="/"
          element={
            isLoggedIn() ? (
              <ChatPage userInfo={userInfo!} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </div>
  );
};
