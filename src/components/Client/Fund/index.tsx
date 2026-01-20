import React, { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Tabs,
  Card,
  Collapse,
  Steps,
  Rate,
  Modal,
  Descriptions,
} from "antd";
import {
  CheckCircleOutlined,
  DollarOutlined,
  SafetyCertificateOutlined,
  TrophyOutlined,
  ReadOutlined,
} from "@ant-design/icons";
import "./style.scss";

const { Panel } = Collapse;
const { TabPane } = Tabs;

interface FundRegulation {
  maxDailyLoss: string;
  maxTotalLoss: string;
  profitTarget: string;
  minTradingDays: string;
  newsTrading: string;
  weekendHolding: string;
  leverage: string;
}

interface FundData {
  key: string;
  rank: number;
  name: string;
  logo: string;
  rating: number;
  minCapital: string;
  profitSplit: string;
  features: string[];
  link: string;
  regulations: FundRegulation;
}

const fundData: FundData[] = [
  {
    key: "1",
    rank: 1,
    name: "FTMO",
    logo: "https://ftmo.com/wp-content/themes/ftmo-com/public/images/logo-ftmo.svg",
    rating: 4.9,
    minCapital: "$10,000",
    profitSplit: "Up to 90%",
    features: ["Uy tín nhất", "Thanh toán nhanh", "Không giới hạn thời gian"],
    link: "https://ftmo.com/",
    regulations: {
      maxDailyLoss: "5% (hoặc $500 cho tk $10k)",
      maxTotalLoss: "10% (hoặc $1000 cho tk $10k)",
      profitTarget: "10% (Vòng 1) - 5% (Vòng 2)",
      minTradingDays: "4 ngày",
      newsTrading: "Bị hạn chế (trừ tk Swing)",
      weekendHolding: "Không (trừ tk Swing)",
      leverage: "1:100",
    },
  },
  {
    key: "2",
    rank: 2,
    name: "The5ers",
    logo: "https://the5ers.com/wp-content/uploads/2021/05/The5ers-logo-2021.png",
    rating: 4.8,
    minCapital: "$5,000",
    profitSplit: "Up to 100%",
    features: [
      "Tăng vốn nhanh",
      "Instant Funding",
      "Cho phép giữ lệnh qua tuần",
    ],
    link: "https://the5ers.com/",
    regulations: {
      maxDailyLoss: "5% (tính theo Balance/Equity)",
      maxTotalLoss: "6% - 10% (tùy chương trình)",
      profitTarget: "5% - 10%",
      minTradingDays: "Không yêu cầu",
      newsTrading: "Cho phép",
      weekendHolding: "Cho phép",
      leverage: "1:10 (Instant) - 1:100 (Bootcamp)",
    },
  },
  {
    key: "3",
    rank: 3,
    name: "Funding Pips",
    logo: "https://fundingpips.com/logo.png",
    rating: 4.7,
    minCapital: "$5,000",
    profitSplit: "Up to 90%",
    features: ["Phí rẻ nhất", "Thanh toán mỗi 5 ngày", "Rule đơn giản"],
    link: "https://fundingpips.com/",
    regulations: {
      maxDailyLoss: "5% (Equity + Commission)",
      maxTotalLoss: "10%",
      profitTarget: "8% (Vòng 1) - 5% (Vòng 2)",
      minTradingDays: "Không yêu cầu",
      newsTrading: "Cho phép (trừ 2 phút trước/sau tin)",
      weekendHolding: "Cho phép",
      leverage: "1:100",
    },
  },
  {
    key: "4",
    rank: 4,
    name: "Alpha Capital Group",
    logo: "https://alphacapitalgroup.uk/logo.png",
    rating: 4.6,
    minCapital: "$10,000",
    profitSplit: "80%",
    features: [
      "Miễn phí phí tham gia (hoàn lại)",
      "Dashboard xịn",
      "Spread thấp",
    ],
    link: "https://alphacapitalgroup.uk/",
    regulations: {
      maxDailyLoss: "5%",
      maxTotalLoss: "10%",
      profitTarget: "8% (Vòng 1) - 5% (Vòng 2)",
      minTradingDays: "Không yêu cầu",
      newsTrading: "Cho phép",
      weekendHolding: "Cho phép",
      leverage: "1:100",
    },
  },
  {
    key: "5",
    rank: 5,
    name: "MyFundedFX",
    logo: "https://myfundedfx.com/logo.png",
    rating: 4.5,
    minCapital: "$5,000",
    profitSplit: "Up to 80%",
    features: ["Không giới hạn ngày", "Hỗ trợ MT4/MT5", "Scaling Plan tốt"],
    link: "https://myfundedfx.com/",
    regulations: {
      maxDailyLoss: "5% (Balance based)",
      maxTotalLoss: "8%",
      profitTarget: "8% (Vòng 1) - 5% (Vòng 2)",
      minTradingDays: "1 ngày",
      newsTrading: "Cho phép",
      weekendHolding: "Cho phép",
      leverage: "1:100",
    },
  },
];

