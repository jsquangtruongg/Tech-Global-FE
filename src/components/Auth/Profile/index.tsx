import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  List,
  Modal,
  Row,
  Spin,
  Tabs,
  Tag,
  message,
  Progress,
  Typography,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  SafetyCertificateOutlined,
  ReadOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import "./style.scss";
import { getUserAPI, updateUserAPI, type IUser } from "../../../api/user";
import {
  getCartAPI,
  removeFromCartAPI,
  type ICartItem,
} from "../../../api/cart";

const ProfileClientComponent = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [form] = Form.useForm();

  const fullName =
    [(user as any)?.lastName, (user as any)?.firstName]
      .filter(Boolean)
      .join(" ") || (user as any)?.name;

  const fetchUser = async () => {
    setLoadingUser(true);
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
    setLoadingUser(false);
  };

  const fetchCart = async () => {
    setLoadingCart(true);
    const res = await getCartAPI();
    if (res.err === 0) {
      setCartItems(res.data || []);
    } else {
      message.error(res.mes || "Không thể tải danh sách quan tâm");
    }
    setLoadingCart(false);
  };

  useEffect(() => {
    fetchUser();
    fetchCart();
  }, []);

  const onUpdateProfile = async (values: any) => {
    setUpdating(true);
    const res = await updateUserAPI(values);
    if (res.err === 0) {
      message.success("Cập nhật thông tin thành công");
      await fetchUser();
      const storedProfile = localStorage.getItem("profile");
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        const newProfile = {
          ...parsed,
          userData: {
            ...parsed.userData,
            ...values,
          },
          ...values,
        };
        localStorage.setItem("profile", JSON.stringify(newProfile));
      }
      setEditOpen(false);
    } else {
      message.error(res.mes || "Cập nhật thất bại");
    }
    setUpdating(false);
  };

  const removeInterest = async (courseId: number) => {
    const res = await removeFromCartAPI(courseId);
    if (res.err === 0) {
      message.success("Đã xóa khỏi danh sách quan tâm");
      fetchCart();
    } else {
      message.error(res.mes || "Không thể xóa");
    }
  };

  const interestTab = (
    <Spin spinning={loadingCart}>
      {cartItems.length === 0 ? (
        <Empty description="Chưa có khóa học quan tâm" />
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={cartItems}
          renderItem={(item) => {
            const c = item.course;
            const price =
              typeof c.discount === "number" && c.discount > 0
                ? Math.max(0, c.price - c.discount)
                : c.price;
            const instructorName =
              [
                ((c as any)?.instructor as any)?.lastName,
                ((c as any)?.instructor as any)?.firstName,
              ]
                .filter(Boolean)
                .join(" ") || ((c as any)?.instructor as any)?.name;
            const href = c.slug ? `/course/${c.slug}` : `/course/${c.id}`;
            return (
              <List.Item>
                <Card
                  hoverable
                  cover={
                    <a href={href}>
                      <img
                        alt={c.title}
                        src={c.image}
                        style={{ height: 160, objectFit: "cover" }}
                      />
                    </a>
                  }
                >
                  <Card.Meta
                    title={<a href={href}>{c.title}</a>}
                    description={
                      <div>
                        <div>
                          Giảng viên: {instructorName || "Đang cập nhật"}
                        </div>
                        <div>Trình độ: {c.level}</div>
                        <div>
                          Bài học: {c.lessons_count} • {c.duration}
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <Tag color="blue">{price.toLocaleString()} VND</Tag>
                          {c.discount ? (
                            <Tag color="red">
                              Giảm {c.discount.toLocaleString()} VND
                            </Tag>
                          ) : null}
                        </div>
                      </div>
                    }
                  />
                  <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                    <Button href={href}>Xem chi tiết</Button>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      href="/cart"
                    >
                      Đi tới giỏ hàng
                    </Button>
                    <Button danger onClick={() => removeInterest(c.id!)}>
                      Xóa khỏi quan tâm
                    </Button>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      )}
    </Spin>
  );

  const studyingTab = (
    <List
      grid={{ gutter: 16, column: 1 }}
      dataSource={[
        {
          id: 1,
          title: "Blockchain & Smart Contracts",
          instructor: "Satoshi Nakamoto",
          progress: 65,
          image: "https://files.fullstack.edu.vn/f8-prod/courses/13/13.png",
          lastAccess: "2 giờ trước",
        },
        {
          id: 2,
          title: "Phân tích kỹ thuật Vàng (XAU/USD)",
          instructor: "Gold Expert",
          progress: 30,
          image: "https://files.fullstack.edu.vn/f8-prod/courses/6.png",
          lastAccess: "1 ngày trước",
        },
      ]}
      renderItem={(item) => (
        <List.Item>
          <Card hoverable bodyStyle={{ padding: "12px 24px" }}>
            <Row align="middle" gutter={24}>
              <Col flex="100px">
                <img
                  alt={item.title}
                  src={item.image}
                  style={{
                    width: 100,
                    height: 60,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              </Col>
              <Col flex="auto">
                <h4 style={{ margin: 0 }}>{item.title}</h4>
                <div style={{ color: "#888", fontSize: 13 }}>
                  Giảng viên: {item.instructor}
                </div>
                <div style={{ marginTop: 8 }}>
                  <Progress percent={item.progress} size="small" />
                </div>
              </Col>
              <Col>
                <Button type="primary">Tiếp tục học</Button>
                <div
                  style={{
                    marginTop: 8,
                    textAlign: "center",
                    fontSize: 12,
                    color: "#888",
                  }}
                >
                  Truy cập: {item.lastAccess}
                </div>
              </Col>
            </Row>
          </Card>
        </List.Item>
      )}
    />
  );

  const creditsTab = (
    <List
      grid={{ gutter: 16, column: 2 }}
      dataSource={[
        {
          id: 1,
          title: "Certified Blockchain Developer",
          date: "12/05/2024",
          score: "98/100",
          image:
            "https://www.smartmind.vn/wp-content/uploads/2024/11/chung-chi-chung-khoan.png",
        },
        {
          id: 2,
          title: "Crypto Trading Master",
          date: "10/01/2024",
          score: "Xuất sắc",
          image:
            "https://img.freepik.com/free-vector/gradient-certificate-template_23-2149366479.jpg",
        },
      ]}
      renderItem={(item) => (
        <List.Item>
          <Card
            hoverable
            cover={
              <img
                alt={item.title}
                src={item.image}
                style={{ height: 200, objectFit: "cover" }}
              />
            }
            actions={[
              <Button type="link" icon={<ReadOutlined />}>
                Xem chi tiết
              </Button>,
              <Button type="link" icon={<SafetyCertificateOutlined />}>
                Tải về
              </Button>,
            ]}
          >
            <Card.Meta
              title={item.title}
              description={
                <div>
                  <div>Ngày cấp: {item.date}</div>
                  <div>Điểm số: {item.score}</div>
                </div>
              }
            />
          </Card>
        </List.Item>
      )}
    />
  );

  const achievementsTab = (
    <List
      grid={{ gutter: 16, column: 3 }}
      dataSource={[
        {
          id: 1,
          title: "Diamond Hands",
          desc: "Hold coin hơn 1 năm không bán",
          icon: <TrophyOutlined style={{ fontSize: 32, color: "#faad14" }} />,
          date: "15/05/2024",
        },
        {
          id: 2,
          title: "First Deposit",
          desc: "Nạp tiền lần đầu thành công",
          icon: (
            <CheckCircleOutlined style={{ fontSize: 32, color: "#52c41a" }} />
          ),
          date: "01/01/2024",
        },
        {
          id: 3,
          title: "Market Analyst",
          desc: "Xem biểu đồ liên tục 7 ngày",
          icon: <ReadOutlined style={{ fontSize: 32, color: "#1890ff" }} />,
          date: "20/02/2024",
        },
      ]}
      renderItem={(item) => (
        <List.Item>
          <Card hoverable>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <div style={{ marginBottom: 16 }}>{item.icon}</div>
              <Typography.Title level={5} style={{ marginBottom: 8 }}>
                {item.title}
              </Typography.Title>
              <Typography.Text type="secondary" style={{ marginBottom: 8 }}>
                {item.desc}
              </Typography.Text>
              <div style={{ fontSize: 12, color: "#aaa" }}>
                Đạt được: {item.date}
              </div>
            </div>
          </Card>
        </List.Item>
      )}
    />
  );

  return (
    <div className="client-profile-container">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <Card>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                size={120}
                icon={<UserOutlined />}
                src={(user as any)?.avatar}
              />
              <h3 style={{ marginTop: 12, marginBottom: 4 }}>
                {fullName || "Người dùng"}
              </h3>
              <div style={{ color: "#666", marginBottom: 8 }}>
                <MailOutlined />{" "}
                <span style={{ marginLeft: 6 }}>{user?.email}</span>
              </div>
              <div style={{ color: "#666" }}>
                <PhoneOutlined />{" "}
                <span style={{ marginLeft: 6 }}>
                  {user?.phone || "Chưa cập nhật"}
                </span>
              </div>
              <div style={{ marginTop: 12 }}>
                <Button type="primary" onClick={() => setEditOpen(true)}>
                  Cập nhật thông tin
                </Button>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={16}>
          <Card>
            <Tabs
              items={[
                {
                  key: "studying",
                  label: "Khóa học đang học",
                  children: studyingTab,
                },
                {
                  key: "interested",
                  label: "Khóa học đang quan tâm",
                  children: interestTab,
                },
                {
                  key: "credits",
                  label: "Tín chỉ của bạn",
                  children: creditsTab,
                },
                {
                  key: "achievements",
                  label: "Thành tích đạt được",
                  children: achievementsTab,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="Cập nhật thông tin"
        open={editOpen}
        onCancel={() => setEditOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Spin spinning={updating || loadingUser}>
          <Form form={form} layout="vertical" onFinish={onUpdateProfile}>
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
                    placeholder="https://example.com/avatar.png"
                  />
                </Form.Item>
              </Col>
            </Row>
            <div
              style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}
            >
              <Button onClick={() => setEditOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                Lưu
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </div>
  );
};

export default ProfileClientComponent;
