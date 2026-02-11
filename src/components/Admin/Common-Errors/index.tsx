import "./style.scss";
import { useState, useMemo, useEffect, useRef } from "react";
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
  message,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
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
  Image as ImageIcon,
  Link as LinkIcon,
} from "@mui/icons-material";
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
  getAllCommonErrorsAPI,
  createCommonErrorAPI,
  updateCommonErrorAPI,
  deleteCommonErrorAPI,
  type ICommonError,
  type Category,
  type Severity,
} from "../../../api/common-errors";

const CATEGORY_OPTIONS = [
  { value: "PSYCHOLOGY", label: "Tâm lý" },
  { value: "TECHNICAL", label: "Kỹ thuật" },
  { value: "RISK", label: "Quản lý vốn" },
  { value: "PROCESS", label: "Quy trình" },
];

const SEVERITY_OPTIONS = [
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Nghiêm trọng" },
];

const TAG_OPTIONS = [
  { value: "Quan trọng", label: "Quan trọng" },
  { value: "Bắt buộc phải biết", label: "Bắt buộc phải biết" },
];

const CommonErrorsAdminComponent = () => {
  const [errors, setErrors] = useState<ICommonError[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "ALL">("ALL");
  const [severityFilter, setSeverityFilter] = useState<Severity | "ALL">("ALL");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [form] = Form.useForm();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formContent, setFormContent] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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

  const fetchErrors = async () => {
    setLoading(true);
    try {
      const res = await getAllCommonErrorsAPI();
      if (res.err === 0 && Array.isArray(res.data)) {
        setErrors(res.data);
      }
    } catch (e) {
      console.error(e);
      message.error("Lỗi kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrors();
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
      Placeholder.configure({ placeholder: "Nhập mô tả chi tiết lỗi..." }),
    ],
    content: formContent,
    onUpdate({ editor }) {
      setFormContent(editor.getHTML());
    },
  });

  const filtered = useMemo(() => {
    return errors.filter((e) => {
      const bySearch =
        search.trim() === ""
          ? true
          : e.name.toLowerCase().includes(search.toLowerCase());
      const byCategory =
        categoryFilter === "ALL" ? true : e.category === categoryFilter;
      const bySeverity =
        severityFilter === "ALL" ? true : e.severity === severityFilter;
      return bySearch && byCategory && bySeverity;
    });
  }, [errors, search, categoryFilter, severityFilter]);

  const handleCreate = () => {
    setModalMode("create");
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      tags: ["Quan trọng", "Bắt buộc phải biết"],
      category: "PSYCHOLOGY",
      severity: "medium",
    });
    setFormContent("");
    editor?.commands.clearContent();
    setModalOpen(true);
  };

  const handleEdit = (record: ICommonError) => {
    setModalMode("edit");
    setEditingId(record.id || null);
    form.setFieldsValue({
      ...record,
    });
    const content = record.content || "";
    setFormContent(content);
    editor?.commands.setContent(content);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteCommonErrorAPI(id);
      if (res.err === 0) {
        message.success("Xóa thành công");
        fetchErrors();
      } else {
        message.error(res.mess);
      }
    } catch (e) {
      message.error("Có lỗi xảy ra");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      const payload: ICommonError = {
        ...values,
        content: formContent,
        tags: values.tags || [],
      };

      if (modalMode === "create") {
        const res = await createCommonErrorAPI(payload);
        if (res.err === 0) {
          message.success("Tạo mới thành công");
          setModalOpen(false);
          fetchErrors();
        } else {
          message.error(res.mess);
        }
      } else {
        if (!editingId) return;
        const res = await updateCommonErrorAPI(editingId, payload);
        if (res.err === 0) {
          message.success("Cập nhật thành công");
          setModalOpen(false);
          fetchErrors();
        } else {
          message.error(res.mess);
        }
      }
    } catch (e) {
      console.error(e);
    }
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
      size="small"
      style={{ minWidth: 32 }}
    >
      {children}
    </Button>
  );

  const columns = [
    {
      title: "Tên lỗi",
      dataIndex: "name",
      key: "name",
      width: "25%",
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (cat: string) => {
        const opt = CATEGORY_OPTIONS.find((o) => o.value === cat);
        return <Tag color="blue">{opt?.label || cat}</Tag>;
      },
    },
    {
      title: "Mức độ",
      dataIndex: "severity",
      key: "severity",
      render: (sev: string) => {
        const color =
          sev === "high" ? "red" : sev === "medium" ? "gold" : "green";
        const label =
          sev === "high"
            ? "Nghiêm trọng"
            : sev === "medium"
              ? "Trung bình"
              : "Thấp";
        return <Tag color={color}>{label}</Tag>;
      },
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
          {tags?.length > 3 && <Tag>...</Tag>}
        </>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ICommonError) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            className="btn-edit"
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button danger type="text" icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="common-errors-admin">
      <div className="page-header">
        <h1>Quản lý Lỗi Thường Gặp</h1>
        <p>Thêm, sửa, xóa các lỗi thường gặp trong thư viện</p>
      </div>

      <Card className="ce-toolbar">
        <Row gutter={[16, 16]} justify="space-between" align="middle">
          <Col xs={24} md={16}>
            <Space wrap>
              <Input.Search
                placeholder="Tìm kiếm lỗi..."
                onSearch={setSearch}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: 250 }}
                allowClear
              />
              <Select
                defaultValue="ALL"
                style={{ width: 150 }}
                onChange={(v: Category | "ALL") => setCategoryFilter(v)}
                options={[
                  { value: "ALL", label: "Tất cả danh mục" },
                  ...CATEGORY_OPTIONS,
                ]}
              />
              <Select
                defaultValue="ALL"
                style={{ width: 150 }}
                onChange={(v: Severity | "ALL") => setSeverityFilter(v)}
                options={[
                  { value: "ALL", label: "Tất cả mức độ" },
                  ...SEVERITY_OPTIONS,
                ]}
              />
            </Space>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
              style={{ backgroundColor: "#4aaf52", borderColor: "#4aaf52" }}
            >
              Thêm mới
            </Button>
          </Col>
        </Row>
      </Card>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={modalMode === "create" ? "Thêm lỗi mới" : "Chỉnh sửa lỗi"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        width={900}
        maskClosable={true}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tiêu đề"
                rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
              >
                <Input placeholder="Nhập tiêu đề lỗi" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="id"
                label="ID (Slug)"
                tooltip="Tự động tạo nếu để trống"
              >
                <Input placeholder="vi-du-id-loi" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Chủ đề"
                initialValue="PSYCHOLOGY"
              >
                <Select options={CATEGORY_OPTIONS} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="severity" label="Cấp độ" initialValue="medium">
                <Select options={SEVERITY_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Nội dung chi tiết">
            <div className="tiptap-box">
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                accept="image/*"
                onChange={onFileChange}
              />
              {editor && (
                <div className="tiptap-toolbar">
                  <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Hoàn tác"
                  >
                    <Undo />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Làm lại"
                  >
                    <Redo />
                  </ToolbarButton>
                  <div className="toolbar-divider" />

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 1 })}
                    title="Tiêu đề 1"
                  >
                    <div style={{ position: "relative", display: "flex" }}>
                      <TitleIcon style={{ fontSize: 20 }} />
                      <span
                        style={{
                          fontSize: 10,
                          position: "absolute",
                          bottom: -2,
                          right: -2,
                          fontWeight: "bold",
                        }}
                      >
                        1
                      </span>
                    </div>
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                    isActive={editor.isActive("heading", { level: 2 })}
                    title="Tiêu đề 2"
                  >
                    <div style={{ position: "relative", display: "flex" }}>
                      <TitleIcon style={{ fontSize: 20 }} />
                      <span
                        style={{
                          fontSize: 10,
                          position: "absolute",
                          bottom: -2,
                          right: -2,
                          fontWeight: "bold",
                        }}
                      >
                        2
                      </span>
                    </div>
                  </ToolbarButton>

                  <div className="toolbar-divider" />

                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    title="In đậm"
                  >
                    <FormatBold />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    title="In nghiêng"
                  >
                    <FormatItalic />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleUnderline().run()
                    }
                    isActive={editor.isActive("underline")}
                    title="Gạch chân"
                  >
                    <FormatUnderlined />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    title="Gạch ngang"
                  >
                    <StrikethroughS />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleHighlight().run()
                    }
                    isActive={editor.isActive("highlight")}
                    title="Tô màu"
                  >
                    <HighlightIcon />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={editor.isActive("code")}
                    title="Code"
                  >
                    <Code />
                  </ToolbarButton>

                  <div className="toolbar-divider" />

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleBlockquote().run()
                    }
                    isActive={editor.isActive("blockquote")}
                    title="Trích dẫn"
                  >
                    <FormatQuote />
                  </ToolbarButton>

                  <div className="toolbar-divider" />

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().setTextAlign("left").run()
                    }
                    isActive={editor.isActive({ textAlign: "left" })}
                    title="Căn trái"
                  >
                    <FormatAlignLeft />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().setTextAlign("center").run()
                    }
                    isActive={editor.isActive({
                      textAlign: "center",
                    })}
                    title="Căn giữa"
                  >
                    <FormatAlignCenter />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().setTextAlign("right").run()
                    }
                    isActive={editor.isActive({ textAlign: "right" })}
                    title="Căn phải"
                  >
                    <FormatAlignRight />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().setTextAlign("justify").run()
                    }
                    isActive={editor.isActive({ textAlign: "justify" })}
                    title="Căn đều"
                  >
                    <FormatAlignJustify />
                  </ToolbarButton>
                  <div className="toolbar-divider" />
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={editor.isActive("bulletList")}
                    title="Danh sách"
                  >
                    <FormatListBulleted />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={editor.isActive("orderedList")}
                    title="Danh sách số"
                  >
                    <FormatListNumbered />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleTaskList().run()
                    }
                    isActive={editor.isActive("taskList")}
                    title="Checklist"
                  >
                    <Checklist />
                  </ToolbarButton>

                  <div className="toolbar-divider" />

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleSubscript().run()
                    }
                    isActive={editor.isActive("subscript")}
                    title="Chỉ số dưới"
                  >
                    <SubscriptIcon />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().toggleSuperscript().run()
                    }
                    isActive={editor.isActive("superscript")}
                    title="Chỉ số trên"
                  >
                    <SuperscriptIcon />
                  </ToolbarButton>

                  <div className="toolbar-divider" />

                  <ToolbarButton onClick={triggerImageUpload} title="Chèn ảnh">
                    <ImageIcon />
                  </ToolbarButton>
                  <ToolbarButton
                    onClick={() => {
                      const previousUrl = editor.getAttributes("link").href;
                      const url = window.prompt("URL", previousUrl);
                      if (url === null) return;
                      if (url === "") {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange("link")
                          .unsetLink()
                          .run();
                        return;
                      }
                      editor
                        .chain()
                        .focus()
                        .extendMarkRange("link")
                        .setLink({ href: url })
                        .run();
                    }}
                    isActive={editor.isActive("link")}
                    title="Chèn link"
                  >
                    <LinkIcon />
                  </ToolbarButton>

                  <div className="toolbar-divider" />

                  <ToolbarButton
                    onClick={() =>
                      editor.chain().focus().unsetAllMarks().clearNodes().run()
                    }
                    title="Xóa định dạng"
                  >
                    <FormatClear />
                  </ToolbarButton>
                </div>
              )}
              <EditorContent editor={editor} />
            </div>
          </Form.Item>

          <Form.Item name="tags" label="Tags (Thẻ)">
            <Select
              mode="tags"
              options={TAG_OPTIONS}
              placeholder="Chọn hoặc nhập tags"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CommonErrorsAdminComponent;
