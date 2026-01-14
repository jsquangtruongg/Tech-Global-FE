import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  Input,
  Button,
  Avatar,
  message,
  Spin,
  Upload,
} from "antd";
import {
  UserOutlined,
  UploadOutlined,
  MailOutlined,
  PhoneOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { getUserAPI, updateUserAPI, type IUser } from "../../../api/user";
import "./style.scss";

const ProfileAdminComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserAPI();
      if (res.err === 0) {
        setUser(res.userData);
        form.setFieldsValue({
          firstName: (res.userData as any)?.firstName,
          lastName: (res.userData as any)?.lastName,
          email: res.userData.email,
          phone: res.userData.phone,
          avatar: res.userData.avatar,
        });
      } else {
        message.error(res.mes || "Không thể tải thông tin người dùng");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      message.error("Lỗi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const onFinish = async (values: any) => {
    try {
      setUpdating(true);
      const res = await updateUserAPI(values);
      if (res.err === 0) {
        message.success("Cập nhật thông tin thành công");
        // Update local state if needed or re-fetch
        fetchUserProfile();

        // Update localStorage profile if strictly needed,
        // but typically we rely on API state.
        // However, some layouts read from localStorage.
        const storedProfile = localStorage.getItem("profile");
        if (storedProfile) {
          const parsed = JSON.parse(storedProfile);
          // Merge new data but keep token
          const newProfile = {
            ...parsed,
            userData: {
              ...parsed.userData,
              ...values,
            },
            // fallback if userData is top level in some stored versions
            ...values,
          };
          localStorage.setItem("profile", JSON.stringify(newProfile));
        }
      } else {
        message.error(res.mes || "Cập nhật thất bại");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error("Đã có lỗi xảy ra khi cập nhật");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="profile-admin-container">
      <Card title="Thông tin cá nhân" className="profile-card">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={8} className="avatar-section">
            <Avatar
              size={120}
              icon={<UserOutlined />}
              src={user?.avatar}
              className="mb-4"
            />
            <h3 style={{ marginTop: 16, marginBottom: 4 }}>
              {[(user as any)?.lastName, (user as any)?.firstName]
                .filter(Boolean)
                .join(" ")}
            </h3>
            <span className="user-role-tag">{user?.role || "Admin"}</span>

            <div style={{ marginTop: 20, width: "100%", padding: "0 20px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                  color: "#666",
                }}
              >
                <MailOutlined style={{ marginRight: 10 }} /> {user?.email}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 10,
                  color: "#666",
                }}
              >
                <SafetyCertificateOutlined style={{ marginRight: 10 }} />{" "}
                {user?.role || "Admin Access"}
              </div>
            </div>
          </Col>

          <Col xs={24} md={16} className="form-section">
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                firstName: (user as any)?.firstName,
                lastName: (user as any)?.lastName,
                email: user?.email,
                phone: user?.phone,
                avatar: user?.avatar,
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="lastName"
                    label="Họ"
                    rules={[{ required: true, message: "Vui lòng nhập họ" }]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined />}
                      placeholder="Nhập họ"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="firstName"
                    label="Tên"
                    rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                  >
                    <Input
                      size="large"
                      prefix={<UserOutlined />}
                      placeholder="Nhập tên"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="email" label="Email">
                    <Input size="large" prefix={<MailOutlined />} disabled />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item
                    name="phone"
                    label="Số điện thoại"
                    rules={[
                      {
                        pattern: /^[0-9]+$/,
                        message: "Số điện thoại không hợp lệ",
                      },
                    ]}
                  >
                    <Input
                      size="large"
                      prefix={<PhoneOutlined />}
                      placeholder="Nhập số điện thoại"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item name="avatar" label="Link Avatar (URL)">
                    <Input
                      size="large"
                      prefix={<UploadOutlined />}
                      placeholder="https://example.com/avatar.png"
                    />
                  </Form.Item>
                </Col>

                <Col span={24}>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={updating}
                      size="large"
                      style={{ width: "150px" }}
                    >
                      Cập nhật
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default ProfileAdminComponent;
