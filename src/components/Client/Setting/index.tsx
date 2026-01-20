import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Switch,
  message,
} from "antd";
import {
  BellOutlined,
  DesktopOutlined,
  GlobalOutlined,
  LockOutlined,
  MailOutlined,
  MobileOutlined,
  QrcodeOutlined,
  SkinOutlined,
  UserOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import "./style.scss";
import { getUserAPI, type IUser } from "../../../api/user";

const SettingClientComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
  });
  const [walletAddress, setWalletAddress] = useState<string>("");

  const [notificationForm] = Form.useForm();
  const [preferenceForm] = Form.useForm();
  const [securityForm] = Form.useForm();

  const applyTheme = (darkMode: boolean) => {
    const themeClass = darkMode ? "theme-dark" : "theme-light";
    document.documentElement.classList.remove("theme-dark", "theme-light");
    document.documentElement.classList.add(themeClass);
  };

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const res = await getUserAPI();
      if (res.err === 0) {
        setUser(res.userData);
      } else {
        message.error(res.mes || "Không thể tải thông tin người dùng");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi tải thông tin người dùng");
    }
    setLoadingUser(false);
  };

  useEffect(() => {
    fetchUser();

    const savedNotifications = localStorage.getItem("settings_notifications");
    if (savedNotifications) {
      notificationForm.setFieldsValue(JSON.parse(savedNotifications));
    } else {
      notificationForm.setFieldsValue({
        marketing: true,
        courseUpdate: true,
        reminder: false,
      });
    }

    const savedPreferences = localStorage.getItem("settings_preferences");
    if (savedPreferences) {
      preferenceForm.setFieldsValue(JSON.parse(savedPreferences));
    } else {
      preferenceForm.setFieldsValue({
        darkMode: false,
        language: "vi",
      });
    }

    const savedSecurity = localStorage.getItem("settings_security");
    if (savedSecurity) {
      const parsed = JSON.parse(savedSecurity);
      setSecuritySettings(parsed);
    }

    const savedWallet = localStorage.getItem("settings_wallet");
    if (savedWallet) {
      const parsed = JSON.parse(savedWallet);
      setWalletAddress(parsed.walletAddress || "");
    }
  }, []);

  const onSaveNotifications = (values: any) => {
    localStorage.setItem("settings_notifications", JSON.stringify(values));
    message.success("Đã lưu cài đặt thông báo");
  };

  const onSavePreferences = (values: any) => {
    localStorage.setItem("settings_preferences", JSON.stringify(values));
    applyTheme(values.darkMode);
    message.success("Đã lưu tùy chọn hiển thị");
  };

  const onToggleDarkMode = (checked: boolean) => {
    const current = preferenceForm.getFieldsValue();
    const next = { ...current, darkMode: checked };
    preferenceForm.setFieldsValue(next);
    localStorage.setItem("settings_preferences", JSON.stringify(next));
    applyTheme(checked);
  };

  const onChangePassword = (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("Mật khẩu xác nhận không khớp");
      return;
    }
    message.success(
      "Đổi mật khẩu demo thành công (chưa kết nối API phía server)"
    );
    setPasswordModalOpen(false);
    securityForm.resetFields();
  };

  const toggleTwoFactor = (checked: boolean) => {
    const next = { ...securitySettings, twoFactorEnabled: checked };
    setSecuritySettings(next);
    localStorage.setItem("settings_security", JSON.stringify(next));
    message.success(
      checked
        ? "Đã bật xác thực hai lớp (2FA) ở chế độ demo"
        : "Đã tắt xác thực hai lớp (2FA) ở chế độ demo"
    );
  };

  const handleConnectWallet = () => {
    if (!walletAddress) {
      message.error("Vui lòng nhập địa chỉ ví crypto");
      return;
    }
    localStorage.setItem(
      "settings_wallet",
      JSON.stringify({ walletAddress: walletAddress })
    );
    message.success("Đã lưu địa chỉ ví crypto (demo, chưa kết nối on-chain)");
  };

  const handleDisconnectWallet = () => {
    setWalletAddress("");
    localStorage.removeItem("settings_wallet");
    message.success("Đã ngắt liên kết ví crypto");
  };

  const fullName =
    [(user as any)?.lastName, (user as any)?.firstName]
      .filter(Boolean)
      .join(" ") || (user as any)?.name;

  return (
    <div className="client-setting-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card loading={loadingUser} title="Thông tin tài khoản">
            <div
              style={{
                marginBottom: 12,
                display: "flex",
                alignItems: "center",
              }}
            >
              <UserOutlined />
              <span style={{ marginLeft: 8 }}>
                {fullName || "Người dùng chưa đặt tên"}
              </span>
            </div>
            <div
              style={{ marginBottom: 8, display: "flex", alignItems: "center" }}
            >
              <MailOutlined />
              <span style={{ marginLeft: 8 }}>
                {user?.email || "Chưa có email"}
              </span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ color: "#888" }}>Số điện thoại: </span>
              <span>{user?.phone || "Chưa cập nhật"}</span>
            </div>
            <div style={{ fontSize: 12, color: "#999" }}>
              Các thông tin chi tiết hơn bạn có thể cập nhật ở trang Hồ sơ.
            </div>
          </Card>

          <Card
            title="Bảo mật"
            style={{ marginTop: 16 }}
            extra={<LockOutlined />}
          >
            <p style={{ marginBottom: 12 }}>
              Quản lý mật khẩu và tăng cường bảo mật tài khoản.
            </p>
            <Button
              type="primary"
              icon={<LockOutlined />}
              onClick={() => setPasswordModalOpen(true)}
            >
              Đổi mật khẩu
            </Button>
          </Card>
          <Card
            style={{ marginTop: 16 }}
            title={
              <span>
                <SkinOutlined /> Tùy chọn hiển thị
              </span>
            }
          >
            <Form
              form={preferenceForm}
              layout="vertical"
              onFinish={onSavePreferences}
            >
              <Form.Item
                name="darkMode"
                label={
                  <span>
                    <SkinOutlined /> Giao diện tối
                  </span>
                }
                valuePropName="checked"
              >
                <Switch onChange={onToggleDarkMode} />
              </Form.Item>
              <Form.Item
                name="language"
                label={
                  <span>
                    <GlobalOutlined /> Ngôn ngữ
                  </span>
                }
              >
                <Select
                  options={[
                    { value: "vi", label: "Tiếng Việt" },
                    { value: "en", label: "English" },
                  ]}
                />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu tùy chọn
              </Button>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={16}>
          <Card
            title={
              <span>
                <BellOutlined /> Cài đặt thông báo
              </span>
            }
          >
            <Form
              form={notificationForm}
              layout="vertical"
              onFinish={onSaveNotifications}
            >
              <Form.Item
                name="courseUpdate"
                label="Thông báo về khóa học mới"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="marketing"
                label="Nhận email khuyến mãi và ưu đãi"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Form.Item
                name="reminder"
                label="Nhắc nhở tiếp tục học"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <Button type="primary" htmlType="submit">
                Lưu cài đặt thông báo
              </Button>
            </Form>
          </Card>

          <Card
            style={{ marginTop: 16 }}
            title={
              <span>
                <LockOutlined /> Bảo mật nâng cao
              </span>
            }
          >
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <QrcodeOutlined style={{ marginRight: 8 }} />
                    <span>Xác thực hai lớp (2FA)</span>
                  </div>
                  <div style={{ marginBottom: 8, fontSize: 12, color: "#888" }}>
                    Bật tính năng này để tăng bảo mật khi đăng nhập.
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onChange={toggleTwoFactor}
                  />
                </div>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <DesktopOutlined style={{ marginRight: 8 }} />
                    <span>Thiết bị đang đăng nhập</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                    Danh sách minh họa các phiên đăng nhập gần đây.
                  </div>
                  <div style={{ fontSize: 13 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span>
                        <DesktopOutlined /> Chrome • Windows
                      </span>
                      <Button size="small" danger>
                        Đăng xuất
                      </Button>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 4,
                      }}
                    >
                      <span>
                        <MobileOutlined /> Safari • iOS
                      </span>
                      <Button size="small" danger>
                        Đăng xuất
                      </Button>
                    </div>
                  </div>
                </div>
              </Col>
              <Col xs={24} md={12}>
                <div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 4,
                    }}
                  >
                    <WalletOutlined style={{ marginRight: 8 }} />
                    <span>Liên kết ví Crypto</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#888", marginBottom: 8 }}>
                    Lưu địa chỉ ví để nhận phần thưởng, airdrop hoặc thanh toán.
                  </div>
                  <Input
                    placeholder="Nhập địa chỉ ví (VD: 0x...)"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    style={{ marginBottom: 8 }}
                  />
                  <div style={{ display: "flex", gap: 8 }}>
                    <Button type="primary" onClick={handleConnectWallet}>
                      Lưu địa chỉ ví
                    </Button>
                    <Button danger onClick={handleDisconnectWallet}>
                      Ngắt liên kết
                    </Button>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Modal
        title="Đổi mật khẩu"
        open={passwordModalOpen}
        onCancel={() => setPasswordModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={securityForm} layout="vertical" onFinish={onChangePassword}>
          <Form.Item
            name="oldPassword"
            label="Mật khẩu hiện tại"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            rules={[
              { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} />
          </Form.Item>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Button onClick={() => setPasswordModalOpen(false)}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SettingClientComponent;
