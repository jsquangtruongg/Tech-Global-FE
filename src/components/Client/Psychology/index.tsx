import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Row,
  Col,
  Space,
  Tag,
  Select,
  Input,
  Button,
  Empty,
  Tabs,
  Progress,
  App as AntdApp,
  Popconfirm,
} from "antd";
import dayjs from "dayjs";
import {
  getPsychologiesAPI,
  getSavedPsychologyAPI,
  addSavedPsychologyAPI,
  deleteSavedPsychologyAPI,
  getPsychologyDetailAPI,
} from "../../../api/psychology";

type EmotionType = "positive" | "negative" | "neutral";
type Frequency = "common" | "rare";
type Impact = "low" | "medium" | "high";

type Article = {
  id: number;
  title: string;
  type: EmotionType;
  frequency: Frequency;
  impact: Impact;
  description: string;
  content: string;
  updatedAt?: string;
};

const typeTag = (t: EmotionType) =>
  t === "positive" ? (
    <Tag color="green">Tích cực</Tag>
  ) : t === "negative" ? (
    <Tag color="red">Tiêu cực</Tag>
  ) : (
    <Tag color="blue">Trung lập</Tag>
  );

const freqTag = (f: Frequency) =>
  f === "common" ? <Tag color="gold">Thường gặp</Tag> : <Tag>Hiếm</Tag>;

const impactPercent = (i: Impact) =>
  i === "low" ? 33 : i === "medium" ? 66 : 90;

