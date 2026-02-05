import "./style.scss";
import { useState, useMemo, useRef, useEffect } from "react";
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
  Table,
  Popconfirm,
  Modal,
  Form,
  Divider,
  List,
  Typography,
  Radio,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  LinkOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
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
  Undo,
  Redo,
  FormatClear,
  Title as TitleIcon,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Highlight as HighlightIcon,
  Checklist,
} from "@mui/icons-material";

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
  content: string;
  level: Level;
  tags: string[];
  related?: string[];
  updatedAt?: string;
};

const TOPIC_OPTIONS = [
  { value: "METHODS", label: "Phương pháp" },
  { value: "PSYCHOLOGY", label: "Tâm lý" },
  { value: "RISK", label: "Quản lý rủi ro" },
  { value: "CANDLESTICKS", label: "Mô hình nến" },
  { value: "INDICATORS", label: "Chỉ báo" },
  { value: "SUPPORT", label: "Kiến thức bổ trợ" },
];

const LEVEL_OPTIONS = [
  { value: "BASIC", label: "Cơ bản" },
  { value: "ADVANCED", label: "Nâng cao" },
];
const TAG_OPTIONS = [
  { value: "Quan trọng", label: "Quan trọng" },
  { value: "Bắt buộc phải biết", label: "Bắt buộc phải biết" },
];
const STORAGE_KEY = "knowledge_articles";

