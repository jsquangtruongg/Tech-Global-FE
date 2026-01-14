import React from "react";
import { Card, Col, Form, Input, Row, Button, Typography } from "antd";
import {
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  MessageOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import "./style.scss";

const { Title, Paragraph, Text } = Typography;

const ContactClientComponent = () => {
  const [form] = Form.useForm();

  const handleSubmit = (values: any) => {
    console.log("Contact form submit", values);
  };

  return (
    <div className="client-contact-container">
      <div className="client-contact-hero">
        <div className="client-contact-hero__content">
          <Title level={2}>Liên hệ đội ngũ Tech Global</Title>
          <Paragraph>
            Nếu bạn gặp vấn đề khi sử dụng hệ thống, cần hỗ trợ về khóa học,
            thanh toán hoặc tài khoản, hãy gửi yêu cầu cho đội ngũ Admin. Chúng
            tôi luôn sẵn sàng hỗ trợ bạn.
          </Paragraph>
          <div className="client-contact-hero__highlights">
            <span>Thời gian phản hồi trung bình: dưới 24 giờ</span>
            <span>Hỗ trợ qua Email, Zalo, Telegram</span>
          </div>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={14}>
          <Card title="Gửi yêu cầu hỗ trợ">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ category: "technical" }}
            >
              <Form.Item
                name="fullName"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
              >
                <Input size="large" placeholder="Nhập họ và tên của bạn" />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email liên hệ"
                rules={[
                  { required: true, message: "Vui lòng nhập email" },
                  { type: "email", message: "Email không hợp lệ" },
                ]}
              >
                <Input
                  size="large"
                  prefix={<MailOutlined />}
                  placeholder="you@example.com"
                />
              </Form.Item>
              <Form.Item name="phone" label="Số điện thoại (tuỳ chọn)">
                <Input
                  size="large"
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại để chúng tôi liên hệ nhanh hơn"
                />
              </Form.Item>
              <Form.Item
                name="subject"
                label="Tiêu đề"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input
                  size="large"
                  placeholder="Ví dụ: Không đăng nhập được vào tài khoản"
                />
              </Form.Item>
              <Form.Item
                name="message"
                label="Nội dung mô tả chi tiết"
                rules={[
                  { required: true, message: "Vui lòng mô tả yêu cầu hỗ trợ" },
                ]}
              >
                <Input.TextArea
                  rows={6}
                  placeholder="Mô tả vấn đề bạn gặp phải, thao tác đã thực hiện, thông báo lỗi (nếu có)..."
                />
              </Form.Item>
              <div className="client-contact-form__footer">
                <Text type="secondary">
                  Vui lòng không gửi thông tin nhạy cảm như mật khẩu hoặc mã
                  OTP.
                </Text>
                <Button type="primary" htmlType="submit" size="large">
                  Gửi yêu cầu
                </Button>
              </div>
            </Form>
          </Card>
        </Col>

        <Col xs={24} md={10}>
          <Card title="Thông tin liên hệ Admin">
            <div className="client-contact-info-item">
              <TeamOutlined className="client-contact-info-icon" />
              <div>
                <Text strong>Đội ngũ quản trị hệ thống</Text>
                <Paragraph type="secondary">
                  Xử lý các vấn đề về tài khoản, phân quyền, truy cập khóa học
                  và hành vi bất thường.
                </Paragraph>
                <Text>Email: support@techglobal.vn</Text>
              </div>
            </div>

            <div className="client-contact-info-item">
              <MessageOutlined className="client-contact-info-icon" />
              <div>
                <Text strong>Kênh hỗ trợ nhanh</Text>
                <Paragraph type="secondary">
                  Bạn có thể nhắn tin trực tiếp cho Admin qua:
                </Paragraph>
                <ul className="client-contact-list">
                  <li>Zalo: 0123 456 789</li>
                  <li>Telegram: @techglobal_support</li>
                </ul>
              </div>
            </div>

            <div className="client-contact-info-item">
              <ClockCircleOutlined className="client-contact-info-icon" />
              <div>
                <Text strong>Thời gian làm việc</Text>
                <Paragraph type="secondary">
                  Thứ 2 - Thứ 6: 8:30 - 21:00
                  <br />
                  Thứ 7 - Chủ nhật: 9:00 - 17:00
                </Paragraph>
              </div>
            </div>

            <div className="client-contact-info-item">
              <PhoneOutlined className="client-contact-info-icon" />
              <div>
                <Text strong>Hotline</Text>
                <Paragraph type="secondary">
                  0909 999 999 (cước phí theo nhà mạng)
                </Paragraph>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ContactClientComponent;
