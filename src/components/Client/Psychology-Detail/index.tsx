import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Space, Tag, Button, Empty, Typography, Divider } from "antd";
import { getPsychologyDetailAPI } from "../../../api/psychology";

type EmotionType = "positive" | "negative" | "neutral";
type Frequency = "common" | "rare";
type Impact = "low" | "medium" | "high";

type Article = {
  id: number;
  title: string;
  type: EmotionType;
  frequency: Frequency;
  impact: Impact;
  description?: string;
  content: string;
  updatedAt?: string;
};

const { Title, Paragraph, Text } = Typography;

const DETAILS: Article[] = [];

const typeTag = (t: EmotionType) =>
  t === "positive" ? (
    <Tag color="green">Tích cực</Tag>
  ) : t === "negative" ? (
    <Tag color="red">Tiêu cực</Tag>
  ) : (
    <Tag color="blue">Trung lập</Tag>
  );

const PsychologyDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      const numId = Number(id);
      if (Number.isNaN(numId)) return;
      setLoading(true);
      try {
        const res = await getPsychologyDetailAPI(numId);
        if (res.err === 0 && res.data) {
          const d = res.data;
          setArticle({
            id: Number(d.id),
            title: d.title,
            type: d.type,
            frequency: d.frequency,
            impact: d.impact,
            description: d.description || "",
            content: d.content || "",
            updatedAt: d.updatedAt || d.updated_at,
          });
        }
      } catch (e) {
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="psychology-detail">
        <Card className="pd-card empty">
          <Empty description="Đang tải dữ liệu..." />
          <Button type="primary" onClick={() => navigate("/library/psychology")}>
            Quay lại Thư viện cảm xúc
          </Button>
        </Card>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="psychology-detail">
        <Card className="pd-card empty">
          <Empty description="Chưa cập nhật" />
          <Button
            type="primary"
            onClick={() => navigate("/library/psychology")}
          >
            Quay lại Thư viện cảm xúc
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="psychology-detail">
      <Card className="pd-card">
        <div className="pd-header">
          <Title level={2}>{article.title}</Title>
          <Space>{typeTag(article.type)}</Space>
        </div>

        {article.description && (
          <Paragraph className="pd-summary">{article.description}</Paragraph>
        )}

        <Divider />
        <div
          className="pd-section"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        <div className="pd-actions">
          <Space>
            <Button onClick={() => navigate("/study")}>
              Ghi nhật ký cảm xúc
            </Button>
            <Button onClick={() => navigate("/library/checklist")}>
              Thêm vào Checklist
            </Button>
            <Button
              type="primary"
              onClick={() => navigate("/library/psychology")}
            >
              Quay lại Thư viện cảm xúc
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};
export default PsychologyDetailComponent;
