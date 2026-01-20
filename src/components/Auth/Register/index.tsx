import "./style.scss";

import {
  InputCommonName,
  InputCommonEmail,
  InputCommonPassword,
} from "../../Common/InputCommon";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useRegister } from "../../../hooks/useAuth";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const RegisterComponent = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const { mutate: register, isPending } = useRegister();

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
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Vui lòng nhập họ";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Vui lòng nhập tên";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
      });
    }
  };
  return (
    <div className="auth-form-wrapper">
      <div className="auth-title">
        <h1>Đăng ký</h1>
        <p>Đăng ký để nhận được các thông tin mới nhất từ chúng tôi</p>
      </div>

      <div className="auth-form-content">
        <form className="form-main" onSubmit={handleSubmit}>
          <div className="form-groups">
            <InputCommonName
              label="Họ"
              id="firstName"
              name="firstName"
              placeholder=" "
              value={formData.firstName}
              onChange={handleChange}
              isError={!!errors.firstName}
              messageError={errors.firstName}
            />
            <InputCommonName
              label="Tên"
              id="lastName"
              name="lastName"
              placeholder=" "
              value={formData.lastName}
              onChange={handleChange}
              isError={!!errors.lastName}
              messageError={errors.lastName}
            />
          </div>

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

          <InputCommonPassword
            label="Xác nhận mật khẩu"
            id="confirmPassword"
            name="confirmPassword"
            placeholder=" "
            value={formData.confirmPassword}
            onChange={handleChange}
            isError={!!errors.confirmPassword}
            messageError={errors.confirmPassword}
          />
          <span className="form-register">
            Đã có tài khoản?{" "}
            <Link to="/login" className="link-login">
              Đăng nhập
            </Link>
          </span>
          <div className="form-actions">
            <button
              type="submit"
              className="btn-submit"
              disabled={isPending}
              style={{ opacity: isPending ? 0.7 : 1 }}
            >
              {isPending ? "Đang đăng ký..." : "Đăng ký"}
            </button>
          </div>
        </form>
        
      </div>
    </div>
  );
};
export default RegisterComponent;
