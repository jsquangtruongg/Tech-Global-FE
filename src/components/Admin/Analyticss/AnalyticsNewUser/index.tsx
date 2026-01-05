import React, { useState } from "react";
import "./style.scss";
import {
  Card,
  Row,
  Col,
  Statistic,
  Select,
  DatePicker,
  Table,
  Tag,
  List,
  Avatar,
  Divider,
  Progress,
} from "antd";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import {
  SmileOutlined,
  FrownOutlined,
  UserOutlined,
  RiseOutlined,
  FallOutlined,
  MehOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { Option } = Select;

const AnalyticsNewUserComponent = () => {
  const [timeRange, setTimeRange] = useState("6months");

  const stats = [
    {
      title: "Mức độ hài lòng",
      value: 92,
      suffix: "%",
      icon: <SmileOutlined />,
      color: "#52c41a",
      trend: "up",
      trendValue: "1.8%",
    },
    {
      title: "Đang học",
      value: 1240,
      suffix: "",
      icon: <UserOutlined />,
      color: "#1890ff",
      trend: "up",
      trendValue: "6%",
    },
    {
      title: "Đã xin nghỉ",
      value: 48,
      suffix: "",
      icon: <FrownOutlined />,
      color: "#cf1322",
      trend: "down",
      trendValue: "1%",
    },
    {
      title: "Tỷ lệ quay lại",
      value: 37,
      suffix: "%",
      icon: <MehOutlined />,
      color: "#faad14",
      trend: "up",
      trendValue: "0.6%",
    },
  ];

  const satisfactionTrend = [
    { name: "Tháng 1", score: 88 },
    { name: "Tháng 2", score: 90 },
    { name: "Tháng 3", score: 91 },
    { name: "Tháng 4", score: 89 },
    { name: "Tháng 5", score: 93 },
    { name: "Tháng 6", score: 92 },
  ];

  const studyStatus = [
    { name: "Tuần 1", active: 210, paused: 28, dropped: 10 },
    { name: "Tuần 2", active: 230, paused: 25, dropped: 12 },
    { name: "Tuần 3", active: 240, paused: 22, dropped: 8 },
    { name: "Tuần 4", active: 260, paused: 18, dropped: 9 },
  ];

  const leaveReasons = [
    { name: "Công việc", value: 35 },
    { name: "Tài chính", value: 20 },
    { name: "Chương trình khó", value: 18 },
    { name: "Sức khỏe", value: 12 },
    { name: "Khác", value: 15 },
  ];
  const REASON_COLORS = ["#1890ff", "#f5222d", "#faad14", "#722ed1", "#00C49F"];

  const recentLeaves = [
    {
      user: "Nguyễn Minh K",
      course: "Crypto Basic",
      reason: "Công việc",
      date: "2025-12-18",
      status: "Đã duyệt",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=10",
    },
    {
      user: "Trần Thị H",
      course: "Phân tích kỹ thuật",
      reason: "Tài chính",
      date: "2025-12-15",
      status: "Chờ duyệt",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=11",
    },
    {
      user: "Lê Hoàng M",
      course: "Quản lý vốn",
      reason: "Sức khỏe",
      date: "2025-12-12",
      status: "Từ chối",
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=12",
    },
  ];

  const leaveColumns = [
    {
      title: "Học viên",
      dataIndex: "user",
      key: "user",
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Khóa học",
      dataIndex: "course",
      key: "course",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
      render: (text: string) => <Tag color="volcano">{text}</Tag>,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text: string) => {
        const color =
          text === "Đã duyệt" ? "green" : text === "Từ chối" ? "red" : "gold";
        return <Tag color={color}>{text}</Tag>;
      },
    },
  ];

  return (
    <div className="analytics-new-user-page">
      <div className="page-header">
        <div>
          <h2 className="page-title">Phân tích Học Viên Mới</h2>
          <p className="page-subtitle">
            Theo dõi độ hài lòng, trạng thái học tập và lý do nghỉ học
          </p>
        </div>
        <div className="header-actions">
          <RangePicker style={{ marginRight: 10 }} />
          <Select
            value={timeRange}
            onChange={(v) => setTimeRange(v)}
            style={{ width: 160 }}
          >
            <Option value="week">Tuần này</Option>
            <Option value="month">Tháng này</Option>
            <Option value="6months">6 tháng qua</Option>
          </Select>
        </div>
      </div>

      <Row gutter={[24, 24]} className="stats-row">
        {stats.map((s, i) => (
          <Col xs={24} sm={12} lg={6} key={i}>
            <Card bordered={false} className="stat-card">
              <Statistic
                title={<span className="stat-title">{s.title}</span>}
                value={s.value}
                suffix={<span className="stat-suffix">{s.suffix}</span>}
                prefix={s.icon}
                valueStyle={{ color: s.color, fontWeight: "bold" }}
              />
              <div className="stat-footer">
                <span
                  className="trend-text"
                  style={{
                    color: s.trend === "up" ? "#3f8600" : "#cf1322",
                    marginRight: 8,
                  }}
                >
                  {s.trend === "up" ? <RiseOutlined /> : <FallOutlined />}
                  {s.trendValue}
                </span>
                <span className="stat-desc">so với kỳ trước</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title="Xu hướng hài lòng"
            bordered={false}
            className="chart-card"
          >
            <div style={{ height: 320, width: "100%" }}>
              <ResponsiveContainer>
                <AreaChart data={satisfactionTrend}>
                  <defs>
                    <linearGradient id="colorSatis" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#52c41a" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#52c41a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                    formatter={(value: any) => [`${value}%`, "Hài lòng"]}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#52c41a"
                    fillOpacity={1}
                    fill="url(#colorSatis)"
                    name="Điểm hài lòng"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Lý do nghỉ học" bordered={false} className="chart-card">
            <div style={{ height: 320, width: "100%" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={leaveReasons}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent ? percent * 100 : 0).toFixed(0)}%`
                    }
                    stroke="none"
                  >
                    {leaveReasons.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={REASON_COLORS[index % REASON_COLORS.length]}
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

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title="Yêu cầu nghỉ gần đây"
            bordered={false}
            className="table-card"
          >
            <Table
              columns={leaveColumns}
              dataSource={recentLeaves}
              pagination={false}
              rowKey="date"
            />
            <Divider style={{ margin: "12px 0" }} />
            <List
              header="Mức độ hài lòng mới ghi nhận"
              dataSource={[
                { name: "Nguyễn Văn A", score: 95 },
                { name: "Trần Thị B", score: 88 },
                { name: "Lê Hoàng C", score: 91 },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={item.name}
                    description={
                      <Progress
                        percent={item.score}
                        size="small"
                        status="active"
                      />
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title="Trạng thái học tập"
            bordered={false}
            className="chart-card"
          >
            <div style={{ height: 320, width: "100%" }}>
              <ResponsiveContainer>
                <BarChart data={studyStatus} margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="active" fill="#1890ff" name="Đang học" />
                  <Bar dataKey="paused" fill="#faad14" name="Tạm nghỉ" />
                  <Bar dataKey="dropped" fill="#f5222d" name="Bỏ học" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AnalyticsNewUserComponent;
