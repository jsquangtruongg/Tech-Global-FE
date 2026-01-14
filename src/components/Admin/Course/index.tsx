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
  Image,
  Tabs,
  InputNumber,
  Card,
  Collapse,
  Row,
  Col,
  Checkbox,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  MinusCircleOutlined,
  PlayCircleOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  getAllCoursesAPI,
  createCourseAPI,
  updateCourseAPI,
  deleteCourseAPI,
  type ICourse,
  type ISection,
  uploadCourseImageAPI,
} from "../../../api/course";
import "./style.scss";
import { getAllUsersAPI } from "../../../api/user";

const { TextArea } = Input;
const { Option } = Select;
const { Panel } = Collapse;

const CourseAdminComponent = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<ICourse | null>(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [isSearching, setIsSearching] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [instructors, setInstructors] = useState<any[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [form] = Form.useForm();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await getAllCoursesAPI();
      if (res.err === 0 && res.data) {
        setCourses(res.data);
      } else {
        message.error("Không thể tải danh sách khóa học");
        setCourses([]);
      }
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      message.error("Lỗi kết nối máy chủ");
    }
    setLoading(false);
  };

  const fetchInstructors = async () => {
    try {
      const res = await getAllUsersAPI({ limit: "all" });
      if (res.err === 0 && Array.isArray(res.userData)) {
        setInstructors(res.userData);
      }
    } catch (error) {
      console.error("Failed to fetch instructors", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchInstructors();
  }, []);

  const handleSearch = (value: string) => {
    setIsSearching(true);
    setTimeout(() => {
      setSearchText(value);
      setIsSearching(false);
    }, 800);
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || course.category === categoryFilter;
    const matchesLevel = levelFilter === "all" || course.level === levelFilter;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    form.setFieldsValue({
      sections: [],
      image: undefined,
      imageUpload: undefined,
    });
    setPreviewImage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (record: ICourse) => {
    setEditingCourse(record);
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
      const res = await uploadCourseImageAPI(file);
      if (res.err === 0 && res.data?.url) {
        form.setFieldsValue({
          image: res.data.url,
          imageUpload: res.data.url,
        });
        await form.validateFields(["imageUpload"]);
        setPreviewImage(res.data.url);
        message.success("Upload ảnh khóa học thành công");
      } else {
        message.error(res.mes || "Upload ảnh khóa học thất bại");
      }
    } catch (error) {
      message.error("Upload ảnh khóa học thất bại");
    }
    setUploadingImage(false);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await deleteCourseAPI(id);
      if (res.err === 0) {
        message.success("Xóa khóa học thành công");
        fetchCourses();
      } else {
        message.error(res.mes || "Xóa khóa học thất bại");
      }
    } catch (error) {
      message.error("Lỗi khi xóa khóa học");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      // Calculate lessons count and duration (simple mock logic for duration) based on sections
      let totalLessons = 0;
      if (values.sections) {
        values.sections.forEach((sec: ISection) => {
          if (sec.lessons) totalLessons += sec.lessons.length;
        });
      }
      values.lessonsCount = totalLessons;
      if (!values.duration) values.duration = "0h 00m"; // Default if not input

      if (editingCourse) {
        const res = await updateCourseAPI(editingCourse.id!, values);
        if (res.err === 0) {
          message.success("Cập nhật khóa học thành công");
          fetchCourses();
          setIsModalOpen(false);
        } else {
          message.error(res.mes || "Cập nhật thất bại");
        }
      } else {
        const res = await createCourseAPI(values);
        if (res.err === 0) {
          message.success("Tạo khóa học thành công");
          fetchCourses();
          setIsModalOpen(false);
        } else {
          message.error(res.mes || "Tạo mới thất bại");
        }
      }
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
          fallback="https://via.placeholder.com/80?text=No+Image"
        />
      ),
    },
    {
      title: "Tên khóa học",
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
      render: (cat: string) => {
        let color = "default";
        if (cat === "Gold Trading") color = "gold";
        if (cat === "Crypto") color = "blue";
        if (cat === "Trading Analysis") color = "cyan";
        return <Tag color={color}>{cat}</Tag>;
      },
    },
    {
      title: "Cấp độ",
      dataIndex: "level",
      key: "level",
      render: (level: string) => {
        let color = "geekblue";
        if (level === "Beginner") color = "green";
        if (level === "Intermediate") color = "orange";
        if (level === "Advanced") color = "red";
        return <Tag color={color}>{level}</Tag>;
      },
    },
    {
      title: "Thống kê",
      key: "stats",
      render: (_: any, record: ICourse) => (
        <div style={{ fontSize: "12px", color: "#666" }}>
          <div>Học viên: {record.students}</div>
          <div>Bài học: {record.lessons_count || 0}</div>
          <div>Thời lượng: {record.duration}</div>
        </div>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price: number) => (
        <span style={{ fontWeight: 500 }}>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(price)}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: ICourse) => (
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

  // Form Content
  const GeneralInfoForm = () => (
    <>
      <Form.Item
        name="title"
        label="Tên khóa học"
        rules={[{ required: true, message: "Vui lòng nhập tên khóa học!" }]}
      >
        <Input placeholder="Nhập tên khóa học" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: "Vui lòng chọn danh mục!" }]}
          >
            <Select placeholder="Chọn danh mục">
              <Option value="Gold Trading">Gold Trading (Vàng)</Option>
              <Option value="Crypto">Crypto (Tiền điện tử)</Option>
              <Option value="Trading Analysis">
                Trading Analysis (Phân tích)
              </Option>
              <Option value="Forex">Forex (Ngoại hối)</Option>
              <Option value="Stocks">Stocks (Chứng khoán)</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="level"
            label="Cấp độ"
            rules={[{ required: true, message: "Vui lòng chọn cấp độ!" }]}
          >
            <Select placeholder="Chọn cấp độ">
              <Option value="Beginner">Beginner (Mới bắt đầu)</Option>
              <Option value="Intermediate">Intermediate (Trung cấp)</Option>
              <Option value="Advanced">Advanced (Nâng cao)</Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="price"
            label="Giá khóa học (VND)"
            rules={[{ required: true, message: "Vui lòng nhập giá!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value?: string) =>
                value?.replace(/\$\s?|(,*)/g, "") as unknown as number
              }
              min={0}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="duration"
            label="Tổng thời lượng (Ví dụ: 8h 30m)"
            initialValue="0h 00m"
          >
            <Input />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="image" hidden>
        <Input />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ảnh khóa học"
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
        </Col>
        <Col span={12}>
          <Form.Item
            name="instructor_id"
            label="Giảng viên"
            rules={[{ required: true, message: "Chọn giảng viên" }]}
          >
            <Select
              placeholder="Chọn giảng viên"
              showSearch
              optionFilterProp="children"
            >
              {instructors.map((user) => (
                <Option key={user.id} value={user.id}>
                  {[user?.lastName, user?.firstName].filter(Boolean).join(" ")}{" "}
                  ({user.email})
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="desc"
        label="Mô tả khóa học"
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <TextArea rows={4} placeholder="Nhập mô tả tổng quan về khóa học..." />
      </Form.Item>
    </>
  );

  const CurriculumForm = () => (
    <div className="curriculum-form">
      <Form.List name="sections">
        {(fields, { add, remove }) => (
          <>
            <div
              style={{
                marginBottom: 16,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 16 }}>
                Danh sách các chương (Sections)
              </span>
              <Button
                type="dashed"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Thêm chương
              </Button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {fields.map(({ key, name, ...restField }) => (
                <Card
                  key={key}
                  size="small"
                  title={
                    <Space>
                      <span style={{ fontWeight: "bold" }}>
                        Chương {name + 1}
                      </span>
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        rules={[{ required: true, message: "Nhập tên chương" }]}
                        noStyle
                      >
                        <Input
                          placeholder="Tên chương học"
                          style={{ width: 300 }}
                        />
                      </Form.Item>
                    </Space>
                  }
                  extra={
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  }
                >
                  {/* Nested Form.List for Lessons */}
                  <Form.List name={[name, "lessons"]}>
                    {(
                      lessonFields,
                      { add: addLesson, remove: removeLesson }
                    ) => (
                      <>
                        {lessonFields.map(
                          ({ key: lKey, name: lName, ...lRestField }) => (
                            <div
                              key={lKey}
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 8,
                                marginBottom: 16,
                                padding: 12,
                                background: "#fafafa",
                                borderRadius: 8,
                                border: "1px solid #f0f0f0",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <Form.Item
                                  {...lRestField}
                                  name={[lName, "title"]}
                                  rules={[
                                    { required: true, message: "Tên bài" },
                                  ]}
                                  style={{ flex: 1, marginBottom: 0 }}
                                >
                                  <Input
                                    placeholder="Tên bài học"
                                    prefix={
                                      <PlayCircleOutlined
                                        style={{ fontSize: 14 }}
                                      />
                                    }
                                  />
                                </Form.Item>
                                <Form.Item
                                  {...lRestField}
                                  name={[lName, "duration"]}
                                  initialValue="00:00"
                                  style={{ width: 100, marginBottom: 0 }}
                                >
                                  <Input placeholder="Thời lượng" />
                                </Form.Item>
                                <Button
                                  type="text"
                                  danger
                                  icon={<MinusCircleOutlined />}
                                  onClick={() => removeLesson(lName)}
                                />
                              </div>

                              <div
                                style={{
                                  display: "flex",
                                  gap: 8,
                                  alignItems: "center",
                                }}
                              >
                                <Form.Item
                                  {...lRestField}
                                  name={[lName, "video_url"]}
                                  style={{ flex: 1, marginBottom: 0 }}
                                >
                                  <Input placeholder="Link video bài học (Youtube...)" />
                                </Form.Item>
                                <Form.Item
                                  {...lRestField}
                                  name={[lName, "preview"]}
                                  valuePropName="checked"
                                  initialValue={false}
                                  style={{ marginBottom: 0 }}
                                >
                                  <Checkbox>Xem thử</Checkbox>
                                </Form.Item>
                              </div>
                            </div>
                          )
                        )}
                        <Button
                          type="dashed"
                          block
                          onClick={() => addLesson()}
                          icon={<PlusOutlined />}
                        >
                          Thêm bài học
                        </Button>
                      </>
                    )}
                  </Form.List>
                </Card>
              ))}
            </div>
          </>
        )}
      </Form.List>
    </div>
  );

  const items = [
    { key: "1", label: "Thông tin chung", children: <GeneralInfoForm /> },
    { key: "2", label: "Nội dung khóa học", children: <CurriculumForm /> },
  ];

  return (
    <div className="course-admin-container">
      <div className="page-header">
        <h2 className="page-title">Quản lý khóa học</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="btn-add"
        >
          Thêm khóa học
        </Button>
      </div>

      <div className="filter-bar">
        <Space size="middle">
          <Input.Search
            placeholder="Tìm kiếm khóa học..."
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
            onChange={(value) => setLevelFilter(value)}
            suffixIcon={<FilterOutlined />}
          >
            <Option value="all">Tất cả cấp độ</Option>
            <Option value="Beginner">Beginner</Option>
            <Option value="Intermediate">Intermediate</Option>
            <Option value="Advanced">Advanced</Option>
          </Select>
        </Space>

        <Button
          icon={<ReloadOutlined />}
          onClick={fetchCourses}
          size="large"
          loading={loading}
        >
          Làm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="id"
        loading={loading || isSearching}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingCourse ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
        width={900}
        okText={editingCourse ? "Cập nhật" : "Tạo mới"}
        cancelText="Hủy"
        className="course-modal"
      >
        <Form form={form} layout="vertical" name="courseForm">
          <Tabs defaultActiveKey="1" items={items} />
        </Form>
      </Modal>
    </div>
  );
};

export default CourseAdminComponent;
