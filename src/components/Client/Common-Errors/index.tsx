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

type Severity = "low" | "medium" | "high";
type Category = "PSYCHOLOGY" | "TECHNICAL" | "RISK" | "PROCESS";

type CommonError = {
  id: string;
  category: Category;
  name: string;
  desc: string[];
  rootCauses: string[];
  consequence: string[];
  signs: string[];
  fix: {
    checklist: string[];
    rules: string[];
    habits: string[];
  };
  links?: string[];
  tags: string[];
  severity: Severity;
  examples: {
    loss: { title: string; desc: string }[];
  };
};

const ERRORS: CommonError[] = [
  {
    id: "fomo-top",
    category: "PSYCHOLOGY",
    name: "FOMO đu đỉnh",
    desc: ["Vào lệnh muộn khi giá đã chạy mạnh", "Không có điểm vào hợp lệ"],
    rootCauses: ["Tâm lý sợ lỡ cơ hội", "Thiếu checklist", "Kỳ vọng sai"],
    consequence: ["Thua lỗ không cần thiết", "Mất kỷ luật"],
    signs: ["Nhảy vào khi giá tăng dựng đứng", "Bỏ qua điều kiện vào lệnh"],
    fix: {
      checklist: ["Chỉ vào khi đủ setup", "Giới hạn số lệnh/ngày"],
      rules: ["Không vào sau nến động lượng lớn", "Tuân thủ RR tối thiểu"],
      habits: ["Ghi nhật ký cảm xúc", "Ôn lại checklist trước khi trade"],
    },
    links: ["Checklist vào lệnh", "Tâm lý giao dịch nền tảng"],
    tags: ["Nguy hiểm", "Rất hay mắc", "Cần tránh"],
    severity: "high",
    examples: {
      loss: [
        {
          title: "Mua sau nến tăng mạnh",
          desc: "Giá đảo chiều ngay sau đó, vi phạm checklist, RR không đảm bảo.",
        },
      ],
    },
  },
  {
    id: "revenge-trade",
    category: "PSYCHOLOGY",
    name: "Revenge Trade",
    desc: ["Tăng lot để gỡ lỗ", "Vào lệnh liên tục sau chuỗi thua"],
    rootCauses: ["Cảm xúc tiêu cực", "Thiếu kế hoạch gỡ lỗ", "Thiếu giới hạn"],
    consequence: ["Cháy tài khoản", "Mất tự tin"],
    signs: ["Phá SL", "Tăng lot vô tội vạ"],
    fix: {
      checklist: ["Dừng giao dịch sau 3 lệnh thua", "Giảm khối lượng lệnh"],
      rules: ["Giới hạn rủi ro ngày", "Không trade khi cảm xúc mạnh"],
      habits: ["Review tuần/tháng", "Thiền/đi bộ ngắn trước khi trade"],
    },
    links: ["Nhật ký giao dịch", "Module tâm lý nâng cao"],
    tags: ["Nguy hiểm", "Cần tránh"],
    severity: "high",
    examples: {
      loss: [
        {
          title: "Vào lệnh gỡ sau lệnh thua",
          desc: "Tăng lot và phá SL, drawdown tăng nhanh, vi phạm quy tắc.",
        },
      ],
    },
  },
  {
    id: "wrong-trend",
    category: "TECHNICAL",
    name: "Vào sai xu hướng",
    desc: ["Trade ngược xu hướng mạnh", "Không xác nhận cấu trúc"],
    rootCauses: [
      "Thiếu kiến thức cấu trúc thị trường",
      "Đánh giá bối cảnh sai",
    ],
    consequence: ["Tỷ lệ thua cao", "RR kém"],
    signs: ["Bắt đỉnh/đáy", "Không có Higher High/Lower Low rõ ràng"],
    fix: {
      checklist: ["Xác định xu hướng khung lớn", "Chỉ trade theo hướng trend"],
      rules: ["RR tối thiểu 1:2", "Không vào lệnh giữa vùng"],
      habits: ["Backtest theo trend", "Đánh dấu vùng S/R trước phiên"],
    },
    links: ["Market Structure", "Trend Following"],
    tags: ["Rất hay mắc"],
    severity: "medium",
    examples: {
      loss: [
        {
          title: "Bán trong xu hướng tăng mạnh",
          desc: "Không có tín hiệu đảo chiều tại vị trí hợp lệ, bị quét SL.",
        },
      ],
    },
  },
  {
    id: "no-rr",
    category: "RISK",
    name: "Không tính RR",
    desc: ["Vào lệnh mà không xác định RR", "SL/TP đặt cảm tính"],
    rootCauses: ["Thiếu kỷ luật", "Thiếu kiến thức quản lý vốn"],
    consequence: ["Kết quả dài hạn kém", "Drawdown lớn"],
    signs: ["Không đặt SL", "RR < 1:1 lặp lại"],
    fix: {
      checklist: ["Chỉ vào lệnh RR ≥ 1:2", "Luôn đặt SL"],
      rules: ["Giới hạn 0.5–2%/lệnh", "Tính khối lượng theo SL"],
      habits: ["Journal rủi ro", "Review lệnh theo RR"],
    },
    links: ["RR", "Position sizing", "Drawdown"],
    tags: ["Cần tránh", "Quan trọng"],
    severity: "high",
    examples: {
      loss: [
        {
          title: "Vào lệnh không SL",
          desc: "Giá đi ngược, không có điểm thoát, tổn thất lớn.",
        },
      ],
    },
  },
  {
    id: "no-journal",
    category: "PROCESS",
    name: "Không journal / review",
    desc: ["Không ghi chép", "Không review tuần/tháng"],
    rootCauses: ["Thiếu quy trình", "Không coi trọng dữ liệu cá nhân"],
    consequence: ["Không tiến bộ", "Lặp lại sai lầm"],
    signs: ["Không nhớ lý do vào lệnh", "Không biết lỗi thường gặp"],
    fix: {
      checklist: ["Journal sau mỗi lệnh", "Review hàng tuần/tháng"],
      rules: ["Gắn chiến lược với journal", "Checklist trước phiên"],
      habits: ["Tạo thói quen review cuối tuần", "Ghi lại cảm xúc"],
    },
    links: ["Nhật ký giao dịch", "Checklist vào lệnh", "Lộ trình học"],
    tags: ["Rất hay mắc"],
    severity: "medium",
    examples: {
      loss: [
        {
          title: "Trade không có plan",
          desc: "Không có checklist, không journal, lỗi lặp lại không được phát hiện.",
        },
      ],
    },
  },
];

