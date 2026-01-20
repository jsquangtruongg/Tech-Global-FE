import { useEffect, useState } from "react";
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
  InputNumber,
  Row,
  Col,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  getAllBotProductsAPI,
  createBotProductAPI,
  updateBotProductAPI,
  deleteBotProductAPI,
  type IBotProduct,
  uploadBotProductImageAPI,
} from "../../../api/bot-product";
import "./style.scss";

const { Option } = Select;
const { TextArea } = Input;

const BotTradeAdminComponent = () => {
  const [products, setProducts] = useState<IBotProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IBotProduct | null>(
    null
  );
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Fetch data
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params: any = {
        q: searchText,
      };
      if (statusFilter !== "all") {
        params.status = statusFilter;
      }

      const res = await getAllBotProductsAPI(params);
      if (res.err === 0) {
        setProducts(res.data);
      } else {
        message.error(res.mess);
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchText, statusFilter]);

  // Handle Create/Edit
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    form.setFieldsValue({ image: undefined, imageUpload: undefined });
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: IBotProduct) => {
    setEditingProduct(record);
    form.setFieldsValue({
      ...record,
      // If highlights is array/json, handle it here. Assuming string for now based on simple input.
    });
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
      const res = await uploadBotProductImageAPI(file);
      if (res.err === 0 && res.data?.url) {
        form.setFieldsValue({
          image: res.data.url,
          imageUpload: res.data.url,
        });
        await form.validateFields(["imageUpload"]);
        setPreviewImage(res.data.url);
        message.success("Upload ảnh bot thành công");
      } else {
        message.error(res.mess || "Upload ảnh bot thất bại");
      }
    } catch (error) {
      message.error("Upload ảnh bot thất bại");
    }
    setUploadingImage(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteBotProductAPI(id);
      if (res.err === 0) {
        message.success("Xóa sản phẩm thành công");
        fetchProducts();
      } else {
        message.error(res.mess);
      }
    } catch (error) {
      message.error("Lỗi khi xóa sản phẩm");
    }
  };

  const onFinish = async (values: any) => {
    // Convert highlights string back to array
    if (values.highlights && typeof values.highlights === "string") {
      values.highlights = values.highlights
        .split("\n")
        .map((item: string) => item.trim())
        .filter((item: string) => item !== "");
    }

    setLoading(true);
    try {
      let res;
      if (editingProduct?.id) {
        res = await updateBotProductAPI({ ...values, id: editingProduct.id });
      } else {
        res = await createBotProductAPI(values);
      }
      if (res.err === 0) {
        message.success(
          editingProduct ? "Cập nhật thành công" : "Tạo mới thành công"
        );
        setIsModalOpen(false);
        fetchProducts();
      } else {
        message.error(res.mess);
      }
    } catch (error) {
      message.error("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Table Columns
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Mã Code",
      dataIndex: "code",
      key: "code",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Loại",
      dataIndex: "asset_type",
      key: "asset_type",
      render: (text: string) =>
        text ? <Tag color="geekblue">{text}</Tag> : "-",
    },
    {
      title: "Tên Bot",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: IBotProduct) => (
        <div>
          <p>{text}</p>
         
        </div>
      ),
    },
    {
      title: "Lợi nhuận",
      dataIndex: "profit_display",
      key: "profit_display",
      render: (text: string) => <span style={{ color: "green" }}>{text}</span>,
    },
    {
      title: "Giá tháng ($)",
      dataIndex: "monthly_usd",
      key: "monthly_usd",
      render: (val: number) => `$${val}`,
    },
    {
      title: "Giá năm ($)",
      dataIndex: "yearly_usd",
      key: "yearly_usd",
      render: (val: number) => `$${val}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IBotProduct) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{ color: "#faad14", border: "none" }}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id!)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              style={{ border: "none" }}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="bot-trade-admin">
      <div className="page-header">
        <Space>
          <Input
            placeholder="Tìm kiếm theo tên, mã..."
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            defaultValue="all"
            style={{ width: 150 }}
            onChange={setStatusFilter}
          >
            <Option value="all">Tất cả trạng thái</Option>
            <Option value="ACTIVE">Hoạt động</Option>
            <Option value="INACTIVE">Ngừng hoạt động</Option>
          </Select>
          <Button icon={<ReloadOutlined />} onClick={fetchProducts} />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Thêm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ marginTop: 20 }}
      />

      <Modal
        title={editingProduct ? "Cập nhật Bot Trade" : "Thêm mới Bot Trade"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: "ACTIVE" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã Code"
                rules={[{ required: true, message: "Vui lòng nhập mã code" }]}
              >
                <Input placeholder="VD: BOT_VIP" disabled={!!editingProduct} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên Bot"
                rules={[{ required: true, message: "Vui lòng nhập tên bot" }]}
              >
                <Input placeholder="VD: Super Bot Trading" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="subtitle" label="Mô tả ngắn">
            <Input placeholder="Mô tả ngắn về bot..." />
          </Form.Item>

          <Form.Item name="image" hidden>
            <Input />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="asset_type" label="Loại tài sản (Asset Type)">
                <Input placeholder="VD: Crypto, Gold..." />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="imageUpload"
                label="Ảnh Robot"
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
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <img
                      src={previewImage}
                      style={{
                        marginTop: 8,
                        borderRadius: 4,
                        width: 200,
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Space>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="profit_display" label="Hiển thị Lợi nhuận">
                <Input placeholder="VD: +32% 6 tháng" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="drawdown_display" label="Hiển thị Drawdown">
                <Input placeholder="VD: DD tối đa 8%" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="rating" label="Đánh giá (Rating)">
                <InputNumber
                  min={0}
                  max={5}
                  step={0.1}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="is_popular"
                label="Phổ biến (Popular)"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="monthly_usd"
                label="Giá tháng (USD)"
                rules={[{ required: true, message: "Vui lòng nhập giá tháng" }]}
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="yearly_usd"
                label="Giá năm (USD)"
                rules={[{ required: true, message: "Vui lòng nhập giá năm" }]}
              >
                <InputNumber<number>
                  style={{ width: "100%" }}
                  min={0}
                  formatter={(value) =>
                    `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value?.replace(/\$\s?|(,*)/g, "") as unknown as number
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="highlights" label="Điểm nổi bật (Highlights)">
            <TextArea rows={4} placeholder="Nhập các điểm nổi bật..." />
          </Form.Item>

          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="ACTIVE">Hoạt động</Option>
              <Option value="INACTIVE">Ngừng hoạt động</Option>
            </Select>
          </Form.Item>

          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => setIsModalOpen(false)}
              style={{ marginRight: 8 }}
            >
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingProduct ? "Cập nhật" : "Tạo mới"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BotTradeAdminComponent;
