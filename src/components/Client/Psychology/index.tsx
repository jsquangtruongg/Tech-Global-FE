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
  DatePicker,
  Popconfirm,
  Modal,
  App as AntdApp,
} from "antd";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import { BubbleMenu as BubbleMenuExtension } from "@tiptap/extension-bubble-menu";
import { FloatingMenu as FloatingMenuExtension } from "@tiptap/extension-floating-menu";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  StrikethroughS,
  Code,
  FormatQuote,
  FormatListBulleted,
  FormatListNumbered,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  InsertLink,
  Image as ImageIcon,
  Undo,
  Redo,
  FormatClear,
  Title,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Highlight as HighlightIcon,
  Checklist,
  Add,
  Delete,
  Edit,
} from "@mui/icons-material";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";

import dayjs, { Dayjs } from "dayjs";
import {
  getPsychologiesAPI,
  getSavedPsychologyAPI,
  addSavedPsychologyAPI,
  deleteSavedPsychologyAPI,
  getPsychologyDetailAPI,
} from "../../../api/psychology";
import {
  getMyDiariesAPI,
  createMyDiaryAPI,
  deleteMyDiaryAPI,
} from "../../../api/my-diary";
import {
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  BarChart,
  Bar,
} from "recharts";

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

  type JournalEntry = {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    emotion?: EmotionType;
  };

  const [journalTitle, setJournalTitle] = useState("");
  const [journalContent, setJournalContent] = useState("");
  const [journalEmotion, setJournalEmotion] = useState<EmotionType | undefined>(
    undefined,
  );
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchJournal, setSearchJournal] = useState("");
  const [range, setRange] = useState<[Dayjs | null, Dayjs | null]>([
    null,
    null,
  ]);
  const [statsMode, setStatsMode] = useState<"week" | "month" | "year">("week");
  const [statsEmotionFilter, setStatsEmotionFilter] = useState<
    EmotionType | "all"
  >("all");
  const [viewing, setViewing] = useState<JournalEntry | null>(null);
  const handleViewJournal = (entry: JournalEntry) => setViewing(entry);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await getMyDiariesAPI({ limit: 200 });
        if (res?.data) {
          const mapped: JournalEntry[] = res.data.map((item: any) => ({
            id: Number(item.id),
            title: String(item.title),
            content: String(item.content || ""),
            createdAt:
              item.createdAt || item.created_at || new Date().toISOString(),
            emotion: item.emotion,
          }));
          setEntries(mapped);
        }
      } catch (e) {}
    };
    fetchEntries();
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      BubbleMenuExtension,
      FloatingMenuExtension,
      Underline,
      Link.configure({ openOnClick: true }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
      Highlight,
      TaskList,
      TaskItem.configure({ nested: true }),
      Placeholder.configure({ placeholder: "Viết nhật ký của bạn..." }),
    ],
    content: journalContent,
    onUpdate({ editor }) {
      setJournalContent(editor.getHTML());
    },
  });

  const ToolbarButton = ({
    onClick,
    isActive = false,
    children,
    title,
  }: {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    title?: string;
  }) => (
    <Button
      type={isActive ? "primary" : "text"}
      onClick={onClick}
      title={title}
      className={`toolbar-btn ${isActive ? "active" : ""}`}
    >
      {children}
    </Button>
  );

  const handleAddJournal = async () => {
    if (!journalTitle.trim() || !journalContent.trim()) return;
    try {
      const res = await createMyDiaryAPI({
        title: journalTitle.trim(),
        content: journalContent,
        emotion: journalEmotion,
      });
      const item = res?.data || null;
      if (item) {
        const newEntry: JournalEntry = {
          id: Number(item.id),
          title: String(item.title),
          content: String(item.content || ""),
          createdAt:
            item.createdAt || item.created_at || new Date().toISOString(),
          emotion: journalEmotion,
        };
        setEntries((prev) => [newEntry, ...prev]);
      }
    } catch (e) {}
    setJournalTitle("");
    setJournalContent("");
    editor?.commands.clearContent();
    setJournalEmotion(undefined);
  };

  const handleDeleteJournal = async (id: number) => {
    try {
      await deleteMyDiaryAPI(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {}
  };

  const filteredJournal = useMemo(() => {
    return entries.filter((e) => {
      const bySearch =
        searchJournal.trim() === ""
          ? true
          : [e.title, e.content]
              .join(" ")
              .toLowerCase()
              .includes(searchJournal.toLowerCase());
      const start = range[0] ? range[0].startOf("day") : null;
      const end = range[1] ? range[1].endOf("day") : null;
      const d = dayjs(e.createdAt);
      const byRange =
        !start && !end
          ? true
          : start && end
            ? d.isAfter(start) && d.isBefore(end)
            : start
              ? d.isAfter(start)
              : end
                ? d.isBefore(end)
                : true;
      return bySearch && byRange;
    });
  }, [entries, searchJournal, range]);

  const statsData = useMemo(() => {
    const baseEnd = range[1] ? range[1]! : dayjs();
    const source =
      statsEmotionFilter === "all"
        ? filteredJournal
        : filteredJournal.filter((e) => e.emotion === statsEmotionFilter);

    if (statsMode === "week") {
      const start = baseEnd.subtract(6, "day").startOf("day");
      const days: { date: string; count: number }[] = [];
      for (let i = 0; i < 7; i++) {
        const d = start.add(i, "day");
        const label = d.format("DD/MM");
        const count = source.filter((e) =>
          dayjs(e.createdAt).isSame(d, "day"),
        ).length;
        days.push({ date: label, count });
      }
      return days;
    }

    if (statsMode === "month") {
      const start = baseEnd.startOf("month");
      const totalDays = baseEnd.daysInMonth();
      const days: { date: string; count: number }[] = [];
      for (let i = 0; i < totalDays; i++) {
        const d = start.add(i, "day");
        const label = d.format("DD/MM");
        const count = source.filter((e) =>
          dayjs(e.createdAt).isSame(d, "day"),
        ).length;
        days.push({ date: label, count });
      }
      return days;
    }

    const start = baseEnd.startOf("year");
    const months: { date: string; count: number }[] = [];
    for (let i = 0; i < 12; i++) {
      const m = start.add(i, "month");
      const label = m.format("MM/YYYY");
      const count = source.filter((e) =>
        dayjs(e.createdAt).isSame(m, "month"),
      ).length;
      months.push({ date: label, count });
    }
    return months;
  }, [filteredJournal, range, statsMode, statsEmotionFilter]);

  const JournalView = (
    <div className="ps-journal">
      <div className="page-header">
        <h1>Nhật ký cảm xúc</h1>
        <p>Lưu lại cảm xúc mỗi khi vào lệnh để rút kinh nghiệm.</p>
      </div>

      <Card className="ps-toolbar">
        <Space wrap>
          <Input
            value={searchJournal}
            onChange={(e) => setSearchJournal(e.target.value)}
            placeholder="Tìm kiếm nhật ký"
            style={{ width: 240 }}
          />
          <DatePicker.RangePicker
            value={range}
            onChange={(v) => setRange(v as [Dayjs | null, Dayjs | null])}
          />
          <Select
            value={journalEmotion}
            onChange={setJournalEmotion}
            allowClear
            placeholder="Gắn loại cảm xúc"
            options={[
              { value: "positive", label: "Tích cực" },
              { value: "negative", label: "Tiêu cực" },
              { value: "neutral", label: "Trung lập" },
            ]}
            style={{ width: 180 }}
          />
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Viết nhật ký">
            <Space direction="vertical" size={12} style={{ width: "100%" }}>
              <Input
                value={journalTitle}
                onChange={(e) => setJournalTitle(e.target.value)}
                placeholder="Tiêu đề"
              />
              <Select
                value={journalEmotion}
                onChange={setJournalEmotion}
                allowClear
                placeholder="Chọn cảm xúc (Tích cực / Tiêu cực / Bình tĩnh)"
                options={[
                  { value: "positive", label: "Tích cực" },
                  { value: "negative", label: "Tiêu cực" },
                  { value: "neutral", label: "Bình tĩnh" },
                ]}
                style={{ width: 260 }}
              />
              <div className="tiptap-box">
                {editor && (
                  <div className="tiptap-toolbar">
                    <Space wrap size={2}>
                      <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        title="Hoàn tác"
                      >
                        <Undo fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        title="Làm lại"
                      >
                        <Redo fontSize="small" />
                      </ToolbarButton>
                      <div className="toolbar-divider" />
                      <ToolbarButton
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                        }
                        isActive={editor.isActive("heading", { level: 1 })}
                        title="Tiêu đề 1"
                      >
                        <Title fontSize="small" /> 1
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        isActive={editor.isActive("heading", { level: 2 })}
                        title="Tiêu đề 2"
                      >
                        <Title fontSize="small" /> 2
                      </ToolbarButton>
                      <div className="toolbar-divider" />
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleBold().run()
                        }
                        isActive={editor.isActive("bold")}
                        title="In đậm"
                      >
                        <FormatBold fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleItalic().run()
                        }
                        isActive={editor.isActive("italic")}
                        title="In nghiêng"
                      >
                        <FormatItalic fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleUnderline().run()
                        }
                        isActive={editor.isActive("underline")}
                        title="Gạch chân"
                      >
                        <FormatUnderlined fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleStrike().run()
                        }
                        isActive={editor.isActive("strike")}
                        title="Gạch ngang"
                      >
                        <StrikethroughS fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleHighlight().run()
                        }
                        isActive={editor.isActive("highlight")}
                        title="Tô màu"
                      >
                        <HighlightIcon fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleCode().run()
                        }
                        isActive={editor.isActive("code")}
                        title="Code"
                      >
                        <Code fontSize="small" />
                      </ToolbarButton>
                      <div className="toolbar-divider" />
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().setTextAlign("left").run()
                        }
                        isActive={editor.isActive({ textAlign: "left" })}
                        title="Căn trái"
                      >
                        <FormatAlignLeft fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().setTextAlign("center").run()
                        }
                        isActive={editor.isActive({ textAlign: "center" })}
                        title="Căn giữa"
                      >
                        <FormatAlignCenter fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().setTextAlign("right").run()
                        }
                        isActive={editor.isActive({ textAlign: "right" })}
                        title="Căn phải"
                      >
                        <FormatAlignRight fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().setTextAlign("justify").run()
                        }
                        isActive={editor.isActive({ textAlign: "justify" })}
                        title="Căn đều"
                      >
                        <FormatAlignJustify fontSize="small" />
                      </ToolbarButton>
                      <div className="toolbar-divider" />
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleBulletList().run()
                        }
                        isActive={editor.isActive("bulletList")}
                        title="Danh sách"
                      >
                        <FormatListBulleted fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleOrderedList().run()
                        }
                        isActive={editor.isActive("orderedList")}
                        title="Danh sách số"
                      >
                        <FormatListNumbered fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleTaskList().run()
                        }
                        isActive={editor.isActive("taskList")}
                        title="Checklist"
                      >
                        <Checklist fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleBlockquote().run()
                        }
                        isActive={editor.isActive("blockquote")}
                        title="Trích dẫn"
                      >
                        <FormatQuote fontSize="small" />
                      </ToolbarButton>
                      <div className="toolbar-divider" />
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleSubscript().run()
                        }
                        isActive={editor.isActive("subscript")}
                        title="Chỉ số dưới"
                      >
                        <SubscriptIcon fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().toggleSuperscript().run()
                        }
                        isActive={editor.isActive("superscript")}
                        title="Chỉ số trên"
                      >
                        <SuperscriptIcon fontSize="small" />
                      </ToolbarButton>
                      <div className="toolbar-divider" />
                      <ToolbarButton
                        onClick={() => {
                          const url = window.prompt("Nhập URL hình ảnh");
                          if (url)
                            editor.chain().focus().setImage({ src: url }).run();
                        }}
                        title="Chèn ảnh"
                      >
                        <ImageIcon fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() => {
                          const url = window.prompt("Nhập URL liên kết");
                          if (url)
                            editor
                              .chain()
                              .focus()
                              .setLink({ href: url, target: "_blank" })
                              .run();
                        }}
                        isActive={editor.isActive("link")}
                        title="Chèn link"
                      >
                        <InsertLink fontSize="small" />
                      </ToolbarButton>
                      <ToolbarButton
                        onClick={() =>
                          editor.chain().focus().unsetAllMarks().run()
                        }
                        title="Xóa định dạng"
                      >
                        <FormatClear fontSize="small" />
                      </ToolbarButton>
                    </Space>
                  </div>
                )}
                {editor && (
                  <BubbleMenu editor={editor} className="bubble-menu">
                    <Space size={2}>
                      <button
                        onClick={() =>
                          editor.chain().focus().toggleBold().run()
                        }
                        className={editor.isActive("bold") ? "is-active" : ""}
                      >
                        Bold
                      </button>
                      <button
                        onClick={() =>
                          editor.chain().focus().toggleItalic().run()
                        }
                        className={editor.isActive("italic") ? "is-active" : ""}
                      >
                        Italic
                      </button>
                      <button
                        onClick={() =>
                          editor.chain().focus().toggleStrike().run()
                        }
                        className={editor.isActive("strike") ? "is-active" : ""}
                      >
                        Strike
                      </button>
                    </Space>
                  </BubbleMenu>
                )}
                {editor && (
                  <FloatingMenu editor={editor} className="floating-menu">
                    <Space size={2}>
                      <button
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run()
                        }
                        className={
                          editor.isActive("heading", { level: 1 })
                            ? "is-active"
                            : ""
                        }
                      >
                        H1
                      </button>
                      <button
                        onClick={() =>
                          editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 2 })
                            .run()
                        }
                        className={
                          editor.isActive("heading", { level: 2 })
                            ? "is-active"
                            : ""
                        }
                      >
                        H2
                      </button>
                      <button
                        onClick={() =>
                          editor.chain().focus().toggleBulletList().run()
                        }
                        className={
                          editor.isActive("bulletList") ? "is-active" : ""
                        }
                      >
                        List
                      </button>
                    </Space>
                  </FloatingMenu>
                )}
                <EditorContent editor={editor} className="tiptap-editor" />
              </div>
              <div>
                <Space>
                  {journalEmotion && typeTag(journalEmotion)}
                  <Button type="primary" onClick={handleAddJournal}>
                    Lưu nhật ký
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="Thống kê"
            bordered={false}
            style={{ boxShadow: "none", outline: "none" }}
            extra={
              <Space>
                <Select
                  value={statsMode}
                  onChange={setStatsMode}
                  options={[
                    { value: "week", label: "Trong tuần" },
                    { value: "month", label: "Trong tháng" },
                    { value: "year", label: "Trong năm" },
                  ]}
                  style={{ width: 140 }}
                />
                <Select
                  value={statsEmotionFilter}
                  onChange={setStatsEmotionFilter}
                  options={[
                    { value: "all", label: "Tất cả cảm xúc" },
                    { value: "positive", label: "Tích cực" },
                    { value: "negative", label: "Tiêu cực" },
                    { value: "neutral", label: "Trung lập" },
                  ]}
                  style={{ width: 160 }}
                />
              </Space>
            }
          >
            {statsData.length === 0 ? (
              <Empty description="Chưa có dữ liệu" />
            ) : (
              <div style={{ width: "100%", height: 260, outline: "none" }}>
                <ResponsiveContainer>
                  <BarChart data={statsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4aaf52" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Nhật ký đã lưu" style={{ marginTop: 16 }}>
        {filteredJournal.length === 0 ? (
          <Empty description="Chưa có nhật ký" />
        ) : (
          <Row gutter={[16, 16]}>
            {filteredJournal.map((e) => (
              <Col xs={24} md={12} lg={8} key={e.id}>
                <Card hoverable>
                  <Space size={8} style={{ marginBottom: 8 }}>
                    <Tag>{dayjs(e.createdAt).format("DD/MM/YYYY HH:mm")}</Tag>
                    {e.emotion && typeTag(e.emotion)}
                  </Space>
                  <h3 style={{ margin: "0 0 8px 0", fontWeight: 600 }}>
                    {e.title}
                  </h3>
                  <div
                    style={{
                      maxHeight: 120,
                      overflow: "hidden",
                    }}
                    dangerouslySetInnerHTML={{ __html: e.content }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: 8,
                      borderTop: "1px solid #e8e8e8",
                    }}
                  >
                    <Space>
                      <Button
                        icon={<EyeOutlined />}
                        type="link"
                        onClick={() => handleViewJournal(e)}
                      >
                        Chi tiết
                      </Button>
                      <Popconfirm
                        title="Xóa nhật ký"
                        description="Bạn có chắc chắn muốn xóa nhật ký này không?"
                        onConfirm={() => handleDeleteJournal(e.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          title="Xóa nhật ký"
                        >
                          Xóa
                        </Button>
                      </Popconfirm>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      {viewing && (
        <Modal
          open
          onCancel={() => setViewing(null)}
          footer={null}
          width={800}
          title={viewing.title}
        >
          <Space size={8} style={{ marginBottom: 8 }}>
            <Tag>{dayjs(viewing.createdAt).format("DD/MM/YYYY HH:mm")}</Tag>
            {viewing.emotion && typeTag(viewing.emotion)}
          </Space>
          <div dangerouslySetInnerHTML={{ __html: viewing.content }} />
        </Modal>
      )}
    </div>
  );

  const StatsView = (
    <div className="ps-placeholder">
      <Card>
        <Empty description="Chưa cập nhật" />
      </Card>
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
