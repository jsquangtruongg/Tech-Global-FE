import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
  Select,
  Image,
} from "antd";
import dayjs from "dayjs";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  getAllPostsAPI,
  createPostAPI,
  updatePostAPI,
  deletePostAPI,
  uploadPostImageAPI,
  type IPost,
} from "../../../api/post";
import "./style.scss";

const { TextArea } = Input;
const { Option } = Select;

const PostNewAdminComponent = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<IPost | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchPosts = async () => {
    setLoading(true);
    const res = await getAllPostsAPI({ limit: "all" });
    if (res.err === 0 && res.data) {
      setPosts(res.data);
    } else {
      message.error("Không thể tải danh sách bài viết");
      setPosts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = (value: string) => {
    setIsSearching(true);
    // Simulate API delay or processing time
    setTimeout(() => {
      setSearchText(value);
      setIsSearching(false);
    }, 800); // 0.8s delay for effect
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || post.status === statusFilter;
    const matchesCategory =
      categoryFilter === "all" || post.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleAdd = () => {
    setEditingPost(null);
    form.resetFields();
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: IPost) => {
    setEditingPost(record);
    form.setFieldsValue(record);
    setPreviewImage(record.image || null);
    setIsModalOpen(true);
  };

  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const res = await uploadPostImageAPI(file);
      if (res.err === 0 && res.data?.url) {
        form.setFieldsValue({
          image: res.data.url,
          imageUpload: res.data.url,
        });
        await form.validateFields(["imageUpload"]);
        setPreviewImage(res.data.url);
        message.success("Upload ảnh thành công");
      } else {
        message.error(res.mes || "Upload ảnh thất bại");
      }
    } catch (error) {
      message.error("Upload ảnh thất bại");
    }
    setUploadingImage(false);
  };

  const handleDelete = async (id: number) => {
    // Optimistic update or wait for API
    const res = await deletePostAPI(id);
    if (res.err === 0) {
      message.success("Xóa bài viết thành công");
      fetchPosts();
    } else {
      message.error("Lỗi khi xóa bài viết");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingPost) {
        // Update
        const res = await updatePostAPI(editingPost.id!, values);
        if (res.err === 0) {
          message.success("Cập nhật bài viết thành công");
          fetchPosts();
        } else {
          message.error("Lỗi khi cập nhật bài viết");
        }
      } else {
        // Create
        const res = await createPostAPI(values);
        if (res.err === 0) {
          message.success("Tạo bài viết thành công");
          fetchPosts();
        } else {
          message.error("Lỗi khi tạo bài viết");
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.log("Validate Failed:", error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (text: string) => (
        <Image
          width={80}
          src={text || "https://via.placeholder.com/80"}
          alt="thumbnail"
          style={{ borderRadius: "4px", objectFit: "cover" }}
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text: string) => (
        <span style={{ fontWeight: 600 }}>
          {text.length > 30 ? `${text.substring(0, 30)}...` : text}
        </span>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (tag: string) => {
        let color = "blue";
        if (tag === "Gold Trading") color = "gold";
        if (tag === "Crypto") color = "purple";
        if (tag === "Trading Analysis") color = "cyan";
        return (
          <Tag color={color} key={tag}>
            {tag?.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: "Tác giả",
      dataIndex: "authorData",
      key: "authorData",
      render: (authorData: any) =>
        [authorData?.lastName, authorData?.firstName].filter(Boolean).join(" ") ||
        "Unknown",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "published" ? "green" : "orange"}>
          {status === "published" ? "Đã đăng" : "Bản nháp"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IPost) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: "#faad14" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="post-admin-container">
      <div className="page-header">
        <h2 className="page-title">Quản lý bài viết</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="btn-add"
        >
          Thêm bài viết
        </Button>
      </div>

      <div className="filter-bar">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm kiếm theo tiêu đề..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onSearch={handleSearch}
            enterButton
            allowClear
            loading={isSearching}
            size="large"
            style={{ width: 350 }}
          />
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            size="large"
            onChange={(value) => setCategoryFilter(value)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả danh mục</Option>
            <Option value="Gold Trading">Gold Trading</Option>
            <Option value="Crypto">Crypto</Option>
            <Option value="Trading Analysis">Trading Analysis</Option>
          </Select>
          <Select
            defaultValue="all"
            style={{ width: 180 }}
            size="large"
            onChange={(value) => setStatusFilter(value)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="published">Đã đăng</Option>
            <Option value="draft">Bản nháp</Option>
          </Select>
        </Space>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchPosts}
          size="large"
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredPosts}
        rowKey="id"
        loading={loading || isSearching}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingPost ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={800}
        okText={editingPost ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical" name="postForm">
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="Nhập tiêu đề bài viết" />
          </Form.Item>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
            }}
          >
            <Form.Item
              name="category"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
            >
              <Select placeholder="Chọn danh mục">
                <Option value="Gold Trading">Gold Trading</Option>
                <Option value="Crypto">Crypto</Option>
                <Option value="Trading Analysis">Trading Analysis</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              initialValue="published"
            >
              <Select>
                <Option value="published">Đã đăng</Option>
                <Option value="draft">Bản nháp</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Ảnh bài viết"
            name="imageUpload"
            required
            rules={[
              {
                validator: async () => {
                  const image = form.getFieldValue("image");
                  if (!image) {
                    throw new Error("Vui lòng upload hình ảnh!");
                  }
                },
              },
            ]}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleUploadImage}
                disabled={uploadingImage}
              />
              {uploadingImage && <span>Đang upload ảnh...</span>}
              {previewImage && (
                <Image
                  src={previewImage}
                  width={200}
                  style={{ marginTop: 8, borderRadius: 4 }}
                />
              )}
            </Space>
          </Form.Item>

          <Form.Item
            name="desc"
            label="Mô tả ngắn"
            rules={[{ required: true, message: "Vui lòng nhập mô tả ngắn!" }]}
          >
            <TextArea rows={2} placeholder="Nhập mô tả ngắn" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung chi tiết"
            rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
          >
            <TextArea rows={6} placeholder="Nhập nội dung bài viết..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PostNewAdminComponent;
