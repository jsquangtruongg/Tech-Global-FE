import "./style.scss";
import { useMemo, useState, useEffect } from "react";
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
  Input,
  Select,
  Spin,
} from "antd";
import { useNavigate } from "react-router-dom";
import {
  getAllCommonErrorsAPI,
  type ICommonError,
  type Severity,
} from "../../../api/common-errors";

const { Title, Paragraph } = Typography;

const CommonErrorsComponent = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [searchText, setSearchText] = useState("");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | "ALL">(
    "ALL",
  );
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const [errors, setErrors] = useState<ICommonError[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllCommonErrorsAPI();
        if (res.err === 0 && Array.isArray(res.data)) {
          setErrors(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch common errors:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const uniqueTags = useMemo(() => {
    const tags = new Set<string>();
    errors.forEach((err) => {
      if (Array.isArray(err.tags)) {
        err.tags.forEach((t) => tags.add(t));
      }
    });
    return Array.from(tags).map((t) => ({ value: t, label: t }));
  }, [errors]);

  const filteredErrors = useMemo(() => {
    return errors.filter((err) => {
      const matchTab = activeTab === "ALL" || err.category === activeTab;
      const matchSearch =
        searchText === "" ||
        err.name.toLowerCase().includes(searchText.toLowerCase()) ||
        err.tags?.some((t) =>
          t.toLowerCase().includes(searchText.toLowerCase()),
        );
      const matchSeverity =
        selectedSeverity === "ALL" || err.severity === selectedSeverity;
      const matchTags =
        selectedTags.length === 0 ||
        selectedTags.every((t) => err.tags?.includes(t));

      return matchTab && matchSearch && matchSeverity && matchTags;
    });
  }, [errors, activeTab, searchText, selectedSeverity, selectedTags]);

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

  const getSummary = (html: string) => {
    if (!html) return "Chưa có mô tả...";
    const text = html.replace(/<[^>]*>?/gm, "");
    return text.split(" ").length > 30
      ? text.split(" ").slice(0, 30).join(" ") + "..."
      : text;
  };

  return (
    <div className="common-errors">
      <div className="common-errors__header">
        <Title level={2}>Thư viện Lỗi Thường Gặp (Common Errors)</Title>
        <Paragraph>
          Tổng hợp các lỗi sai phổ biến trong Trading, nguyên nhân và cách khắc
          phục triệt để.
        </Paragraph>
        <Space wrap>
          <Input.Search
            placeholder="Tìm theo tiêu đề"
            onSearch={(v) => setSearchText(v)}
            allowClear
            style={{ width: 280 }}
          />
          <Select
            value={selectedSeverity}
            onChange={(v) => setSelectedSeverity(v)}
            options={[
              { value: "ALL", label: "Tất cả mức độ" },
              { value: "high", label: "Nghiêm trọng" },
              { value: "medium", label: "Trung bình" },
              { value: "low", label: "Thấp" },
            ]}
            style={{ width: 180 }}
          />
          <Select
            mode="multiple"
            value={selectedTags}
            onChange={setSelectedTags}
            placeholder="Lọc theo tag"
            options={uniqueTags}
            style={{ minWidth: 220 }}
          />
        </Space>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          { key: "ALL", label: "Tất cả" },
          { key: "PSYCHOLOGY", label: "Tâm lý" },
          { key: "TECHNICAL", label: "Kỹ thuật" },
          { key: "RISK", label: "Quản lý vốn" },
          { key: "PROCESS", label: "Quy trình" },
        ]}
        style={{ marginBottom: 24 }}
      />

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px 0" }}>
          <Spin size="large" />
        </div>
      ) : filteredErrors.length > 0 ? (
        <Row gutter={[24, 24]}>
          {filteredErrors.map((err) => (
            <Col xs={24} md={12} lg={6} xl={6} xxl={6} key={err.id}>
              <Card
                className="ce-article"
                title={err.name}
                extra={
                  <Tag color={getSeverityColor(err.severity)}>
                    {getSeverityLabel(err.severity)}
                  </Tag>
                }
              >
                <Paragraph className="ce-summary">
                  {getSummary(err.content)}
                </Paragraph>
                <div className="ce-tags">
                  {err.tags?.slice(0, 2).map((t, idx) => (
                    <Tag key={idx} color="blue">
                      {t}
                    </Tag>
                  ))}
                  {err.tags?.length > 2 && <Tag>...</Tag>}
                </div>
                <Button
                  type="primary"
                  onClick={() =>
                    navigate(`/library/common-errors-detail/${err.id}`)
                  }
                  style={{
                    backgroundColor: "#4aaf52",
                    borderColor: "#4aaf52",
                    width: "100%",
                    marginTop: "auto",
                  }}
                >
                  Xem chi tiết
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <div className="ce-empty">
          <Empty description="Không tìm thấy lỗi nào phù hợp" />
        </div>
      )}
    </div>
  );
};

export default CommonErrorsComponent;
