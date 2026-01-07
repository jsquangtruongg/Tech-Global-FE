import "./style.scss";
import { useState, useEffect } from "react";
import {
  UserOutlined,
  ShoppingCartOutlined,
  FileTextOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";
import { Card, Row, Col, Statistic, Spin } from "antd";
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
import { getDashboardDataAPI, type IDashboardResponse } from "../../../api/analytics";

const DashBoardAdminComponent = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<IDashboardResponse["data"] | null>(null);

  const navigate = useNavigate();
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getDashboardDataAPI();
      if (res.err === 0) {
        setData(res.data);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleCourseClick = () => {
    navigate("/admin/analytics-course");
  };

  if (loading) {
    return (
      <div className="dashboard-admin" style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  const { summary, charts } = data || {
    summary: { totalUsers: 0, totalOrders: 0, totalPosts: 0, totalRevenue: 0 },
    charts: { userGrowth: [], revenueGrowth: [], postCategories: [] },
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
                value={summary.totalUsers}
                prefix={<UserOutlined />}
                valueStyle={{ color: "#3f8600" }}
              />
              <div className="stat-footer">
                {/* <span className="text-success">
                  <ArrowUpOutlined /> 12%
                </span>
                <span className="text-muted"> so với tháng trước</span> */}
                <span className="text-muted">Người dùng trên hệ thống</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6} onClick={handleCourseClick} style={{ cursor: "pointer" }}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Khóa học đã bán"
                value={summary.totalOrders}
                prefix={<ShoppingCartOutlined />}
                valueStyle={{ color: "#cf1322" }}
              />
              <div className="stat-footer">
                {/* <span className="text-danger">
                  <ArrowDownOutlined /> 5%
                </span>
                <span className="text-muted"> so với tháng trước</span> */}
                 <span className="text-muted">Đơn hàng thành công</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Bài viết đã đăng"
                value={summary.totalPosts}
                prefix={<FileTextOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
              <div className="stat-footer">
                {/* <span className="text-success">
                  <ArrowUpOutlined /> 20%
                </span>
                <span className="text-muted"> so với tháng trước</span> */}
                 <span className="text-muted">Bài viết công khai</span>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title="Doanh thu (VNĐ)"
                value={summary.totalRevenue}
                prefix={<DollarCircleOutlined />}
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
              <div className="stat-footer">
                {/* <span className="text-success">
                  <ArrowUpOutlined /> 8%
                </span>
                <span className="text-muted"> so với tháng trước</span> */}
                 <span className="text-muted">Tổng doanh thu thực tế</span>
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
                  <AreaChart data={charts.userGrowth}>
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
                      dataKey="count"
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
                      data={charts.postCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {charts.postCategories.map((entry, index) => (
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
                  <BarChart data={charts.revenueGrowth}>
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