// Initial Data
const INITIAL_ARTICLES: Article[] = [
  {
    id: "price-action",
    topic: "METHODS",
    title: "Price Action",
    summary:
      "Phương pháp đọc hành động giá để xác định xu hướng, vùng phản ứng ",
    content: "<p>Nội dung chi tiết về Price Action...</p>",
    level: "BASIC",
    tags: ["Quan trọng", "Bắt buộc phải biết"],
    related: ["Pin Bar", "Inside Bar"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "trend-following",
    topic: "METHODS",
    title: "Trend Following",
    summary: "Đi theo xu hướng chính, bỏ qua nhiễu nhỏ để tối ưu RR.",
    content: "<p>Nội dung chi tiết về Trend Following...</p>",
    level: "BASIC",
    tags: ["Quan trọng"],
    related: ["EMA", "MACD"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "fomo",
    topic: "PSYCHOLOGY",
    title: "FOMO",
    summary: "Nỗi sợ bỏ lỡ khiến vào lệnh không theo kế hoạch.",
    content: "<p>Nội dung chi tiết về FOMO...</p>",
    level: "BASIC",
    tags: ["Dễ sai"],
    related: ["Checklist vào lệnh", "Nhật ký cảm xúc"],
    updatedAt: new Date().toISOString(),
  },
];

const KnowledgeComponentAdmin = () => {
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return INITIAL_ARTICLES;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });
  const [search, setSearch] = useState("");
  const [topicFilter, setTopicFilter] = useState<TopicKey | "ALL">("ALL");
  const [levelFilter, setLevelFilter] = useState<Level | "ALL">("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formContent, setFormContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Sync to localStorage whenever articles change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
    } catch {}
  }, [articles]);
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
      Placeholder.configure({ placeholder: "Nhập nội dung bài viết..." }),
    ],
    content: formContent,
    onUpdate({ editor }) {
      setFormContent(editor.getHTML());
    },
  });

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const bySearch =
        search.trim() === ""
          ? true
          : [a.title, a.summary]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase());
      const byTopic = topicFilter === "ALL" ? true : a.topic === topicFilter;
      const byLevel = levelFilter === "ALL" ? true : a.level === levelFilter;
      return bySearch && byTopic && byLevel;
    });
  }, [articles, search, topicFilter, levelFilter]);

  const handleCreate = () => {
    setModalMode("create");
    setEditingId(null);
    form.resetFields();
    setFormContent("");
    editor?.commands.clearContent();
    // Set default empty values for dynamic fields
    form.setFieldsValue({
      tags: ["Quan trọng", "Bắt buộc phải biết"],
      checklist: [],
      related: [],
      quiz: [],
      topic: "METHODS",
      level: "BASIC",
    });
    setModalOpen(true);
  };

  const handleEdit = (record: Article) => {
    setModalMode("edit");
    setEditingId(record.id);
    form.setFieldsValue({
      ...record,
    });
    setFormContent(record.content || "");
    editor?.commands.setContent(record.content || "");
    setModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const now = new Date().toISOString();

      const articleData = {
        ...values,
        content: formContent,
        updatedAt: now,
      };

      if (modalMode === "create") {
        const newArticle: Article = {
          ...articleData,
          id: values.id || values.title.toLowerCase().replace(/\s+/g, "-"), // Simple ID generation
        };
        setArticles((prev) => [newArticle, ...prev]);
      } else {
        setArticles((prev) =>
          prev.map((a) => (a.id === editingId ? { ...a, ...articleData } : a)),
        );
      }
      setModalOpen(false);
    } catch (e) {
      console.error("Validate Failed:", e);
    }
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = String(reader.result || "");
      if (src) editor?.chain().focus().setImage({ src }).run();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

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

  const columns = [
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => <span style={{ fontWeight: 600 }}>{text}</span>,
    },
    {
      title: "Chủ đề",
      dataIndex: "topic",
      key: "topic",
      render: (t: TopicKey) => {
        const found = TOPIC_OPTIONS.find((o) => o.value === t);
        return <Tag color="blue">{found ? found.label : t}</Tag>;
      },
    },
    {
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      render: (l: Level) => (
        <Tag color={l === "BASIC" ? "green" : "gold"}>
          {l === "BASIC" ? "Cơ bản" : "Nâng cao"}
        </Tag>
      ),
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tags",
      render: (tags: string[]) => (
        <>
          {tags?.slice(0, 3).map((t) => (
            <Tag key={t}>{t}</Tag>
          ))}
          {tags?.length > 3 && <Tag>+{tags.length - 3}...</Tag>}
        </>
      ),
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY HH:mm") : "-"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, record: Article) => (
        <Space>
          <Button
            icon={<EditOutlined style={{ color: "#faad14", fontSize: 14 }} />}
            onClick={() => handleEdit(record)}
            type="text"
            className="btn-edit"
          />
          <Popconfirm
            title="Xóa bài viết"
            description="Bạn có chắc muốn xóa bài này?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              danger
              icon={
                <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 14 }} />
              }
              type="text"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="knowledge-admin">
      <div className="page-header">
        <h1>Quản Lý Thư Viện Kiến Thức</h1>
        <p>Tạo, chỉnh sửa và quản lý các bài viết kiến thức trading.</p>
      </div>

      <Card className="kl-toolbar">
        <Space wrap>
          <Input
            placeholder="Tìm kiếm tiêu đề, tóm tắt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: 280 }}
          />
          <Select
            value={topicFilter}
            onChange={setTopicFilter}
            options={[
              { value: "ALL", label: "Tất cả chủ đề" },
              ...TOPIC_OPTIONS,
            ]}
            style={{ width: 180 }}
          />
          <Select
            value={levelFilter}
            onChange={setLevelFilter}
            options={[
              { value: "ALL", label: "Tất cả cấp độ" },
              ...LEVEL_OPTIONS,
            ]}
            style={{ width: 160 }}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Thêm bài
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            {filtered.length === 0 ? (
              <Empty description="Không tìm thấy bài viết" />
            ) : (
              <Table
                rowKey="id"
                dataSource={filtered}
                columns={columns}
                pagination={{ pageSize: 8 }}
              />
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        title={
          modalMode === "create" ? "Thêm bài viết mới" : "Chỉnh sửa bài viết"
        }
        width={900}
        onOk={handleSave}
        maskClosable={true}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="Tiêu đề"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input placeholder="Nhập tiêu đề bài viết" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="id"
                label="ID (Slug)"
                tooltip="Tự động tạo nếu để trống"
              >
                <Input placeholder="ví-dụ-id-bai-viet" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="topic" label="Chủ đề" initialValue="METHODS">
                <Select options={TOPIC_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="level" label="Cấp độ" initialValue="BASIC">
                <Select options={LEVEL_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Nội dung chi tiết">
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
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                      }
                      isActive={editor.isActive("heading", { level: 1 })}
                      title="Tiêu đề 1"
                    >
                      <TitleIcon fontSize="small" /> 1
                    </ToolbarButton>
                    <ToolbarButton
                      onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                      }
                      isActive={editor.isActive("heading", { level: 2 })}
                      title="Tiêu đề 2"
                    >
                      <TitleIcon fontSize="small" /> 2
                    </ToolbarButton>
                    <div className="toolbar-divider" />
                    <ToolbarButton
                      onClick={() => editor.chain().focus().toggleBold().run()}
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
                      onClick={() => editor.chain().focus().toggleCode().run()}
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
                      onClick={triggerImageUpload}
                      title="Chèn ảnh từ file"
                    >
                      <PictureOutlined style={{ fontSize: 14 }} />
                    </ToolbarButton>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={onFileChange}
                      style={{ display: "none" }}
                    />
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
                      <LinkOutlined style={{ fontSize: 14 }} />
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
                      onClick={() => editor.chain().focus().toggleBold().run()}
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
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
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
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
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
          </Form.Item>

          <Form.Item name="tags" label="Tags (Thẻ)">
            <Select
              mode="tags"
              placeholder="Nhập tag rồi nhấn Enter"
              options={TAG_OPTIONS}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default KnowledgeComponentAdmin;
