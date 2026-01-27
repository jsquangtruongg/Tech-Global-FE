import "./style.scss";
import { useEffect, useMemo, useRef, useState } from "react";
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
} from "antd";
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
  Title,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Highlight as HighlightIcon,
  Checklist,
} from "@mui/icons-material";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  getPsychologiesAPI,
  createPsychologyAPI,
  updatePsychologyAPI,
  deletePsychologyAPI,
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
  updatedAt: string;
};

const typeTag = (t: EmotionType) =>
  t === "positive" ? (
    <Tag color="green">Tích cực</Tag>
  ) : t === "negative" ? (
    <Tag color="red">Tiêu cực</Tag>
  ) : (
    <Tag color="blue">Trung lập</Tag>
  );

const impactLabel = (i: Impact) =>
  i === "low" ? "Thấp" : i === "medium" ? "Trung bình" : "Cao";

const PsychologyAdminComponent = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<EmotionType | "all">("all");
  const [impactFilter, setImpactFilter] = useState<Impact | "all">("all");
  const [freqFilter, setFreqFilter] = useState<Frequency | "all">("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create",
  );
  const [current, setCurrent] = useState<Article | null>(null);
  const [formTitle, setFormTitle] = useState("");
  const [formType, setFormType] = useState<EmotionType>("neutral");
  const [formImpact, setFormImpact] = useState<Impact>("low");
  const [formFreq, setFormFreq] = useState<Frequency>("common");
  const [formDesc, setFormDesc] = useState("");
  const [formContent, setFormContent] = useState("");

  const [loading, setLoading] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
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
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter, impactFilter, freqFilter]);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      const bySearch =
        search.trim() === ""
          ? true
          : [a.title, a.description, a.content]
              .join(" ")
              .toLowerCase()
              .includes(search.toLowerCase());
      const byType = typeFilter === "all" ? true : a.type === typeFilter;
      const byImpact =
        impactFilter === "all" ? true : a.impact === impactFilter;
      const byFreq = freqFilter === "all" ? true : a.frequency === freqFilter;
      return bySearch && byType && byImpact && byFreq;
    });
  }, [articles, search, typeFilter, impactFilter, freqFilter]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    content: formContent,
    onUpdate({ editor }) {
      setFormContent(editor.getHTML());
    },
  });

  const resetForm = () => {
    setFormTitle("");
    setFormType("neutral");
    setFormImpact("low");
    setFormFreq("common");
    setFormDesc("");
    setFormContent("");
    editor?.commands.clearContent();
  };

  const openCreate = () => {
    setModalMode("create");
    setCurrent(null);
    resetForm();
    setModalOpen(true);
  };

  const openEdit = (a: Article) => {
    setModalMode("edit");
    setCurrent(a);
    setFormTitle(a.title);
    setFormType(a.type);
    setFormImpact(a.impact);
    setFormFreq(a.frequency);
    setFormDesc(a.description);
    setFormContent(a.content);
    editor?.commands.setContent(a.content);
    setModalOpen(true);
  };

  const openView = (a: Article) => {
    setModalMode("view");
    setCurrent(a);
    setFormTitle(a.title);
    setFormType(a.type);
    setFormImpact(a.impact);
    setFormFreq(a.frequency);
    setFormDesc(a.description);
    setFormContent(a.content);
    editor?.commands.setContent(a.content);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deletePsychologyAPI(id);
      fetchArticles();
    } catch (e) {}
  };

  const handleSubmit = async () => {
    if (!formTitle.trim()) return;
    if (modalMode === "create") {
      await createPsychologyAPI({
        title: formTitle.trim(),
        type: formType,
        frequency: formFreq,
        impact: formImpact,
        description: formDesc.trim(),
        content: formContent,
      });
    } else if (modalMode === "edit" && current) {
      await updatePsychologyAPI(current.id, {
        title: formTitle.trim(),
        type: formType,
        frequency: formFreq,
        impact: formImpact,
        description: formDesc.trim(),
        content: formContent,
      });
    }
    setModalOpen(false);
    fetchArticles();
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
      title: "Cảm xúc",
      dataIndex: "type",
      key: "type",
      render: (t: EmotionType) => typeTag(t),
    },
    {
      title: "Ảnh hưởng",
      dataIndex: "impact",
      key: "impact",
      render: (i: Impact) => <Tag>{impactLabel(i)}</Tag>,
    },
    {
      title: "Tần suất",
      dataIndex: "frequency",
      key: "frequency",
      render: (f: Frequency) =>
        f === "common" ? <Tag color="gold">Thường gặp</Tag> : <Tag>Hiếm</Tag>,
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (v: string) => dayjs(v).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thao tác",
      key: "actions",
      render: (_: any, a: Article) => (
        <Space>
          <Button
            style={{ color: "#faad14" }}
            icon={<EditOutlined style={{ color: "#faad14", fontSize: 14 }} />}
            onClick={() => openEdit(a)}
          ></Button>
          <Popconfirm
            title="Xóa bài"
            description="Bạn có chắc muốn xóa bài này?"
            onConfirm={() => handleDelete(a.id)}
          >
            <Button
              danger
              icon={
                <DeleteOutlined style={{ color: "#ff4d4f", fontSize: 14 }} />
              }
              style={{ color: "#ff4d4f" }}
            ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="psychology-admin">
      <div className="page-header">
        <h1>Quản Lý Thư Viện Tâm Lý Giao Dịch</h1>
        <p>Tạo, chỉnh sửa, tìm kiếm và quản lý nội dung bài viết.</p>
      </div>

      <Card className="ps-toolbar">
        <Space wrap>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm tiêu đề/mô tả/nội dung"
            style={{ width: 280 }}
          />
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
          <Button
            type="primary"
            icon={<PlusOutlined style={{ fontSize: 14 }} />}
            onClick={openCreate}
          >
            Thêm bài
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            {loading ? (
              <Empty description="Đang tải dữ liệu..." />
            ) : filtered.length === 0 ? (
              <Empty description="Chưa có bài trong thư viện" />
            ) : (
              <Table
                rowKey="id"
                dataSource={filtered}
                columns={columns as any}
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
          modalMode === "create"
            ? "Thêm bài"
            : modalMode === "edit"
              ? "Sửa bài"
              : "Xem chi tiết"
        }
        width={900}
        footer={
          modalMode === "view"
            ? null
            : [
                <Button key="cancel" onClick={() => setModalOpen(false)}>
                  Hủy
                </Button>,
                <Button
                  key="save"
                  type="primary"
                  onClick={handleSubmit}
                  disabled={!formTitle.trim()}
                >
                  Lưu
                </Button>,
              ]
        }
      >
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Input
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="Tiêu đề"
            disabled={modalMode === "view"}
          />
          <Space wrap>
            <Select
              value={formType}
              onChange={setFormType}
              options={[
                { value: "positive", label: "Tích cực" },
                { value: "negative", label: "Tiêu cực" },
                { value: "neutral", label: "Trung lập" },
              ]}
              style={{ width: 160 }}
              disabled={modalMode === "view"}
            />
            <Select
              value={formImpact}
              onChange={setFormImpact}
              options={[
                { value: "low", label: "Ảnh hưởng thấp" },
                { value: "medium", label: "Ảnh hưởng trung bình" },
                { value: "high", label: "Ảnh hưởng cao" },
              ]}
              style={{ width: 200 }}
              disabled={modalMode === "view"}
            />
            <Select
              value={formFreq}
              onChange={setFormFreq}
              options={[
                { value: "common", label: "Thường gặp" },
                { value: "rare", label: "Hiếm" },
              ]}
              style={{ width: 160 }}
              disabled={modalMode === "view"}
            />
          </Space>
          <Input.TextArea
            value={formDesc}
            onChange={(e) => setFormDesc(e.target.value)}
            placeholder="Mô tả ngắn"
            autoSize={{ minRows: 2, maxRows: 4 }}
            disabled={modalMode === "view"}
          />
          <div className="tiptap-box">
            {editor && modalMode !== "view" && (
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
                    <Title fontSize="small" /> 1
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Tiêu đề 2"
                  >
                    <Title fontSize="small" /> 2
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
                    onClick={() => editor.chain().focus().toggleItalic().run()}
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
                    onClick={() => editor.chain().focus().toggleStrike().run()}
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
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
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
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive("italic") ? "is-active" : ""}
                  >
                    Italic
                  </button>
                  <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
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
                    className={editor.isActive("bulletList") ? "is-active" : ""}
                  >
                    List
                  </button>
                </Space>
              </FloatingMenu>
            )}
            <EditorContent editor={editor} className="tiptap-editor" />
          </div>
          {modalMode === "view" && (
            <div
              style={{ paddingTop: 12 }}
              dangerouslySetInnerHTML={{ __html: formContent }}
            />
          )}
        </Space>
      </Modal>
    </div>
  );
};
export default PsychologyAdminComponent;
