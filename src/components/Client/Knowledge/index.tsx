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
import { useEffect } from "react";
import { getAllKnowledgeAPI } from "../../../api/knowledge";

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
  content?: string;
  level: Level;
  tags: string[];
  quiz?: {
    q: string;
    options: string[];
    answer: number;
  }[];
};

// Không dùng dữ liệu giả; dữ liệu sẽ được nạp từ API

const TOPIC_TABS: { key: TopicKey; label: string }[] = [
  { key: "METHODS", label: "Phương pháp" },
  { key: "PSYCHOLOGY", label: "Tâm lý" },
  { key: "RISK", label: "Quản lý rủi ro" },
  { key: "CANDLESTICKS", label: "Mô hình nến" },
  { key: "INDICATORS", label: "Chỉ báo" },
  { key: "SUPPORT", label: "Kiến thức bổ trợ" },
];

const KnowledgeComponent = () => {
  const [data, setData] = useState<Article[]>([]);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicKey>("METHODS");
  const [level, setLevel] = useState<Level | "ALL">("ALL");
  const [tags, setTags] = useState<string[]>([]);
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizArticle, setQuizArticle] = useState<Article | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRemote = async () => {
      try {
        const res = await getAllKnowledgeAPI();
        if (res.err === 0 && Array.isArray(res.data)) {
          const mapped: Article[] = res.data.map((item: any) => ({
            id: String(
              item.id ||
                item.slug ||
                item.title?.toLowerCase()?.replace(/\s+/g, "-"),
            ),
            topic: item.topic || "METHODS",
            title: String(item.title || ""),
            summary: String(item.summary || ""),
            content: String(item.content || ""),
            level: item.level || "BASIC",
            tags: Array.isArray(item.tags)
              ? item.tags
              : typeof item.tags === "string"
                ? [item.tags]
                : [],
          }));
          setData(mapped);
        } else {
          setData([]);
        }
      } catch {}
    };
    fetchRemote();
  }, []);

  const filtered = useMemo(() => {
    return data.filter((a) => {
      if (a.topic !== topic) return false;
      if (level !== "ALL" && a.level !== level) return false;
      if (tags.length && !tags.every((t) => a.tags.includes(t))) return false;
      if (query && !a.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
  }, [query, topic, level, tags, data]);

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
          <Col xs={24} md={12} lg={6} xl={6} xxl={6} key={a.id}>
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
              <Paragraph className="kl-summary" style={{ minHeight: 70 }}>
                {a.summary.split(" ").length > 30
                  ? a.summary.split(" ").slice(0, 30).join(" ") + "..."
                  : a.summary}
              </Paragraph>
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

              <Space
                style={{
                  marginTop: 30,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {a.quiz && (
                  <Button onClick={() => startQuiz(a)}>Kiểm tra nhanh</Button>
                )}
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
