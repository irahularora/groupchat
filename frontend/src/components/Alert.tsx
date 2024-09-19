import React from "react";
import { AlertType } from "./types";

interface Props {
  message: AlertType | null;
}
export const Alert = (props: Props) => {
  return (
    <div>
      {props.message && (
        <div
          className={`alert alert-${props.message.type} alert-dismissible fade show`}
          role="alert"
        >
          <strong>{props.message.type}:</strong> {props.message.msg}
        </div>
      )}
    </div>
  );
};
