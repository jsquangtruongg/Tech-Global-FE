import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
  Select,
  Avatar,
  Row,
  Col,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  FilterOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useLocation } from "react-router-dom";
import {
  getAllUsersAPI,
  createUserAPI,
  updateUserByAdminAPI,
  deleteUserAPI,
  type IUser,
} from "../../../api/user";
import "./style.scss";

const { Option } = Select;

const UserListAdminComponent = () => {
  const location = useLocation();
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<IUser | null>(null);
  const [searchText, setSearchText] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [form] = Form.useForm();

  // Determine current role filter from URL
  const currentPath = location.pathname;
  let roleFilter: "admin" | "staff" | "customer" | "all" = "all";
  let pageTitle = "Danh sách người dùng";

  if (currentPath.includes("/users/admin")) {
    roleFilter = "admin";
    pageTitle = "Quản lý Admin";
  } else if (currentPath.includes("/users/staff")) {
    roleFilter = "staff";
    pageTitle = "Quản lý Nhân viên";
  } else if (currentPath.includes("/users/customer")) {
    roleFilter = "customer";
    pageTitle = "Quản lý Khách hàng";
  }

  // Mock Data
  const MOCK_USERS: IUser[] = [
    {
      id: 1,
      name: "Nguyễn Văn Admin",
      email: "admin@techglobal.com",
      role: "admin",
      status: "active",
      phone: "0901234567",
      createdAt: "2023-01-01",
    },
    {
      id: 2,
      name: "Trần Thị Staff",
      email: "staff@techglobal.com",
      role: "staff",
      status: "active",
      phone: "0901234568",
      createdAt: "2023-02-15",
    },
    {
      id: 3,
      name: "Lê Văn Customer",
      email: "customer@gmail.com",
      role: "customer",
      status: "active",
      phone: "0901234569",
      createdAt: "2023-03-20",
    },
    {
      id: 4,
      name: "Phạm Văn Banned",
      email: "banned@gmail.com",
      role: "customer",
      status: "banned",
      phone: "0901234570",
      createdAt: "2023-04-10",
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsersAPI({});
      if (res.err === 0 && res.userData && res.userData.length > 0) {
        // Map backend data to frontend interface
        const mappedUsers: IUser[] = res.userData.map((u: any) => {
          let role: "admin" | "staff" | "customer" = "customer";
          const code = u.roleData?.code || u.role_code;
          if (code === "R1") role = "admin";
          if (code === "R2") role = "staff";

          return {
            id: u.id,
            name: u.name,
            email: u.email,
            role: role,
            status: u.status || "active",
            phone: u.phone || "",
            createdAt: u.createdAt
              ? new Date(u.createdAt).toISOString().split("T")[0]
              : "",
            avatar: u.avatar,
          };
        });
        setUsers(mappedUsers);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      message.error("Lỗi khi tải danh sách người dùng");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (value: string) => {
    setIsSearching(true);
    setTimeout(() => {
      setSearchText(value);
      setIsSearching(false);
    }, 800);
  };

  const filteredUsers = users.filter((user) => {
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (user.phone && user.phone.includes(searchText));
    return matchesRole && matchesSearch;
  });

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    // Pre-fill role if specific page
    if (roleFilter !== "all") {
      form.setFieldsValue({ role: roleFilter });
    }
    setIsModalOpen(true);
  };

  const handleEdit = (record: IUser) => {
    setEditingUser(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const res = await deleteUserAPI(id);
    if (res.err === 0) {
      message.success("Xóa người dùng thành công");
      fetchUsers();
    } else {
      message.success("Xóa người dùng thành công (Mock)");
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (editingUser) {
        const res = await updateUserByAdminAPI(editingUser.id!, values);
        if (res.err === 0) {
          message.success("Cập nhật người dùng thành công");
          fetchUsers();
        } else {
          message.success("Cập nhật người dùng thành công (Mock)");
          setUsers(
            users.map((u) =>
              u.id === editingUser.id ? { ...u, ...values } : u
            )
          );
        }
      } else {
        const res = await createUserAPI(values);
        if (res.err === 0) {
          message.success("Tạo người dùng thành công");
          fetchUsers();
        } else {
          message.success("Tạo người dùng thành công (Mock)");
          const newUser = {
            ...values,
            id: Math.floor(Math.random() * 1000),
            createdAt: new Date().toISOString().split("T")[0],
          };
          setUsers([newUser, ...users]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Người dùng",
      key: "user",
      render: (_: any, record: IUser) => (
        <Space>
          <Avatar src={record.avatar} icon={<UserOutlined />} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{record.name}</span>
            <span style={{ fontSize: 12, color: "#888" }}>{record.email}</span>
          </div>
        </Space>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        let color = "default";
        let label = role;
        if (role === "admin") {
          color = "red";
          label = "Admin";
        }
        if (role === "staff") {
          color = "blue";
          label = "Nhân viên";
        }
        if (role === "customer") {
          color = "green";
          label = "Khách hàng";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        let label = status;
        if (status === "active") {
          color = "success";
          label = "Hoạt động";
        }
        if (status === "inactive") {
          color = "warning";
          label = "Không hoạt động";
        }
        if (status === "banned") {
          color = "error";
          label = "Bị khóa";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IUser) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: "#faad14" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="user-admin-container">
      <div className="page-header">
        <h2 className="page-title">{pageTitle}</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="btn-add"
        >
          Thêm người dùng
        </Button>
      </div>

      <div className="filter-bar">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm kiếm tên, email, sđt..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            enterButton
            allowClear
            loading={loading || isSearching}
            size="large"
            style={{ width: 400 }}
          />
          <Select
            defaultValue="all"
            style={{ width: 200 }}
            size="large"
            onChange={(value) => setStatusFilter(value)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
            <Option value="banned">Bị khóa</Option>
          </Select>
        </Space>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchUsers}
          size="large"
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredUsers}
        rowKey="id"
        loading={loading || isSearching}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingUser ? "Chỉnh sửa thông tin" : "Thêm người dùng mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
        okText={editingUser ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="userForm">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Họ và tên"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ tên" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" disabled={!!editingUser} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="role"
                label="Vai trò"
                rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
                initialValue={roleFilter !== "all" ? roleFilter : undefined}
              >
                <Select placeholder="Chọn vai trò">
                  <Option value="admin">Admin</Option>
                  <Option value="staff">Nhân viên</Option>
                  <Option value="customer">Khách hàng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="active">
                <Select>
                  <Option value="active">Hoạt động</Option>
                  <Option value="inactive">Không hoạt động</Option>
                  <Option value="banned">Bị khóa</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              {/* Password field only for Create or explicit reset? usually handled separately */}
              {!editingUser && (
                <Form.Item
                  name="password"
                  label="Mật khẩu"
                  rules={[
                    { required: true, message: "Vui lòng nhập mật khẩu!" },
                  ]}
                >
                  <Input.Password placeholder="Nhập mật khẩu" />
                </Form.Item>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListAdminComponent;
