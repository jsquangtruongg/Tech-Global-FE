import "./style.scss";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Typography, Tag, Space, Button, Empty, Skeleton } from "antd";
import {
  getCommonErrorDetailAPI,
  type ICommonError,
  type Severity,
} from "../../../api/common-errors";

const { Title } = Typography;

const CommonErrorsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState<ICommonError | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getCommonErrorDetailAPI(id);
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

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "default";
    }
  };

  const getSeverityLabel = (sev: Severity) => {
    switch (sev) {
      case "high":
        return "Nghiêm trọng";
      case "medium":
        return "Trung bình";
      case "low":
        return "Thấp";
      default:
        return sev;
    }
  };

  if (loading) {
    return (
      <div className="common-errors-detail">
        <Card className="ced-card">
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="common-errors-detail">
        <Card className="ced-card empty">
          <Empty description="Không tìm thấy lỗi hoặc chưa cập nhật" />
          <Button
            type="primary"
            onClick={() => navigate("/library/common-errors")}
          >
            Quay lại Thư viện Lỗi
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="common-errors-detail">
      <Card className="ced-card">
        <div className="ced-header">
          <Title level={2}>{detail.name}</Title>
          <Space>
            <Tag color={getSeverityColor(detail.severity)}>
              {getSeverityLabel(detail.severity)}
            </Tag>
            {Array.isArray(detail.tags) &&
              detail.tags.map((t: string) => (
                <Tag key={t} color="blue">
                  {t}
                </Tag>
              ))}
          </Space>
        </div>

        {/* Render HTML Content from API */}
        {detail.content && (
          <div
            className="ced-content"
            dangerouslySetInnerHTML={{ __html: detail.content }}
          />
        )}

        <div className="ced-actions">
          <Space>
            <Button
              type="primary"
              onClick={() => navigate("/library/common-errors")}
            >
              Quay lại Danh sách
            </Button>
          </Space>
        </div>
      </Card>
    </div>
  );
};

export default CommonErrorsDetail;
