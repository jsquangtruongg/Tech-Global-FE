import "./style.scss";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

interface InputCommonProps {
  label?: string;
  placeholder?: string;
  value?: string;
  type?: string;
  id?: string;
  name?: string;
  style?: React.CSSProperties;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  required?: boolean;
  isError?: boolean;
  messageError?: string;
}

export const InputCommon = (props: InputCommonProps) => {
  const {
    label,
    placeholder,
    value,
    type = "text",
    id,
    name,
    style,
    onChange,
    onBlur,
    required,
    isError,
    messageError,
  } = props;

  return (
    <div className={`form-field ${isError ? "error" : ""}`} style={style}>
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          id={id}
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          className={isError ? "input-error" : ""}
        />
        {isError && (
          <div className="error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="#ef4444"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
            </svg>
          </div>
        )}
      </div>
      {isError && messageError && (
        <span className="error-message">{messageError}</span>
      )}
    </div>
  );
};

export const InputCommonName = (props: InputCommonProps) => {
  const {
    label,
    placeholder,
    value,
    type = "text",
    id,
    name,
    style,
    onChange,
    onBlur,
    required,
    isError,
    messageError,
  } = props;
  return (
    <div className="form-group half-width">
      <div className="input-group">
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder || " "}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-input ${isError ? "input-error" : ""}`}
          style={style}
        />
        <label htmlFor={id}>{label}</label>
        {isError && (
          <div className="error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="#ef4444"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
            </svg>
          </div>
        )}
      </div>
      {isError && messageError && (
        <span className="error-message">{messageError}</span>
      )}
    </div>
  );
};

export const InputCommonEmail = (props: InputCommonProps) => {
  const {
    label,
    placeholder,
    value,
    id,
    name,
    style,
    onChange,
    onBlur,
    isError,
    messageError,
  } = props;
  return (
    <div className="form-group">
      <div className="input-group">
        <input
          type="email"
          id={id}
          name={name}
          placeholder={placeholder || " "}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-input ${isError ? "input-error" : ""}`}
          style={style}
        />
        <label htmlFor={id}>{label}</label>
        {isError && (
          <div className="error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="#ef4444"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
            </svg>
          </div>
        )}
      </div>
      {isError && messageError && (
        <span className="error-message">{messageError}</span>
      )}
    </div>
  );
};

export const InputCommonPassword = (props: InputCommonProps) => {
  const {
    label,
    placeholder,
    value,
    id,
    name,
    style,
    onChange,
    onBlur,
    isError,
    messageError,
  } = props;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-group">
      <div className="input-group"> 
        <input
          type={showPassword ? "text" : "password"}
          id={id}
          name={name}
          placeholder={placeholder || " "}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={`form-input ${isError ? "input-error" : ""}`}
          style={style}
        />
        <label htmlFor={id}>{label}</label>
        {isError && (
          <div className="error-icon" style={{ right: "40px" }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="#ef4444"
            >
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z" />
            </svg>
          </div>
        )}
        <span
          className="password-toggle"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </span>
      </div>
      {isError && messageError && (
        <span className="error-message">{messageError}</span>
      )}
    </div>
  );
};
