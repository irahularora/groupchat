import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import { login } from "../api/api";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { AlertType } from "./types";

interface FormValues {
  username: string;
  password: string;
}

interface Props {
  showAlert: (message: AlertType) => void;
}

const Login = (props: Props) => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<FormValues>({ mode: "onChange" });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  let history = useNavigate();

  const onSubmit = async (data: FormValues) => {
    try {
      const response: any = await login(data);
      if (response.isOk) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        history("/");
        props.showAlert({ msg: "LogedIn Successfully", type: "success" });
        return;
      }
      setErrorMessage(response.data.message || "An error occurred");
    } catch (error) {
      setErrorMessage("An error occurred during the login process.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login-container">
        <form onSubmit={handleSubmit(onSubmit)}>
          <h2>Login</h2>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <Controller
              name="username"
              control={control}
              defaultValue=""
              rules={{ required: "Username is required" }}
              render={({ field }) => (
                <input
                  type="text"
                  id="username"
                  placeholder="Enter your username"
                  {...field}
                />
              )}
            />
            {errors.username && (
              <div className="error-message">{errors.username.message}</div>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input">
              <Controller
                name="password"
                control={control}
                defaultValue=""
                rules={{ required: "Password is required" }}
                render={({ field }) => (
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter your password"
                    {...field}
                  />
                )}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="toggle-password"
              >
                <i
                  className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
            {errors.password && (
              <div className="error-message">{errors.password.message}</div>
            )}
          </div>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
          <button type="submit" disabled={!isValid}>
            Login
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
