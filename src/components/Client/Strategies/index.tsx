import "./style.scss";
import { useMemo, useState } from "react";
import {
  Card,
  Tabs,
  Row,
  Col,
  Tag,
  Space,
  Typography,
  Button,
  Empty,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

type Category = "TREND" | "REVERSAL" | "BREAKOUT" | "INDICATOR" | "COMBINED";

type Strategy = {
  id: string;
  category: Category;
  name: string;
  style: "Scalping" | "Swing" | "Trend";
  market: string[];
  timeframe: string[];
  marketCond: string[];
  entry: string[];
  confirm: string[];
  checklist: string[];
  management: {
    sl: string;
    tp: string;
    rr: string;
    tsl?: string;
  };
  noTrade: string[];
  examples: {
    win: { title: string; desc: string }[];
    loss: { title: string; desc: string }[];
  };
  mistakes: string[];
};

const STRATEGIES: Strategy[] = [
  {
    id: "trend-ema20-pullback",
    category: "TREND",
    name: "Trend Pullback EMA20",
    style: "Trend",
    market: ["Forex", "Crypto", "Indices"],
    timeframe: ["M15", "H1"],
    marketCond: ["Có xu hướng rõ", "Biến động vừa phải"],
    entry: ["Giá hồi về EMA20", "Xuất hiện tín hiệu nến thuận xu hướng"],
    confirm: ["Cấu trúc Higher High/Higher Low hoặc Lower High/Lower Low"],
    checklist: [
      "Có xu hướng rõ trên khung lớn",
      "Hồi quy về vùng hỗ trợ/kháng cự động",
      "Tín hiệu xác nhận hợp lệ",
    ],
    management: {
      sl: "Sau đỉnh/đáy gần nhất hoặc sau tín hiệu nến",
      tp: "Theo mốc S/R tiếp theo hoặc RR",
      rr: "Tối thiểu 1:2",
      tsl: "Dời SL khi tạo đỉnh/đáy mới cùng xu hướng",
    },
    noTrade: ["Sideway mạnh", "Nhiễu cao, cắt EMA liên tục", "Tin mạnh sắp ra"],
    examples: {
      win: [
        {
          title: "Hồi về EMA20 trong xu hướng tăng",
          desc: "Nến xác nhận tăng tại EMA20, khớp checklist, RR đạt ≥ 1:2.",
        },
      ],
      loss: [
        {
          title: "Vào lệnh khi xu hướng yếu",
          desc: "Hồi sâu phá cấu trúc, tín hiệu yếu dẫn tới giảm xác suất.",
        },
      ],
    },
    mistakes: ["Bắt đỉnh/đáy", "Vào giữa vùng", "Dời SL cảm tính"],
  },
  {
    id: "breakout-sr",
    category: "BREAKOUT",
    name: "Breakout S/R",
    style: "Swing",
    market: ["Forex", "Indices"],
    timeframe: ["M30", "H1", "H4"],
    marketCond: ["Tích lũy gần mốc S/R quan trọng"],
    entry: ["Phá vỡ mốc S/R với volume/động lượng cao"],
    confirm: ["Retest nhẹ, giữ trên/dưới vùng phá vỡ"],
    checklist: [
      "Mốc S/R có ý nghĩa",
      "Có tích lũy/inside bar trước phá vỡ",
      "Nến phá vỡ mạnh",
    ],
    management: {
      sl: "Sau vùng tích lũy hoặc sau S/R vừa phá",
      tp: "Theo mốc S/R kế tiếp hoặc mục tiêu đo lường",
      rr: "Tối thiểu 1:2",
    },
    noTrade: ["Phá vỡ giả nhiều lần", "Thị trường nhiễu", "Tin mạnh"],
    examples: {
      win: [
        {
          title: "Phá kháng cự kèm retest giữ giá",
          desc: "Giá break mạnh, retest nhỏ, giữ trên kháng cự, đạt mục tiêu.",
        },
      ],
      loss: [
        {
          title: "Break giả",
          desc: "Break yếu, quay lại vùng tích lũy, vi phạm checklist.",
        },
      ],
    },
    mistakes: [
      "Vào lệnh giữa vùng",
      "Không xác nhận vị trí",
      "Dùng RR quá tham",
    ],
  },
];

const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: "TREND", label: "Theo xu hướng" },
  { key: "REVERSAL", label: "Đảo chiều" },
  { key: "BREAKOUT", label: "Phá vỡ" },
  { key: "INDICATOR", label: "Theo chỉ báo" },
  { key: "COMBINED", label: "Kết hợp" },
];

