import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Typography,
  Tag,
  Row,
  Col,
  Space,
  Button,
  Empty,
  Skeleton,
} from "antd";
import { getKnowledgeDetailAPI } from "../../../api/knowledge";

const { Title, Paragraph, Text } = Typography;

const KnowledgeDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getKnowledgeDetailAPI(id);
        if (res.err === 0 && res.data) {
          setDetail(res.data);
        } else {
          setDetail(null);
        }
      } catch (error) {
        setDetail(null);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="knowledge-detail">
        <Card className="kd-card">
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="knowledge-detail">
        <Card className="kd-card empty">
          <Empty description="Không tìm thấy bài viết hoặc chưa cập nhật" />
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
            {Array.isArray(detail.tags) &&
              detail.tags.map((t: string) => (
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

        {/* Render HTML Content from API */}
        {detail.content && (
          <div
            className="kd-content"
            dangerouslySetInnerHTML={{ __html: detail.content }}
          />
        )}

        {/* Legacy structured data rendering (if available in future or mapped) */}
        {detail.purpose && (
          <div className="kd-section">
            <Title level={4}>Mục đích</Title>
            <Paragraph>{detail.purpose}</Paragraph>
          </div>
        )}

        {detail.quick && detail.quick.length > 0 && (
          <div className="kd-section">
            <Title level={4}>Tóm tắt nhanh</Title>
            <ul className="kd-list">
              {detail.quick.map((q: string) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </div>
        )}

        {(detail.shouldDo || detail.shouldNotDo) && (
          <Row gutter={[24, 24]}>
            {detail.shouldDo && (
              <Col xs={24} md={12}>
                <div className="kd-section">
                  <Title level={4}>Nên làm</Title>
                  <ul className="kd-list">
                    {detail.shouldDo.map((s: string) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            )}
            {detail.shouldNotDo && (
              <Col xs={24} md={12}>
                <div className="kd-section">
                  <Title level={4}>Không nên làm</Title>
                  <ul className="kd-list">
                    {detail.shouldNotDo.map((s: string) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              </Col>
            )}
          </Row>
        )}

        {(detail.trueExamples || detail.falseExamples) && (
          <div className="kd-section">
            <Title level={4}>Ví dụ thực tế</Title>
            <Row gutter={[24, 24]}>
              {detail.trueExamples && (
                <Col xs={24} md={12}>
                  <Card size="small" title="Ví dụ đúng">
                    {/* Image support if we add it later */}
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      {detail.trueExamples.map((ex: any, i: number) => (
                        <div key={i} className="kd-example">
                          <Text strong>{ex.title}</Text>
                          <Paragraph>{ex.desc}</Paragraph>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
              )}
              {detail.falseExamples && (
                <Col xs={24} md={12}>
                  <Card size="small" title="Ví dụ sai">
                    {/* Image support if we add it later */}
                    <Space
                      direction="vertical"
                      size={8}
                      style={{ width: "100%" }}
                    >
                      {detail.falseExamples.map((ex: any, i: number) => (
                        <div key={i} className="kd-example">
                          <Text strong>{ex.title}</Text>
                          <Paragraph>{ex.desc}</Paragraph>
                        </div>
                      ))}
                    </Space>
                  </Card>
                </Col>
              )}
            </Row>
          </div>
        )}

        {detail.related && Array.isArray(detail.related) && (
          <div className="kd-section">
            <Title level={4}>Liên kết</Title>
            <Paragraph>{detail.related.join(" • ")}</Paragraph>
          </div>
        )}

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
