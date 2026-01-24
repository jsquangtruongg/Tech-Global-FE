import "./style.scss";
import { useMemo, useState } from "react";
import {
  Card,
  Input,
  Select,
  Tabs,
  Row,
  Col,
  Tag,
  Space,
  Button,
  Modal,
  Radio,
  Typography,
  Empty,
} from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

type Level = "BASIC" | "ADVANCED";
type TopicKey =
  | "METHODS"
  | "PSYCHOLOGY"
  | "RISK"
  | "CANDLESTICKS"
  | "INDICATORS"
  | "SUPPORT";

type Article = {
  id: string;
  topic: TopicKey;
  title: string;
  summary: string;
  level: Level;
  tags: string[];
  checklist?: string[];
  related?: string[];
  quiz?: {
    q: string;
    options: string[];
    answer: number;
  }[];
};

const ARTICLES: Article[] = [
  {
    id: "price-action",
    topic: "METHODS",
    title: "Price Action",
    summary:
      "Phương pháp đọc hành động giá để xác định xu hướng, vùng phản ứng và xác suất vào lệnh.",
    level: "BASIC",
    tags: ["Quan trọng", "Bắt buộc phải biết"],
    checklist: ["Xác định xu hướng", "Kiểm tra vùng S/R", "Tìm tín hiệu nến"],
    related: ["Pin Bar", "Inside Bar"],
    quiz: [
      {
        q: "Price Action là gì?",
        options: ["Chỉ báo", "Hành động giá"],
        answer: 1,
      },
      {
        q: "Cần kết hợp gì?",
        options: ["S/R", "Khối lượng", "Cả hai"],
        answer: 2,
      },
      {
        q: "Nên dùng khi?",
        options: ["Thị trường có xu hướng", "Luôn luôn"],
        answer: 0,
      },
    ],
  },
  {
    id: "trend-following",
    topic: "METHODS",
    title: "Trend Following",
    summary: "Đi theo xu hướng chính, bỏ qua nhiễu nhỏ để tối ưu RR.",
    level: "BASIC",
    tags: ["Quan trọng"],
    checklist: [
      "Xác định Higher High/Lower Low",
      "Đi theo hướng trend",
      "Không bắt đỉnh/đáy",
    ],
    related: ["EMA", "MACD"],
    quiz: [
      {
        q: "Dấu hiệu có xu hướng?",
        options: ["Higher High/Low", "Doji liên tục"],
        answer: 0,
      },
      { q: "Nên làm gì?", options: ["Bắt đỉnh", "Đi theo trend"], answer: 1 },
      {
        q: "Khi nào không nên dùng?",
        options: ["Sideway mạnh", "Có trend rõ"],
        answer: 0,
      },
    ],
  },
  {
    id: "fomo",
    topic: "PSYCHOLOGY",
    title: "FOMO",
    summary: "Nỗi sợ bỏ lỡ khiến vào lệnh không theo kế hoạch.",
    level: "BASIC",
    tags: ["Dễ sai"],
    checklist: [
      "Chờ tín hiệu đủ điều kiện",
      "Tuân thủ checklist",
      "Giới hạn số lệnh/ngày",
    ],
    related: ["Checklist vào lệnh", "Nhật ký cảm xúc"],
    quiz: [
      {
        q: "FOMO thường dẫn tới?",
        options: ["Kỷ luật tốt", "Vào lệnh sai"],
        answer: 1,
      },
      {
        q: "Khắc phục?",
        options: ["Không có kế hoạch", "Theo checklist"],
        answer: 1,
      },
      {
        q: "Dấu hiệu?",
        options: ["Đợi setup đầy đủ", "Sợ bỏ lỡ nhảy vào"],
        answer: 1,
      },
    ],
  },
  {
    id: "risk-per-trade",
    topic: "RISK",
    title: "Risk % mỗi lệnh",
    summary: "Xác định tỷ lệ rủi ro cố định cho mỗi giao dịch.",
    level: "BASIC",
    tags: ["Quan trọng"],
    checklist: [
      "Giới hạn 0.5–2%/lệnh",
      "Đặt SL mọi lệnh",
      "Tính RR trước khi vào",
    ],
    related: ["RR", "Drawdown"],
    quiz: [
      {
        q: "Risk per trade là?",
        options: ["Tỷ lệ lời", "Tỷ lệ lỗ tối đa"],
        answer: 1,
      },
      { q: "Nên đặt SL?", options: ["Không cần", "Luôn cần"], answer: 1 },
      { q: "Tối ưu?", options: ["All-in", "Giới hạn % cố định"], answer: 1 },
    ],
  },
  {
    id: "pin-bar",
    topic: "CANDLESTICKS",
    title: "Pin Bar",
    summary: "Nến bóng dài cho thấy sự từ chối giá mạnh ở vùng S/R.",
    level: "BASIC",
    tags: ["Quan trọng"],
    checklist: ["Xuất hiện ở vùng S/R", "Bóng dài rõ rệt", "Xác nhận thêm"],
    related: ["Supply/Demand", "Price Action"],
    quiz: [
      {
        q: "Pin Bar hợp lệ khi?",
        options: ["Giữa vùng", "Tại S/R rõ"],
        answer: 1,
      },
      { q: "Ý nghĩa?", options: ["Do dự", "Từ chối giá"], answer: 1 },
      { q: "Cần gì?", options: ["Xác nhận thêm", "Không cần"], answer: 0 },
    ],
  },
  {
    id: "ema",
    topic: "INDICATORS",
    title: "EMA",
    summary:
      "Đường trung bình động nhấn mạnh giá gần đây, hỗ trợ xác định xu hướng.",
    level: "BASIC",
    tags: ["Quan trọng"],
    checklist: [
      "Kết hợp Price Action",
      "Không dùng độc lập",
      "Thông số phổ biến 20/50/200",
    ],
    related: ["Trend Following", "MACD"],
    quiz: [
      {
        q: "EMA dùng để?",
        options: ["Xác định xu hướng", "Đo khối lượng"],
        answer: 0,
      },
      { q: "Dùng độc lập?", options: ["Nên", "Không nên"], answer: 1 },
      { q: "Thông số phổ biến?", options: ["20/50/200", "5/7/9"], answer: 0 },
    ],
  },
];

