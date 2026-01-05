import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Tag,
  DatePicker,
  Select,
  Button,
  Statistic,
  List,
  Avatar,
  Divider,
} from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  DollarCircleOutlined,
  ReadOutlined,
  UserOutlined,
  RiseOutlined,
  TrophyOutlined,
  FallOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  BookOutlined,
  StarFilled,
} from "@ant-design/icons";
import dayjs from "dayjs";
import "./style.scss";
import { useNavigate } from "react-router-dom";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsCourseComponent = () => {
  const [timeRange, setTimeRange] = useState("month");
  const navigate = useNavigate();
  // --- Mock Data ---

  // 1. Overall Statistics
  const statsData = [
    {
      title: "Tổng Doanh Thu",
      value: 1258900000,
      prefix: <DollarCircleOutlined />,
      suffix: "VNĐ",
      color: "#3f8600",
      trend: "up",
      trendValue: "15%",
      desc: "So với tháng trước",
    },
    {
      title: "Khóa Học Đã Bán",
      value: 1250,
      prefix: <ReadOutlined />,
      suffix: "",
      color: "#1890ff",
      trend: "up",
      trendValue: "8%",
      desc: "So với tháng trước",
    },
    {
      title: "Học Viên Mới",
      value: 340,
      prefix: <UserOutlined />,
      suffix: "",
      color: "#722ed1",
      trend: "down",
      trendValue: "3%",
      desc: "So với tháng trước",
    },
    {
      title: "Đánh Giá Trung Bình",
      value: 4.8,
      prefix: <StarFilled style={{ color: "#faad14" }} />,
      suffix: "/ 5",
      color: "#faad14",
      trend: "up",
      trendValue: "0.2",
      desc: "So với tháng trước",
    },
  ];

  // 2. Revenue Trend Data (Line/Area Chart)
  const revenueTrendData = [
    { name: "Tháng 1", revenue: 150000000, students: 120 },
    { name: "Tháng 2", revenue: 180000000, students: 145 },
    { name: "Tháng 3", revenue: 160000000, students: 130 },
    { name: "Tháng 4", revenue: 250000000, students: 210 },
    { name: "Tháng 5", revenue: 210000000, students: 180 },
    { name: "Tháng 6", revenue: 290000000, students: 265 },
  ];

  // 3. Best Selling Courses (Table)
  const bestSellingData = [
    {
      key: "1",
      rank: 1,
      name: "Phân Tích Kỹ Thuật Toàn Tập",
      category: "Trading",
      sales: 450,
      revenue: 450000000,
      rating: 4.9,
      status: "active",
    },
    {
      key: "2",
      rank: 2,
      name: "Đầu Tư Crypto Cho Người Mới",
      category: "Crypto",
      sales: 320,
      revenue: 160000000,
      rating: 4.7,
      status: "active",
    },
    {
      key: "3",
      rank: 3,
      name: "Quản Lý Vốn Nâng Cao",
      category: "Finance",
      sales: 210,
      revenue: 105000000,
      rating: 4.8,
      status: "active",
    },
    {
      key: "4",
      rank: 4,
      name: "Lập Trình Bot Trading Python",
      category: "Programming",
      sales: 150,
      revenue: 225000000,
      rating: 4.6,
      status: "active",
    },
    {
      key: "5",
      rank: 5,
      name: "Tâm Lý Giao Dịch Thực Chiến",
      category: "Psychology",
      sales: 120,
      revenue: 36000000,
      rating: 4.9,
      status: "active",
    },
  ];

  // 4. Category Distribution (Pie Chart)
  const categoryData = [
    { name: "Trading", value: 45 },
    { name: "Crypto", value: 25 },
    { name: "Finance", value: 15 },
    { name: "Programming", value: 10 },
    { name: "Psychology", value: 5 },
  ];
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  // 5. Recent Transactions
  const recentTransactions = [
    {
      user: "Nguyễn Văn A",
      course: "Phân Tích Kỹ Thuật",
      time: "10 phút trước",
      amount: "1,000,000đ",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=1",
    },
    {
      user: "Trần Thị B",
      course: "Crypto Basic",
      time: "25 phút trước",
      amount: "500,000đ",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
    },
    {
      user: "Lê Hoàng C",
      course: "Quản Lý Vốn",
      time: "1 giờ trước",
      amount: "750,000đ",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=3",
    },
    {
      user: "Phạm Minh D",
      course: "Bot Trading",
      time: "2 giờ trước",
      amount: "1,500,000đ",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=4",
    },
  ];

  // Table Columns
  const columns = [
    {
      title: "Hạng",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) => {
        let color = "default";
        if (rank === 1) color = "#f5222d"; // Gold/Red for #1
        if (rank === 2) color = "#fa8c16";
        if (rank === 3) color = "#faad14";
        return (
          <Avatar
            size="small"
            style={{ backgroundColor: color, verticalAlign: "middle" }}
          >
            {rank}
          </Avatar>
        );
      },
    },
    {
      title: "Tên Khóa Học",
      dataIndex: "name",
      key: "name",
      render: (text: string) => (
        <span style={{ fontWeight: 600 }}>
          {text.length > 25 ? `${text.substring(0, 25)}...` : text}
        </span>
      ),
    },
    {
      title: "Danh Mục",
      dataIndex: "category",
      key: "category",
      width: 100,
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Số Lượng Bán",
      dataIndex: "sales",
      key: "sales",
      width: 110,
      align: "center" as const,
      sorter: (a: any, b: any) => a.sales - b.sales,
    },
    {
      title: "Doanh Thu",
      dataIndex: "revenue",
      key: "revenue",
      width: 160,
      render: (value: number) => value.toLocaleString("vi-VN") + " đ",
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: "Đánh Giá",
      dataIndex: "rating",
      key: "rating",
      width: 110,
      align: "center" as const,
      render: (rating: number) => (
        <span>
          {rating} <StarFilled style={{ color: "#faad14" }} />
        </span>
      ),
    },
  ];
  const handleAnalyticNewUser = () => {
    navigate("/admin/analytics-new-user");
  };
  return (
    <div className="analytics-course-container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Phân Tích Hiệu Quả Khóa Học</h2>
          <p className="page-subtitle">
            Tổng quan về doanh thu, số lượng bán và xu hướng khóa học
          </p>
        </div>
        <div className="header-actions">
          <RangePicker style={{ marginRight: 10 }} />
          <Button type="primary" icon={<ReadOutlined />}>
            Xuất Báo Cáo
          </Button>
        </div>
      </div>

      {/* 1. Statistics Cards */}
      <Row gutter={[24, 24]} className="stats-row">
        {statsData.map((stat, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              bordered={false}
              className="stat-card"
              onClick={() => {
                if (stat.title.includes("Học Viên")) {
                  handleAnalyticNewUser();
                }
              }}
              style={{
                cursor: stat.title.includes("Học Viên") ? "pointer" : undefined,
              }}
            >
              <Statistic
                title={<span className="stat-title">{stat.title}</span>}
                value={stat.value}
                precision={stat.title.includes("Doanh Thu") ? 0 : 1}
                formatter={(value) =>
                  typeof value === "number" && stat.title.includes("Doanh Thu")
                    ? value.toLocaleString("vi-VN")
                    : value
                }
                prefix={stat.prefix}
                suffix={<span className="stat-suffix">{stat.suffix}</span>}
                valueStyle={{ color: stat.color, fontWeight: "bold" }}
              />
              <div className="stat-footer">
                <span
                  className={`trend-text ${stat.trend}`}
                  style={{
                    color: stat.trend === "up" ? "#3f8600" : "#cf1322",
                    marginRight: 8,
                  }}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpOutlined />
                  ) : (
                    <ArrowDownOutlined />
                  )}
                  {stat.trendValue}
                </span>
                <span className="stat-desc">{stat.desc}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 2. Charts Row */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title="Biểu Đồ Doanh Thu & Học Viên"
            bordered={false}
            className="chart-card"
            extra={
              <Select defaultValue="6months" style={{ width: 120 }}>
                <Option value="week">Tuần này</Option>
                <Option value="month">Tháng này</Option>
                <Option value="6months">6 tháng qua</Option>
              </Select>
            }
          >
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorStudents"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any, name: any) => [
                      name === "Doanh Thu"
                        ? value.toLocaleString("vi-VN") + " đ"
                        : value,
                      name,
                    ]}
                  />
                  <Legend />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Doanh Thu"
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="students"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorStudents)"
                    name="Học Viên"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Tỷ Trọng Danh Mục"
            bordered={false}
            className="chart-card"
          >
            <div style={{ height: 350, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`
                    }
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 3. Bottom Row: Top Courses & Recent Transactions */}
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <TrophyOutlined style={{ color: "#faad14" }} />
                <span>Top Khóa Học Bán Chạy Nhất</span>
              </div>
            }
            bordered={false}
            className="table-card"
          >
            <Table
              columns={columns}
              dataSource={bestSellingData}
              pagination={false}
              className="best-seller-table"
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="Giao Dịch Gần Đây"
            bordered={false}
            className="transactions-card"
          >
            <List
              itemLayout="horizontal"
              dataSource={recentTransactions}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} />}
                    title={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{item.user}</span>
                        <span style={{ color: "#52c41a", fontWeight: 500 }}>
                          +{item.amount}
                        </span>
                      </div>
                    }
                    description={
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: 12,
                        }}
                      >
                        <span>Mua: {item.course}</span>
                        <span>{item.time}</span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
            <Divider style={{ margin: "12px 0" }} />
            <Button block type="dashed">
              Xem Tất Cả Giao Dịch
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsCourseComponent;