const StrategiesComponent = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("TREND");

  const filtered = useMemo(
    () => STRATEGIES.filter((s) => s.category === category),
    [category],
  );

  return (
    <div className="strategies">
      <div className="strategies__intro">
        <Title level={2}>Kho Chiến Lược Giao Dịch</Title>
        <Paragraph>
          Kho chiến lược lưu trữ các chiến lược đã được chuẩn hóa để giao dịch
          có hệ thống, biết khi nào dùng và khi nào không nên, áp dụng theo quy
          trình, không trade cảm tính.
        </Paragraph>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12}>
            <Card title="Thư viện kiến thức">
              <Space direction="vertical" size={8}>
                <Text>Giải thích khái niệm</Text>
                <Text>Học từng phần</Text>
                <Text>Ví dụ: RSI là gì</Text>
                <Button onClick={() => navigate("/library/knowledge")}>
                  Mở Thư viện
                </Button>
              </Space>
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card title="Kho chiến lược">
              <Space direction="vertical" size={8}>
                <Text>Hướng dẫn cách trade cụ thể</Text>
                <Text>Áp dụng toàn bộ quy trình</Text>
                <Text>Ví dụ: Chiến lược dùng RSI thế nào</Text>
              </Space>
            </Card>
          </Col>
        </Row>
      </div>

      <Tabs
        activeKey={category}
        onChange={(k) => setCategory(k as Category)}
        items={CATEGORY_TABS.map((t) => ({ key: t.key, label: t.label }))}
      />

      <Row gutter={[24, 24]}>
        {filtered.map((s) => (
          <Col xs={24} lg={12} key={s.id}>
            <Card
              className="strategy-card"
              title={s.name}
              extra={
                <Space>
                  <Tag color="blue">{s.style}</Tag>
                  <Tag color="green">{s.timeframe.join(" • ")}</Tag>
                </Space>
              }
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div className="st-section">
                  <strong>Tổng quan</strong>
                  <div className="st-inline">
                    <span>Thị trường: {s.market.join(" • ")}</span>
                    <span>Khung: {s.timeframe.join(" • ")}</span>
                  </div>
                </div>

                <div className="st-section">
                  <strong>Điều kiện thị trường</strong>
                  <ul>
                    {s.marketCond.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="st-section">
                  <strong>Điều kiện vào lệnh</strong>
                  <ul>
                    {s.entry.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                  <div className="st-sub">
                    <Text> Xác nhận: {s.confirm.join(" • ")}</Text>
                  </div>
                  <div className="st-sub">
                    <Text> Checklist: {s.checklist.join(" • ")}</Text>
                  </div>
                </div>

                <div className="st-section">
                  <strong>Quản lý lệnh</strong>
                  <ul>
                    <li>SL: {s.management.sl}</li>
                    <li>TP: {s.management.tp}</li>
                    <li>RR: {s.management.rr}</li>
                    {s.management.tsl && <li>Dời SL: {s.management.tsl}</li>}
                  </ul>
                </div>

                <div className="st-section">
                  <strong>Khi không nên trade</strong>
                  <ul>
                    {s.noTrade.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <Card size="small" title="Ví dụ lệnh thắng">
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        {s.examples.win.map((ex, i) => (
                          <div key={i} className="st-example">
                            <Text strong>{ex.title}</Text>
                            <Paragraph>{ex.desc}</Paragraph>
                          </div>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card size="small" title="Ví dụ lệnh thua">
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        {s.examples.loss.map((ex, i) => (
                          <div key={i} className="st-example">
                            <Text strong>{ex.title}</Text>
                            <Paragraph>{ex.desc}</Paragraph>
                          </div>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                </Row>

                <div className="st-section">
                  <strong>Lỗi thường gặp</strong>
                  <ul>
                    {s.mistakes.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>

                <div className="st-actions">
                  <Space>
                    <Button onClick={() => navigate("/study")}>
                      Backtest & Journal
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => navigate("/library/learning-path")}
                    >
                      Gắn vào Lộ trình
                    </Button>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <Card className="st-empty">
          <Empty description="Chưa cập nhật" />
        </Card>
      )}
    </div>
  );
};

export default StrategiesComponent;
