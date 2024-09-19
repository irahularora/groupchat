import React from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { AlertType, getProfileName, UserInfo } from "./types";

interface Props {
  userInfo: UserInfo;
  showAlert: (message: AlertType) => void;
}

const Navbar = ({ showAlert, userInfo }: Props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      <nav
        className="navbar navbar-expand-lg navbar-dark"
        style={{ backgroundColor: "#004085" }}
      >
        <Link className="navbar-brand" to="/">
          GroupChat
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li
              className={`nav-item ${
                location.pathname === "/" ? "active" : ""
              }`}
            >
              <Link to="/">
                <a className="nav-link">
                  Home <span className="sr-only">(current)</span>
                </a>
              </Link>
            </li>
            {userInfo?.is_admin && (
              <li
                className={`nav-item ${
                  location.pathname === "/panel" ? "active" : ""
                }`}
              >
                <Link to="/panel">
                  <a className="nav-link">Panel</a>
                </Link>
              </li>
            )}
          </ul>
          <div className="nav-profile-div">
            <a
              className="nav-link"
              onClick={handleLogout}
              style={{ cursor: "pointer" }}
            >
              Logout
            </a>
            <div className="group-logo">{getProfileName(userInfo.username)}</div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