const TOPIC_TABS: { key: TopicKey; label: string }[] = [
  { key: "METHODS", label: "Phương pháp" },
  { key: "PSYCHOLOGY", label: "Tâm lý" },
  { key: "RISK", label: "Quản lý rủi ro" },
  { key: "CANDLESTICKS", label: "Mô hình nến" },
  { key: "INDICATORS", label: "Chỉ báo" },
  { key: "SUPPORT", label: "Kiến thức bổ trợ" },
];

const KnowledgeComponent = () => {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicKey>("METHODS");
  const [level, setLevel] = useState<Level | "ALL">("ALL");
  const [tags, setTags] = useState<string[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizArticle, setQuizArticle] = useState<Article | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return ARTICLES.filter((a) => {
      if (a.topic !== topic) return false;
      if (level !== "ALL" && a.level !== level) return false;
      if (tags.length && !tags.every((t) => a.tags.includes(t))) return false;
      if (query && !a.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [query, topic, level, tags]);

  const startQuiz = (article: Article) => {
    setQuizArticle(article);
    setAnswers(Array(article.quiz?.length || 0).fill(-1));
    setQuizOpen(true);
  };

  const quizPassed = () => {
    if (!quizArticle?.quiz) return false;
    return quizArticle.quiz.every((q, i) => answers[i] === q.answer);
  };
  const handlerClickNavigateToDetail = (id: string) => {
    navigate(`/library/knowledge-detail/${id}`);
  };
  return (
    <div className="knowledge">
      <div className="knowledge__header">
        <Title level={2}>Thư Viện Kiến Thức Trading</Title>
        <Paragraph>Tra cứu nhanh – hiểu bản chất – áp dụng đúng.</Paragraph>
        <Space wrap>
          <Input.Search
            placeholder="Tìm theo tiêu đề"
            onSearch={(v) => setQuery(v)}
            allowClear
            style={{ width: 280 }}
          />
          <Select
            value={level}
            onChange={(v) => setLevel(v)}
            options={[
              { value: "ALL", label: "Tất cả mức độ" },
              { value: "BASIC", label: "Cơ bản" },
              { value: "ADVANCED", label: "Nâng cao" },
            ]}
            style={{ width: 180 }}
          />
          <Select
            mode="multiple"
            value={tags}
            onChange={setTags}
            placeholder="Lọc theo tag"
            options={[
              { value: "Dễ sai", label: "Dễ sai" },
              { value: "Quan trọng", label: "Quan trọng" },
              { value: "Bắt buộc phải biết", label: "Bắt buộc phải biết" },
            ]}
            style={{ minWidth: 220 }}
          />
        </Space>
      </div>

      <Tabs
        activeKey={topic}
        onChange={(k) => setTopic(k as TopicKey)}
        items={TOPIC_TABS.map((t) => ({ key: t.key, label: t.label }))}
      />

      <Row gutter={[24, 24]}>
        {filtered.map((a) => (
          <Col xs={24} md={12} lg={8} key={a.id}>
            <Card
              className="kl-article"
              title={a.title}
              extra={
                <Space>
                  <Tag color={a.level === "BASIC" ? "green" : "gold"}>
                    {a.level === "BASIC" ? "Cơ bản" : "Nâng cao"}
                  </Tag>
                </Space>
              }
            >
              <Paragraph className="kl-summary">{a.summary}</Paragraph>
              <div className="kl-tags">
                {a.tags.map((t) => (
                  <Tag
                    key={t}
                    color={
                      t === "Quan trọng"
                        ? "blue"
                        : t === "Bắt buộc phải biết"
                          ? "red"
                          : "orange"
                    }
                  >
                    {t}
                  </Tag>
                ))}
              </div>
              <Space direction="vertical" size={8} style={{ width: "100%" }}>
                {a.checklist && (
                  <div className="kl-section">
                    <strong>Nên làm:</strong>
                    <ul>
                      {a.checklist.map((c) => (
                        <li key={c}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {a.related && (
                  <div className="kl-section">
                    <strong>Liên kết:</strong> {a.related.join(" • ")}
                  </div>
                )}
              </Space>
              <Space
                style={{
                  marginTop: 30,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Button onClick={() => startQuiz(a)}>Kiểm tra nhanh</Button>
                <Button
                  type="primary"
                  onClick={() => handlerClickNavigateToDetail(a.id)}
                >
                  Xem chi tiết
                </Button>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
      {filtered.length === 0 && (
        <Card className="kl-empty">
          <Empty description="Chưa cập nhật" />
        </Card>
      )} 
      <Modal
        title={`Kiểm tra nhanh: ${quizArticle?.title || ""}`}
        open={quizOpen}
        onCancel={() => setQuizOpen(false)}
        footer={
          <Space>
            <Button onClick={() => setQuizOpen(false)}>Đóng</Button>
            <Button
              type="primary"
              disabled={!quizPassed()}
              onClick={() => setQuizOpen(false)}
            >
              Đã hiểu
            </Button>
          </Space>
        }
      >
        <Space direction="vertical" style={{ width: "100%" }} size={16}>
          {quizArticle?.quiz?.map((q, idx) => (
            <div key={idx}>
              <Paragraph strong>{q.q}</Paragraph>
              <Radio.Group
                value={answers[idx]}
                onChange={(e) =>
                  setAnswers((prev) => {
                    const copy = [...prev];
                    copy[idx] = e.target.value;
                    return copy;
                  })
                }
              >
                {q.options.map((op, i) => (
                  <Radio value={i} key={i}>
                    {op}
                  </Radio>
                ))}
              </Radio.Group>
            </div>
          ))}
        </Space>
      </Modal>
    </div>
  );
};

export default KnowledgeComponent;
