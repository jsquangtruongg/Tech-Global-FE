import "./style.scss";
import {
  InputCommonEmail,
  InputCommonPassword,
} from "../../Common/InputCommon";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useLogin } from "../../../hooks/useAuth";

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginComponent = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { mutate: login, isPending } = useLogin();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      login(formData);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-title">
        <h1>Đăng nhập</h1>
        <p>Chào mừng bạn quay trở lại!</p>
      </div>

      <div className="auth-form-content">
        <form className="form-main" onSubmit={handleSubmit}>
          <InputCommonEmail
            label="Email"
            id="email"
            name="email"
            placeholder=" "
            value={formData.email}
            onChange={handleChange}
            isError={!!errors.email}
            messageError={errors.email}
          />

          <InputCommonPassword
            label="Mật khẩu"
            id="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            isError={!!errors.password}
            messageError={errors.password}
          />

          <div className="forgot-password">
            <Link to="/forgot-password">Quên mật khẩu?</Link>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isPending}
              style={{ opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Bạn chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginComponent;
