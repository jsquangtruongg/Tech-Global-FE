import React from "react";
import { Card, Row, Col, Table, Tag, Progress, Tabs } from "antd";
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
  UserOutlined,
  ShoppingCartOutlined,
  RiseOutlined,
  ClockCircleOutlined,
  DesktopOutlined,
  MobileOutlined,
  TabletOutlined,
} from "@ant-design/icons";
import "./style.scss";

const AnalyticsAdminComponent = () => {
  // Mock Data
  const activityData = [
    { time: "00:00", users: 120 },
    { time: "04:00", users: 50 },
    { time: "08:00", users: 450 },
    { time: "12:00", users: 890 },
    { time: "16:00", users: 780 },
    { time: "20:00", users: 1100 },
    { time: "23:59", users: 340 },
  ];

  const courseInterestData = [
    { name: "Phân tích kỹ thuật", interest: 85, students: 1200 },
    { name: "Quản lý rủi ro", interest: 70, students: 980 },
    { name: "Tâm lý giao dịch", interest: 65, students: 850 },
    { name: "Crypto Basic", interest: 50, students: 600 },
    { name: "Forex Advanced", interest: 45, students: 540 },
  ];

  const salesData = [
    { name: "Khóa học Pro", sales: 4000, revenue: 24000000 },
    { name: "Ebook Trading", sales: 3000, revenue: 13980000 },
    { name: "Coaching 1:1", sales: 2000, revenue: 98000000 },
    { name: "Signal VIP", sales: 2780, revenue: 39080000 },
  ];

  const deviceData = [
    { name: "Desktop", value: 60 },
    { name: "Mobile", value: 35 },
    { name: "Tablet", value: 5 },
  ];

  const journeyData = [
    { step: "Vào web", users: 5200, conversion: 100 },
    { step: "Xem khóa học", users: 3600, conversion: 69 },
    { step: "Xem bot", users: 2400, conversion: 46 },
    { step: "Bấm mua", users: 1500, conversion: 29 },
    { step: "Vào thanh toán", users: 1100, conversion: 21 },
    { step: "Trả tiền", users: 780, conversion: 15 },
    { step: "Thuê bot", users: 720, conversion: 14 },
    { step: "Hủy mua bot", users: 120, conversion: 2 },
    { step: "Xem bài viết", users: 1900, conversion: 37 },
  ];

  const journeyStepConversion = journeyData.slice(1).map((step, index) => {
    const previous = journeyData[index];
    const rate = previous.users
      ? Math.round((step.users / previous.users) * 100)
      : 0;

    return {
      label: `${previous.step} → ${step.step}`,
      rate,
    };
  });

  const totalJourneyUsers = journeyData.reduce(
    (sum, item) => sum + item.users,
    0
  );

  const journeyShareData = journeyData.map((item) => ({
    step: item.step,
    share: totalJourneyUsers
      ? parseFloat(((item.users / totalJourneyUsers) * 100).toFixed(1))
      : 0,
  }));

  const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d"];

  // Table Columns
  const productColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Số lượng bán",
      dataIndex: "sales",
      key: "sales",
      sorter: (a: any, b: any) => a.sales - b.sales,
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (value: number) => `${value.toLocaleString()} đ`,
      sorter: (a: any, b: any) => a.revenue - b.revenue,
    },
    {
      title: "Hiệu suất",
      key: "performance",
      render: (_: any, record: any) => (
        <Progress
          percent={Math.round((record.sales / 5000) * 100)}
          size="small"
          status="active"
        />
      ),
    },
  ];

  // Components
  const UserHabits = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Card title="Hoạt động theo khung giờ" className="chart-card">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke="#1890ff"
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={8}>
        <Card title="Thiết bị sử dụng" className="chart-card">
          <div style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {deviceData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Tag icon={<DesktopOutlined />} color="blue">
                Desktop 60%
              </Tag>
              <Tag icon={<MobileOutlined />} color="green">
                Mobile 35%
              </Tag>
              <Tag icon={<TabletOutlined />} color="orange">
                Tablet 5%
              </Tag>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );

  const InterestAnalysis = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={14}>
        <Card title="Mức độ quan tâm khóa học" className="chart-card">
          <div style={{ height: 350 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={courseInterestData}
                margin={{ left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Bar
                  dataKey="interest"
                  fill="#1890ff"
                  radius={[0, 4, 4, 0]}
                  name="Điểm quan tâm"
                  barSize={20}
                />
                <Bar
                  dataKey="students"
                  fill="#52c41a"
                  radius={[0, 4, 4, 0]}
                  name="Học viên"
                  barSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </Col>
      <Col xs={24} lg={10}>
        <Card title="Top tìm kiếm & Nhu cầu" className="chart-card">
          <ul className="ranking-list">
            {[
              { name: "Cách đọc biểu đồ nến", count: 1250 },
              { name: "Quản lý vốn hiệu quả", count: 980 },
              { name: "Tâm lý giao dịch", count: 850 },
              { name: "Bot trade tự động", count: 720 },
              { name: "Tin tức thị trường hôm nay", count: 650 },
            ].map((item, index) => (
              <li key={index}>
                <div className={`rank-number top-${index + 1}`}>
                  {index + 1}
                </div>
                <div className="rank-info">
                  <span className="rank-name">{item.name}</span>
                  <span className="rank-desc">Từ khóa tìm kiếm</span>
                </div>
                <div className="rank-value">{item.count}</div>
              </li>
            ))}
          </ul>
        </Card>
      </Col>
    </Row>
  );

  const SalesAnalysis = () => (
    <Card title="Sản phẩm bán chạy nhất" className="chart-card">
      <Table
        columns={productColumns}
        dataSource={salesData}
        pagination={false}
        rowKey="name"
      />
    </Card>
  );

  const UserJourney = () => (
    <>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={14}>
          <Card title="Funnel hành trình người dùng" className="chart-card">
            <div
              style={{
                height: 500,
                display: "flex",
                justifyContent: "center",
                marginLeft: "-50px",
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart layout="vertical" data={journeyData}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="step" type="category" width={160} />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="users"
                    name="Người dùng"
                    fill="#1890ff"
                    radius={[0, 4, 4, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card title="Tỷ lệ chuyển đổi từng bước" className="chart-card">
            <div style={{ height: 240 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={journeyData} margin={{ left: -20, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="step" hide />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="conversion"
                    stroke="#52c41a"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    name="Tỷ lệ từ đầu funnel"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Table
              size="small"
              pagination={false}
              rowKey="step"
              dataSource={journeyData}
              columns={[
                {
                  title: "Bước",
                  dataIndex: "step",
                  key: "step",
                  width: "40%",
                },
                {
                  title: "Người dùng",
                  dataIndex: "users",
                  key: "users",
                  render: (v: number) => v.toLocaleString(),
                },
                {
                  title: "Tỷ lệ giữ lại",
                  dataIndex: "conversion",
                  key: "conversion",
                  render: (v: number) => `${v}%`,
                },
              ]}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="Tỷ lệ phân bổ người dùng theo bước"
            className="chart-card"
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={journeyShareData}
                    dataKey="share"
                    nameKey="step"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {journeyShareData.map((entry, index) => (
                      <Cell
                        key={`journey-share-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Tỷ lệ chuyển đổi giữa từng cặp bước"
            className="chart-card"
          >
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={journeyStepConversion}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis unit="%" />
                  <Tooltip />
                  <Bar
                    dataKey="rate"
                    name="Tỷ lệ qua bước tiếp theo"
                    fill="#faad14"
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
    </>
  );

  const items = [
    {
      key: "1",
      label: "Thói quen người dùng",
      children: <UserHabits />,
    },
    {
      key: "2",
      label: "Sở thích & Nhu cầu",
      children: <InterestAnalysis />,
    },
    {
      key: "3",
      label: "Hiệu quả kinh doanh",
      children: <SalesAnalysis />,
    },
    {
      key: "4",
      label: "Hành trình người dùng",
      children: <UserJourney />,
    },
  ];

  return (
    <div className="analytics-admin">
      <div className="header-title">Phân tích dữ liệu</div>

      {/* Quick Stats */}
      <Row gutter={24}>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-icon blue">
              <UserOutlined />
            </div>
            <div className="stat-info">
              <h3>1,205</h3>
              <p>Người dùng mới</p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-icon green">
              <RiseOutlined />
            </div>
            <div className="stat-info">
              <h3>15%</h3>
              <p>Tỷ lệ chuyển đổi</p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-icon orange">
              <ClockCircleOutlined />
            </div>
            <div className="stat-info">
              <h3>18m</h3>
              <p>Thời gian trung bình</p>
            </div>
          </div>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <div className="stat-card">
            <div className="stat-icon purple">
              <ShoppingCartOutlined />
            </div>
            <div className="stat-info">
              <h3>98%</h3>
              <p>Độ hài lòng</p>
            </div>
          </div>
        </Col>
      </Row>

      <Tabs defaultActiveKey="1" items={items} type="card" size="large" />
    </div>
  );
};

export default AnalyticsAdminComponent;