const PsychologyComponent = () => {
  const navigate = useNavigate();
  const { notification: apiNotification } = AntdApp.useApp();
  const [typeFilter, setTypeFilter] = useState<EmotionType | "all">("all");
  const [freqFilter, setFreqFilter] = useState<Frequency | "all">("all");
  const [impactFilter, setImpactFilter] = useState<Impact | "all">("all");
  const [search, setSearch] = useState("");

  const [articles, setArticles] = useState<Article[]>([]);
  type SavedItem = Article & { savedAt: string; savedId: number };
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [savedSearch, setSavedSearch] = useState("");
  const [savedTypeFilter, setSavedTypeFilter] = useState<EmotionType | "all">(
    "all",
  );
  const [savedFreqFilter, setSavedFreqFilter] = useState<Frequency | "all">(
    "all",
  );
  const [savedImpactFilter, setSavedImpactFilter] = useState<Impact | "all">(
    "all",
  );
  const isSaved = (id: number) => saved.some((s) => s.id === id);
  const addToSaved = async (a: Article) => {
    if (isSaved(a.id)) return;
    try {
      const res = await addSavedPsychologyAPI(a.id);
      if (res?.err === 0) {
        apiNotification.success({
          message: "Đã thêm vào sưu tầm thành công",
          placement: "topRight",
        });
        await refreshSaved();
      } else {
        apiNotification.info({
          message: "Bài viết đã có trong sưu tầm của bạn",
          placement: "topRight",
        });
        await refreshSaved();
      }
    } catch {}
  };
  const removeSaved = async (savedId: number) => {
    try {
      await deleteSavedPsychologyAPI(savedId);
      await refreshSaved();
    } catch {}
  };
  const refreshSaved = async () => {
    try {
      const res = await getSavedPsychologyAPI({ limit: 200 });
      if (res?.data && Array.isArray(res.data)) {
        const mappedBase: SavedItem[] = res.data.map((item: any) => {
          const p = item.article || item.psychology || item;
          const title = p?.title ?? p?.name ?? item?.title ?? item?.name ?? "";
          const articleId =
            item.article?.id || item.psychology?.id || item.psychology_id;
          return {
            id: Number(articleId),
            title: String(title || "Không có tiêu đề"),
            type: p.type,
            frequency: p.frequency,
            impact: p.impact,
            description: String(p.description || ""),
            content: String(p.content || ""),
            updatedAt: p.updatedAt || p.updated_at || new Date().toISOString(),
            savedAt:
              item.savedAt ||
              item.createdAt ||
              item.created_at ||
              new Date().toISOString(),
            savedId: Number(item.id ?? item.savedId ?? item.saved_id ?? 0),
          };
        });
        const filled: SavedItem[] = await Promise.all(
          mappedBase.map(async (it) => {
            if (it.title && it.title !== "Không có tiêu đề" && it.description)
              return it;
            try {
              const detail = await getPsychologyDetailAPI(it.id);
              const p = detail?.data || {};
              const title =
                it.title && it.title !== "Không có tiêu đề"
                  ? it.title
                  : String(p.title || p.name || "");
              const description = it.description || String(p.description || "");
              const content = it.content || String(p.content || "");
              return {
                ...it,
                title: title || it.title,
                description,
                content,
              };
            } catch {
              return it;
            }
          }),
        );
        setSaved(filled);
      }
    } catch {}
  };
  useEffect(() => {
    refreshSaved();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await getPsychologiesAPI({
          q: search || undefined,
          type: typeFilter !== "all" ? typeFilter : undefined,
          impact: impactFilter !== "all" ? impactFilter : undefined,
          frequency: freqFilter !== "all" ? freqFilter : undefined,
          limit: 100,
        });
        if (res?.data) {
          const mapped: Article[] = res.data.map((item: any) => ({
            id: Number(item.id),
            title: item.title,
            type: item.type,
            frequency: item.frequency,
            impact: item.impact,
            description: item.description || "",
            content: item.content || "",
            updatedAt:
              item.updatedAt || item.updated_at || new Date().toISOString(),
          }));
          setArticles(mapped);
        }
      } catch (e) {}
    };
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, impactFilter, freqFilter, search]);

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const byType = typeFilter === "all" ? true : a.type === typeFilter;
      const byFreq = freqFilter === "all" ? true : a.frequency === freqFilter;
      const byImpact =
        impactFilter === "all" ? true : a.impact === impactFilter;
      const bySearch =
        search.trim() === ""
          ? true
          : [a.title, a.description, a.content]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase());
      return byType && byFreq && byImpact && bySearch;
    });
  }, [articles, typeFilter, freqFilter, impactFilter, search]);

  const LibraryView = (
    <div className="ps-library">
      <div className="page-header">
        <h1>Quản Lý Cảm Xúc Giao Dịch</h1>
        <p>
          Nhận diện – ghi nhận – kiểm soát cảm xúc khi giao dịch. Biến cảm xúc
          thành dữ liệu có thể theo dõi để hạn chế các hành vi sai lệch.
        </p>
      </div>

      <Card className="ps-toolbar">
        <Space wrap>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "positive", label: "Tích cực" },
              { value: "negative", label: "Tiêu cực" },
              { value: "neutral", label: "Trung lập" },
            ]}
            style={{ width: 160 }}
            placeholder="Loại cảm xúc"
          />
          <Select
            value={freqFilter}
            onChange={setFreqFilter}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "common", label: "Thường gặp" },
              { value: "rare", label: "Hiếm" },
            ]}
            style={{ width: 160 }}
            placeholder="Tần suất"
          />
          <Select
            value={impactFilter}
            onChange={setImpactFilter}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "low", label: "Ảnh hưởng thấp" },
              { value: "medium", label: "Ảnh hưởng trung bình" },
              { value: "high", label: "Ảnh hưởng cao" },
            ]}
            style={{ width: 200 }}
            placeholder="Mức độ ảnh hưởng"
          />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm cảm xúc"
            style={{ width: 240 }}
          />
          <Button disabled>Thêm cảm xúc mới</Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {filteredArticles.map((a) => (
          <Col xs={24} md={12} lg={6} xl={6} key={a.id}>
            <Card className="emotion-card" hoverable>
              <div className="emotion-header">
                <div className="emotion-title">
                  <h3>{a.title}</h3>
                  <Space size={6}>
                    {typeTag(a.type)}
                    {freqTag(a.frequency)}
                  </Space>
                </div>
              </div>

              <div className="emotion-impact">
                <span>Mức độ ảnh hưởng</span>
                <Progress
                  percent={impactPercent(a.impact)}
                  size="small"
                  status={
                    a.impact === "high"
                      ? "exception"
                      : a.impact === "medium"
                        ? "active"
                        : "normal"
                  }
                />
              </div>

              <p className="emotion-desc">{a.description}</p>

              <div className="ps-actions">
                <Space>
                  <Button
                    onClick={() => addToSaved(a)}
                    disabled={isSaved(a.id)}
                  >
                    Thêm Sưu tầm
                  </Button>
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate(`/library/psychology-detail/${a.id}`)
                    }
                  >
                    Đọc thêm
                  </Button>
                </Space>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredArticles.length === 0 && (
        <Card className="ps-empty">
          <Empty description="Chưa cập nhật" />
        </Card>
      )}
    </div>
  );

  const savedFiltered = useMemo(() => {
    return saved.filter((a) => {
      const byType =
        savedTypeFilter === "all" ? true : a.type === savedTypeFilter;
      const byFreq =
        savedFreqFilter === "all" ? true : a.frequency === savedFreqFilter;
      const byImpact =
        savedImpactFilter === "all" ? true : a.impact === savedImpactFilter;
      const bySearch =
        savedSearch.trim() === ""
          ? true
          : [a.title, a.description, a.content]
              .join(" ")
              .toLowerCase()
              .includes(savedSearch.toLowerCase());
      return byType && byFreq && byImpact && bySearch;
    });
  }, [saved, savedTypeFilter, savedFreqFilter, savedImpactFilter, savedSearch]);

  const PsychologyView = (
    <div className="ps-collection">
      <div className="page-header">
        <h1>Sưu tầm tâm lý</h1>
        <p>Lưu bài viết hay từ thư viện để xem lại khi cần.</p>
      </div>
      <Card className="ps-toolbar">
        <Space wrap>
          <Select
            value={savedTypeFilter}
            onChange={setSavedTypeFilter}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "positive", label: "Tích cực" },
              { value: "negative", label: "Tiêu cực" },
              { value: "neutral", label: "Trung lập" },
            ]}
            style={{ width: 160 }}
            placeholder="Loại cảm xúc"
          />
          <Select
            value={savedFreqFilter}
            onChange={setSavedFreqFilter}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "common", label: "Thường gặp" },
              { value: "rare", label: "Hiếm" },
            ]}
            style={{ width: 160 }}
            placeholder="Tần suất"
          />
          <Select
            value={savedImpactFilter}
            onChange={setSavedImpactFilter}
            options={[
              { value: "all", label: "Tất cả" },
              { value: "low", label: "Ảnh hưởng thấp" },
              { value: "medium", label: "Ảnh hưởng trung bình" },
              { value: "high", label: "Ảnh hưởng cao" },
            ]}
            style={{ width: 200 }}
            placeholder="Mức độ ảnh hưởng"
          />
          <Input
            value={savedSearch}
            onChange={(e) => setSavedSearch(e.target.value)}
            placeholder="Tìm kiếm trong sưu tầm"
            style={{ width: 240 }}
          />
        </Space>
      </Card>
      {savedFiltered.length === 0 ? (
        <Card className="ps-empty">
          <Empty description="Chưa có bài sưu tầm" />
        </Card>
      ) : (
        <Row gutter={[16, 16]}>
          {savedFiltered.map((a) => (
            <Col xs={24} md={12} lg={8} key={`${a.id}-${a.savedAt}`}>
              <Card hoverable>
                <Space style={{ marginBottom: 8 }} size={8}>
                  {typeTag(a.type)}
                  {freqTag(a.frequency)}
                  <Tag>{dayjs(a.savedAt).format("DD/MM/YYYY HH:mm")}</Tag>
                </Space>
                <h3 style={{ marginBottom: 6 }}>
                  {a.title || a.description || "Không có tiêu đề"}
                </h3>
                <p className="emotion-desc">
                  {a.description ||
                    (a.content
                      ? a.content.replace(/<[^>]+>/g, "").slice(0, 140)
                      : "")}
                </p>
                <Space>
                  <Button
                    type="primary"
                    onClick={() =>
                      navigate(`/library/psychology-detail/${a.id}`)
                    }
                  >
                    Xem
                  </Button>
                  <Popconfirm
                    title="Xóa khỏi sưu tầm?"
                    onConfirm={() => removeSaved(a.savedId)}
                  >
                    <Button danger>Xóa</Button>
                  </Popconfirm>
                </Space>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );

  return (
    <div className="psychology">
      <Tabs
        defaultActiveKey="library"
        items={[
          { key: "library", label: "Thư viện cảm xúc", children: LibraryView },
          {
            key: "settings",
            label: "Sưu tầm tâm lý",
            children: PsychologyView,
          },
        ]}
      />
    </div>
  );
};
export default PsychologyComponent;
