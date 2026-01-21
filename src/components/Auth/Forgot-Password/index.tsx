import "./style.scss";
import { useState } from "react";
import { Form, Input, message } from "antd";

type Step = "request" | "reset";

const ForgotPassword = () => {
  const [step, setStep] = useState<Step>("request");
  const [loading, setLoading] = useState(false);

  const handleRequestFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      message.success("Đã gửi liên kết đặt lại mật khẩu vào email");
      setStep("reset");
    } finally {
      setLoading(false);
    }
  };

  const handleResetFinish = async (values: {
    code: string;
    password: string;
    confirm: string;
  }) => {
    setLoading(true);
    try {
      message.success("Đặt lại mật khẩu thành công");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-wrapper">
      <div className="auth-title">
        <h1>Quên mật khẩu</h1>
        <p>
          {step === "request"
            ? "Nhập email để nhận liên kết đặt lại mật khẩu."
            : "Nhập mã xác thực và mật khẩu mới để hoàn tất."}
        </p>
      </div>
      <div className="auth-form-content">
        {step === "request" ? (
          <Form
            layout="vertical"
            onFinish={handleRequestFinish}
            className="form-main"
            disabled={loading}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Vui lòng nhập email" },
                { type: "email", message: "Email không hợp lệ" },
              ]}
            >
              <Input size="large" placeholder="you@example.com" />
            </Form.Item>
            <div className="form-actions">
              <button className="btn-submit" type="submit">
                Gửi liên kết đặt lại
              </button>
            </div>
          </Form>
        ) : (
          <Form
            layout="vertical"
            onFinish={handleResetFinish}
            className="form-main"
            disabled={loading}
          >
            <Form.Item
              name="code"
              label="Mã xác thực"
              rules={[{ required: true, message: "Vui lòng nhập mã xác thực" }]}
            >
              <Input size="large" placeholder="Nhập mã xác thực" />
            </Form.Item>
            <Form.Item
              name="password"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu tối thiểu 6 ký tự" },
              ]}
            >
              <Input.Password size="large" placeholder="Mật khẩu mới" />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Xác nhận mật khẩu"
              dependencies={["password"]}
              rules={[
                { required: true, message: "Vui lòng nhập lại mật khẩu" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Mật khẩu không khớp"));
                  },
                }),
              ]}
            >
              <Input.Password size="large" placeholder="Nhập lại mật khẩu" />
            </Form.Item>
            <div className="form-actions">
              <button className="btn-submit" type="submit">
                Đặt lại mật khẩu
              </button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