const FundComponent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFund, setSelectedFund] = useState<FundData | null>(null);

  const showRegulations = (fund: FundData) => {
    setSelectedFund(fund);
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Hạng",
      dataIndex: "rank",
      key: "rank",
      render: (rank: number) => (
        <div className={`rank-badge rank-${rank}`}>
          {rank <= 3 ? <TrophyOutlined /> : null} #{rank}
        </div>
      ),
      width: 80,
    },
    {
      title: "Tên Quỹ",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: FundData) => (
        <div className="fund-name-cell">
          {/* <img src={record.logo} alt={text} className="fund-logo" /> // Placeholder for now */}
          <div className="fund-info">
            <strong>{text}</strong>
            <Rate
              disabled
              defaultValue={record.rating}
              allowHalf
              style={{ fontSize: 12 }}
            />
          </div>
        </div>
      ),
    },
    {
      title: "Vốn Tối Thiểu",
      dataIndex: "minCapital",
      key: "minCapital",
    },
    {
      title: "Chia Sẻ Lợi Nhuận",
      dataIndex: "profitSplit",
      key: "profitSplit",
      render: (text: string) => <Tag color="green">{text}</Tag>,
    },
    {
      title: "Tính Năng Nổi Bật",
      dataIndex: "features",
      key: "features",
      render: (features: string[]) => (
        <>
          {features.map((feature) => (
            <Tag color="blue" key={feature}>
              {feature}
            </Tag>
          ))}
        </>
      ),
    },
    {
      title: "Hành Động",
      key: "action",
      render: (_: any, record: FundData) => (
        <div className="action-buttons">
          <Button
            type="primary"
            className="btn-register"
            href={record.link}
            target="_blank"
            size="middle"
          >
            Đăng Ký Ngay
          </Button>
          <Button
            className="btn-rules"
            icon={<ReadOutlined />}
            onClick={() => showRegulations(record)}
            size="middle"
          >
            Xem Quy Định
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="fund-page">
      {/* Hero Section */}
      <div className="fund-hero">
        <div className="fund-hero__content">
          <h1>Top Quỹ Giao Dịch (Prop Firms) Uy Tín 2025</h1>
          <p>
            Tổng hợp, đánh giá và xếp hạng các quỹ cấp vốn hàng đầu thế giới.
            Giúp bạn lựa chọn nơi khởi đầu sự nghiệp Trader chuyên nghiệp.
          </p>
          <div className="fund-hero__stats">
            <div className="stat-item">
              <SafetyCertificateOutlined />
              <span>Đã kiểm duyệt</span>
            </div>
            <div className="stat-item">
              <DollarOutlined />
              <span>Thanh toán uy tín</span>
            </div>
          </div>
        </div>
      </div>

      <div className="fund-container">
        <Tabs defaultActiveKey="1" type="card" size="large" centered>
          {/* Tab 1: Ranking */}
          <TabPane tab="Bảng Xếp Hạng" key="1">
            <Card className="ranking-card">
              <Table
                columns={columns}
                dataSource={fundData}
                pagination={false}
                rowClassName={(record) =>
                  record.rank <= 3 ? "highlight-row" : ""
                }
              />
            </Card>
          </TabPane>

          {/* Tab 2: Hướng Dẫn */}
          <TabPane tab="Hướng Dẫn Tham Gia" key="2">
            <Card title="Quy Trình Trở Thành Funded Trader">
              <Steps
                current={-1}
                direction="vertical"
                items={[
                  {
                    title: "Bước 1: Chọn Quỹ & Đăng Ký",
                    description:
                      "Lựa chọn quỹ phù hợp với phong cách giao dịch (Scalping, Swing) và ngân sách của bạn.",
                  },
                  {
                    title: "Bước 2: Trả Phí Thi (Challenge)",
                    description:
                      "Thanh toán phí tham gia thử thách. Mức phí thường từ $50 - $1000 tùy quy mô tài khoản.",
                  },
                  {
                    title: "Bước 3: Vượt Qua Vòng Đánh Giá",
                    description:
                      "Phase 1 & Phase 2: Đạt mục tiêu lợi nhuận (8-10%) và giữ mức lỗ trong giới hạn cho phép.",
                  },
                  {
                    title: "Bước 4: Xác Minh Danh Tính (KYC)",
                    description:
                      "Gửi giấy tờ tùy thân để xác minh tài khoản trước khi nhận tài khoản thực.",
                  },
                  {
                    title: "Bước 5: Nhận Tài Khoản Live & Rút Tiền",
                    description:
                      "Giao dịch trên tài khoản thực và nhận chia sẻ lợi nhuận (lên đến 90%).",
                  },
                ]}
              />
            </Card>
          </TabPane>

          {/* Tab 3: Kiến Thức & Quy Định */}
          <TabPane tab="Quy Định Chung" key="3">
            <div className="rules-section">
              <Collapse defaultActiveKey={["1"]}>
                <Panel
                  header="1. Drawdown (Mức sụt giảm tài khoản) là gì?"
                  key="1"
                >
                  <p>
                    <strong>Max Daily Drawdown:</strong> Mức lỗ tối đa cho phép
                    trong một ngày (thường là 5% vốn ban đầu hoặc vốn Equity đầu
                    ngày).
                    <br />
                    <strong>Max Total Drawdown:</strong> Mức lỗ tối đa cho phép
                    trên tổng tài khoản (thường là 10-12%).
                  </p>
                </Panel>
                <Panel
                  header="2. Quy tắc giao dịch tin tức (News Trading)"
                  key="2"
                >
                  <p>
                    Một số quỹ cấm giao dịch trước và sau tin tức mạnh
                    (Non-farm, CPI, FOMC) khoảng 2-5 phút. Tuy nhiên, các quỹ
                    như FTMO (tài khoản Swing) hoặc The5ers thường thoải mái
                    hơn.
                  </p>
                </Panel>
                <Panel header="3. Quy tắc giữ lệnh qua đêm/tuần" key="3">
                  <p>
                    Đa số các quỹ yêu cầu đóng lệnh trước khi thị trường đóng
                    cửa cuối tuần để tránh Gap giá. Tài khoản Swing thường được
                    phép giữ lệnh qua tuần.
                  </p>
                </Panel>
                <Panel header="4. Cấm sao chép lệnh (Copy Trading)" key="4">
                  <p>
                    Hầu hết các quỹ cấm bạn copy lệnh từ tài khoản người khác
                    hoặc sử dụng tín hiệu group chung. Bạn chỉ được copy từ tài
                    khoản cá nhân của chính mình.
                  </p>
                </Panel>
              </Collapse>
            </div>
          </TabPane>
        </Tabs>

        {/* FAQ Section */}
        <div className="fund-faq">
          <h3>Các câu hỏi thường gặp</h3>
          <div className="faq-grid">
            <Card title="Quỹ nào dễ pass nhất?" bordered={false}>
              Funding Pips và MyFundedFX hiện tại có rule khá dễ thở và không
              giới hạn thời gian thi.
            </Card>
            <Card title="Tôi có thể rút tiền bằng cách nào?" bordered={false}>
              Phổ biến nhất là qua Deel (Bank Transfer, Crypto, PayPal) hoặc rút
              trực tiếp về ví Crypto (USDT).
            </Card>
            <Card title="Nếu thi trượt có được thi lại không?" bordered={false}>
              Bạn phải trả phí để thi lại. Tuy nhiên, nếu bạn dương tài khoản
              nhưng chưa đạt target, một số quỹ cho phép thi lại miễn phí
              (Retry).
            </Card>
          </div>
        </div>
      </div>

      <Modal
        title={`Quy Định Giao Dịch - ${selectedFund?.name}`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>,
          <Button
            key="link"
            type="primary"
            href={selectedFund?.link}
            target="_blank"
          >
            Trang Chủ Quỹ
          </Button>,
        ]}
      >
        {selectedFund && (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Sụt giảm ngày (Daily Loss)">
              {selectedFund.regulations.maxDailyLoss}
            </Descriptions.Item>
            <Descriptions.Item label="Sụt giảm tổng (Max Loss)">
              {selectedFund.regulations.maxTotalLoss}
            </Descriptions.Item>
            <Descriptions.Item label="Mục tiêu lợi nhuận">
              {selectedFund.regulations.profitTarget}
            </Descriptions.Item>
            <Descriptions.Item label="Số ngày tối thiểu">
              {selectedFund.regulations.minTradingDays}
            </Descriptions.Item>
            <Descriptions.Item label="Giao dịch tin tức">
              {selectedFund.regulations.newsTrading}
            </Descriptions.Item>
            <Descriptions.Item label="Giữ lệnh qua tuần">
              {selectedFund.regulations.weekendHolding}
            </Descriptions.Item>
            <Descriptions.Item label="Đòn bẩy">
              {selectedFund.regulations.leverage}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default FundComponent;
