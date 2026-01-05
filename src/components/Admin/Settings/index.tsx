import React, { useState } from "react";
import {
  Card,
  Tabs,
  Form,
  Input,
  Switch,
  Button,
  Select,
  Row,
  Col,
  message,
  Divider,
  TimePicker,
} from "antd";
import {
  SettingOutlined,
  SafetyOutlined,
  BellOutlined,
  GlobalOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import "./style.scss";

const { Option } = Select;
const { TextArea } = Input;

const SettingsAdminComponent = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = (values: any) => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log("Settings saved:", values);
      message.success("Cấu hình hệ thống đã được lưu thành công!");
      setLoading(false);
    }, 1000);
  };

  const initialValues = {
    siteName: "Tech Global Admin",
    supportEmail: "support@techglobal.com",
    hotline: "1900 1234",
    maintenanceMode: false,
    allowRegistration: true,
    sessionTimeout: "30",
    passwordMinLength: "8",
    twoFactorAuth: false,
    emailNotifications: true,
    systemAlerts: true,
    language: "vi",
    timezone: "asia/ho_chi_minh",
    footerText: "© 2024 Tech Global. All rights reserved.",
  };

  const GeneralSettings = () => (
    <div className="setting-tab-content">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className="setting-item-group">
            <h4>Thông tin chung</h4>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="siteName"
                  label="Tên hệ thống"
                  rules={[
                    { required: true, message: "Vui lòng nhập tên hệ thống" },
                  ]}
                >
                  <Input
                    prefix={<SettingOutlined />}
                    placeholder="Nhập tên hệ thống"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="supportEmail"
                  label="Email hỗ trợ"
                  rules={[{ type: "email", message: "Email không hợp lệ" }]}
                >
                  <Input placeholder="support@example.com" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="hotline" label="Hotline">
                  <Input placeholder="Nhập số hotline" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="footerText" label="Footer Text">
                  <Input placeholder="Nội dung chân trang" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Col>

        <Col span={24}>
          <Divider />
          <div className="setting-item-group">
            <h4>Trạng thái hệ thống</h4>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="maintenanceMode"
                  label="Chế độ bảo trì"
                  valuePropName="checked"
                  help="Khi bật, chỉ Admin mới có thể truy cập hệ thống."
                >
                  <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item
                  name="allowRegistration"
                  label="Cho phép đăng ký mới"
                  valuePropName="checked"
                >
                  <Switch checkedChildren="Cho phép" unCheckedChildren="Khóa" />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </div>
  );

  const SecuritySettings = () => (
    <div className="setting-tab-content">
      <div className="setting-item-group">
        <h4>Bảo mật & Đăng nhập</h4>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="sessionTimeout"
              label="Thời gian hết phiên đăng nhập (phút)"
            >
              <Select>
                <Option value="15">15 phút</Option>
                <Option value="30">30 phút</Option>
                <Option value="60">1 giờ</Option>
                <Option value="120">2 giờ</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="passwordMinLength"
              label="Độ dài mật khẩu tối thiểu"
            >
              <Select>
                <Option value="6">6 ký tự</Option>
                <Option value="8">8 ký tự</Option>
                <Option value="12">12 ký tự</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="twoFactorAuth"
              label="Xác thực 2 lớp (2FA) bắt buộc"
              valuePropName="checked"
              help="Yêu cầu tất cả nhân viên phải sử dụng 2FA."
            >
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  const NotificationSettings = () => (
    <div className="setting-tab-content">
      <div className="setting-item-group">
        <h4>Cấu hình thông báo</h4>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item
              name="emailNotifications"
              label="Gửi thông báo qua Email"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="systemAlerts"
              label="Thông báo hệ thống (Popup)"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  const SystemSettings = () => (
    <div className="setting-tab-content">
      <div className="setting-item-group">
        <h4>Cấu hình vùng & Ngôn ngữ</h4>
        <Row gutter={24}>
          <Col xs={24} md={12}>
            <Form.Item name="language" label="Ngôn ngữ mặc định">
              <Select>
                <Option value="vi">Tiếng Việt</Option>
                <Option value="en">English</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="timezone" label="Múi giờ">
              <Select>
                <Option value="asia/ho_chi_minh">
                  Asia/Ho_Chi_Minh (GMT+7)
                </Option>
                <Option value="utc">UTC</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  );

  const items = [
    {
      key: "1",
      label: (
        <span>
          <SettingOutlined />
          <span style={{ marginRight: 5 }}>Chung</span>
        </span>
      ),
      children: <GeneralSettings />,
    },
    {
      key: "2",
      label: (
        <span>
          <SafetyOutlined />
          <span style={{ marginRight: 5 }}>Bảo mật</span>
        </span>
      ),
      children: <SecuritySettings />,
    },
    {
      key: "3",
      label: (
        <span>
          <BellOutlined />
          <span style={{ marginRight: 5 }}>Thông báo</span>
        </span>
      ),
      children: <NotificationSettings />,
    },
    {
      key: "4",
      label: (
        <span>
          <GlobalOutlined />
          <span style={{ marginRight: 5 }}>Hệ thống</span>
        </span>
      ),
      children: <SystemSettings />,
    },
  ];

  return (
    <div className="settings-admin-container">
      <Card title="Cài đặt hệ thống" className="settings-card" bordered={false}>
        <Form
          form={form}
          layout="vertical"
          initialValues={initialValues}
          onFinish={onFinish}
        >
          <Tabs defaultActiveKey="1" items={items} />

          <div className="submit-btn-container">
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
            >
              Lưu cấu hình
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default SettingsAdminComponent;