const CATEGORY_TABS: { key: Category; label: string }[] = [
  { key: "PSYCHOLOGY", label: "Lỗi tâm lý" },
  { key: "TECHNICAL", label: "Lỗi kỹ thuật" },
  { key: "RISK", label: "Lỗi quản lý vốn" },
  { key: "PROCESS", label: "Lỗi quy trình" },
];

const CommonErrorsComponent = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category>("PSYCHOLOGY");

  const filtered = useMemo(
    () => ERRORS.filter((e) => e.category === category),
    [category],
  );

  const severityColor = (s: Severity) =>
    s === "high" ? "red" : s === "medium" ? "gold" : "green";

  return (
    <div className="common-errors">
      <div className="common-errors__intro">
        <Title level={2}>Thư Viện Lỗi Thường Gặp</Title>
        <Paragraph>
          Kho tổng hợp sai lầm phổ biến của trader giúp nhận diện lỗi bản thân,
          tránh lặp lại và hiểu nguyên nhân thua lỗ. Đây là thư viện “chống cháy
          tài khoản”.
        </Paragraph>
      </div>

      <Tabs
        activeKey={category}
        onChange={(k) => setCategory(k as Category)}
        items={CATEGORY_TABS.map((t) => ({ key: t.key, label: t.label }))}
      />

      <Row gutter={[24, 24]}>
        {filtered.map((e) => (
          <Col xs={24} lg={12} key={e.id}>
            <Card
              className="ce-card"
              title={e.name}
              extra={
                <Space>
                  <Tag color={severityColor(e.severity)}>
                    {e.severity === "high"
                      ? "Cao"
                      : e.severity === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                  </Tag>
                  {e.tags.map((t) => (
                    <Tag key={t}>{t}</Tag>
                  ))}
                </Space>
              }
            >
              <Space direction="vertical" size={12} style={{ width: "100%" }}>
                <div className="ce-section">
                  <strong>Mô tả lỗi</strong>
                  <ul>
                    {e.desc.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="ce-section">
                  <strong>Nguyên nhân gốc</strong>
                  <ul>
                    {e.rootCauses.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="ce-section">
                  <strong>Hậu quả</strong>
                  <ul>
                    {e.consequence.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="ce-section">
                  <strong>Dấu hiệu nhận biết</strong>
                  <ul>
                    {e.signs.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>

                <div className="ce-section">
                  <strong>Cách khắc phục thực tế</strong>
                  <div className="ce-sub">
                    <Text>Checklist: {e.fix.checklist.join(" • ")}</Text>
                  </div>
                  <div className="ce-sub">
                    <Text>Quy tắc: {e.fix.rules.join(" • ")}</Text>
                  </div>
                  <div className="ce-sub">
                    <Text>Thói quen: {e.fix.habits.join(" • ")}</Text>
                  </div>
                </div>

                <Row gutter={[16, 16]}>
                  <Col xs={24}>
                    <Card size="small" title="Ví dụ lệnh thua (ẩn PnL)">
                      <Space
                        direction="vertical"
                        size={8}
                        style={{ width: "100%" }}
                      >
                        {e.examples.loss.map((ex, i) => (
                          <div key={i} className="ce-example">
                            <Text strong>{ex.title}</Text>
                            <Paragraph>{ex.desc}</Paragraph>
                          </div>
                        ))}
                      </Space>
                    </Card>
                  </Col>
                </Row>

                {e.links && (
                  <div className="ce-section">
                    <strong>Liên kết học tập</strong>
                    <Paragraph>{e.links.join(" • ")}</Paragraph>
                  </div>
                )}

                <div className="ce-actions">
                  <Space>
                    <Button onClick={() => navigate("/study")}>
                      Nhật ký & Phát hiện lỗi
                    </Button>
                    <Button onClick={() => navigate("/library/learning-path")}>
                      Gợi ý học lại phần yếu
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => navigate("/library/knowledge")}
                    >
                      Mở Thư viện kiến thức
                    </Button>
                  </Space>
                </div>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      {filtered.length === 0 && (
        <Card className="ce-empty">
          <Empty description="Chưa cập nhật" />
        </Card>
      )}
    </div>
  );
};

export default CommonErrorsComponent;
