import "./style.scss";
import { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography, Tag, Row, Col, Space, Button, Empty } from "antd";
import { getKnowledgeDetailAPI } from "../../../api/knowledge";

const { Title, Paragraph, Text } = Typography;

type Level = "BASIC" | "ADVANCED";

type Article = {
  id: string;
  topic?: string;
  title: string;
  summary: string;
  level: Level;
  tags: string[];
  content?: string;
};

// Read articles from localStorage (saved by Admin Knowledge). Fallback to empty.
const STORAGE_KEY = "knowledge_articles";
const readArticlesFromStorage = (): Article[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const KnowledgeDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<Article | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!id) return;
      const res = await getKnowledgeDetailAPI(id);
      if (res.err === 0 && res.data) {
        const item = res.data;
        const mapped: Article = {
          id: String(item.id || id),
          topic: item.topic || "METHODS",
          title: String(item.title || ""),
          summary: String(item.summary || ""),
          level: item.level || "BASIC",
          tags: Array.isArray(item.tags)
            ? item.tags
            : typeof item.tags === "string"
              ? [item.tags]
              : [],
          content: String(item.content || ""),
        };
        setDetail(mapped);
      } else {
        const articles = readArticlesFromStorage();
        const local = articles.find((d) => d.id === id) || null;
        setDetail(local);
      }
    };
    load();
  }, [id]);

  if (!detail) {
    return (
      <div className="knowledge-detail">
        <Card className="kd-card empty">
          <Empty description="Chưa cập nhật" />
          <Button type="primary" onClick={() => navigate("/library/knowledge")}>
            Quay lại Thư viện
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="knowledge-detail">
      <Card className="kd-card">
        <div className="kd-header">
          <Title level={2}>{detail.title}</Title>
          <Space>
            <Tag color={detail.level === "BASIC" ? "green" : "gold"}>
              {detail.level === "BASIC" ? "Cơ bản" : "Nâng cao"}
            </Tag>
            {detail.tags.map((t) => (
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
          </Space>
        </div>
        <Paragraph className="kd-summary">{detail.summary}</Paragraph>
        <div className="kd-section">
          <Title level={4}>Nội dung</Title>
          <div
            className="kd-content"
            dangerouslySetInnerHTML={{ __html: detail.content || "" }}
          />
        </div>

        <div className="kd-actions">
          <Space>
            <Button onClick={() => navigate("/study")}>
              Backtest / Thực hành
            </Button>
            <Button disabled>Thêm vào Checklist (Chưa cập nhật)</Button>
            <Button
              type="primary"
              onClick={() => navigate("/library/knowledge")}
            >
              Quay lại Thư viện
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default KnowledgeDetailComponent;
