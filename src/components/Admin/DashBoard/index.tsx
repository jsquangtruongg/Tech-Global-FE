import "./style.scss";
import { useState } from "react";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Statistic } from "antd";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Sector,
} from "recharts";
import { useNavigate } from "react-router-dom";

const DashBoardAdminComponent = () => {
  // Mock data for charts
  const userGrowthData = [
    { month: "Jan", users: 400 },
    { month: "Feb", users: 600 },
    { month: "Mar", users: 900 },
    { month: "Apr", users: 1200 },
    { month: "May", users: 1500 },
    { month: "Jun", users: 1800 },
    { month: "Jul", users: 2400 },
  ];

  const revenueData = [
    { month: "Jan", revenue: 2400, orders: 24 },
    { month: "Feb", revenue: 1398, orders: 13 },
    { month: "Mar", revenue: 9800, orders: 98 },
    { month: "Apr", revenue: 3908, orders: 39 },
    { month: "May", revenue: 4800, orders: 48 },
    { month: "Jun", revenue: 3800, orders: 38 },
    { month: "Jul", revenue: 4300, orders: 43 },
  ];

  const postCategoryData = [
    { name: "Công nghệ", value: 400 },
    { name: "Kinh doanh", value: 300 },
    { name: "Thiết kế", value: 300 },
    { name: "Marketing", value: 200 },
  ];
  const navigate = useNavigate();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const [activeIndex, setActiveIndex] = useState(-1);

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } =
      props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 6}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={fill}
          strokeWidth={2}
          style={{ filter: `drop-shadow(0px 0px 10px ${fill})` }}
        />
      </g>
    );
  };

  const handleCourseClick = () => {
    navigate("/admin/analytics-course");
  };
  return (
    <div className="dashboard-admin">
      <div className="dashboard-header">
        <h1 className="header-title">Tổng quan hệ thống</h1>
        <p className="header-subtitle">Chào mừng bạn trở lại trang quản trị</p>
      </div>

      {/* Summary Cards */}
      <div className="dashboard-stats">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Tổng người dùng"
                value={1128}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <div className="stat-footer">
                <span className="text-success">
                  <ArrowUpOutlined /> 12%
                </span>
                <span className="text-muted"> so với tháng trước</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} onClick={handleCourseClick}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Khóa học đã bán"
                value={93}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
              <div className="stat-footer">
                <span className="text-danger">
                  <ArrowDownOutlined /> 5%
                </span>
                <span className="text-muted"> so với tháng trước</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Bài viết đã đăng"
                value={45}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <div className="stat-footer">
                <span className="text-success">
                  <ArrowUpOutlined /> 20%
                </span>
                <span className="text-muted"> so với tháng trước</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Doanh thu (VNĐ)"
                value={15000000}
                prefix={<DollarCircleOutlined />}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
              <div className="stat-footer">
                <span className="text-success">
                  <ArrowUpOutlined /> 8%
                </span>
                <span className="text-muted"> so với tháng trước</span>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* Charts Section */}
      <div className="dashboard-charts">
        <Row gutter={[24, 24]}>
          {/* User Growth Chart */}
          <Col xs={24} lg={16}>
            <Card
              title="Tăng trưởng người dùng"
              bordered={false}
              className="chart-card"
            >
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <AreaChart data={userGrowthData}>
                    <defs>
                      <linearGradient
                        id="colorUsers"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#1890ff"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#1890ff"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area
                      type="monotone"
                      dataKey="users"
                      stroke="#1890ff"
                      fillOpacity={1}
                      fill="url(#colorUsers)"
                      name="Người dùng"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Post Categories Pie Chart */}
          <Col xs={24} lg={8}>
            <Card
              title="Phân loại bài viết"
              bordered={false}
              className="chart-card"
            >
              <div style={{ width: "100%", height: 300 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={postCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {postCategoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>

          {/* Revenue Bar Chart */}
          <Col xs={24}>
            <Card
              title="Doanh thu & Đơn hàng"
              bordered={false}
              className="chart-card"
            >
              <div style={{ width: "100%", height: 350 }}>
                <ResponsiveContainer>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="revenue"
                      name="Doanh thu"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="orders"
                      name="Đơn hàng"
                      fill="#82ca9d"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DashBoardAdminComponent;
