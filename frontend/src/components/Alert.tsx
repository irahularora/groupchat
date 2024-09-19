import React from "react";
import { AlertType } from "./types";

interface Props {
  message: AlertType | null;
}
export const Alert = (props: Props) => {
  return (
    <div style={{ height: "60px" }}>
      {props.message && (
        <div
          className={`alert alert-${props.message.type} alert-dismissible fade show`}
          role="alert"
        >
          <strong>{props.message.type}:</strong> {props.message.msg}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
          />
        </div>
      )}
    </div>
  );
};
