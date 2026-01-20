import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Radio,
  Divider,
  Row,
  Col,
  Segmented,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  VideoCameraOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import "./style.scss";
import {
  getTopicsAPI,
  getSectionsByTopicAPI,
  getQuestionsBySectionAPI,
  type IMarket,
  type ITopic,
  type ISection,
  type IQuestion as IInterviewQuestion,
} from "../../../api/interview";
import {
  getAllStudiesAPI,
  createStudyAPI,
  updateStudyAPI,
  deleteStudyAPI,
  uploadStudyMediaAPI,
} from "../../../api/study";

interface IOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface IMedia {
  type: "image" | "video";
  url: string;
}

interface IExerciseItem {
  id: string;
  market: IMarket;
  topic_id: number;
  topic_name?: string;
  section_id: number;
  section_name?: string;
  type: "essay" | "multiple-choice" | "case-study";
  content: string;
  options?: IOption[];
  media?: IMedia;
  correct_answer?: string;
  explanation?: string;
  related_question_ids?: number[];
}

const StudyAdminComponent = () => {
  const [items, setItems] = useState<IExerciseItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tablePagination, setTablePagination] = useState({
    current: 1,
    pageSize: 10,
  });

  const [market, setMarket] = useState<IMarket>("gold");
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);
  const [interviewQuestions, setInterviewQuestions] = useState<
    IInterviewQuestion[]
  >([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  );
  const visibleTopics = useMemo(
    () => topics.filter((t) => t.market === market),
    [topics, market]
  );
  const visibleSections = useMemo(
    () => sections.filter((s) => s.topic_id === selectedTopicId),
    [sections, selectedTopicId]
  );

  const [form] = Form.useForm();
  const questionType = Form.useWatch("type", form);
  const correctOptionIndex = Form.useWatch("correctOptionIndex", form);
  const mediaType = Form.useWatch("media_type", form);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<string | null>(null);

  useEffect(() => {
    fetchTopics();
    fetchStudies();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await getTopicsAPI();
      if (res?.data) setTopics(res.data);
    } catch (error) {
      console.error("Failed to fetch topics", error);
    }
  };

  const fetchStudies = async () => {
    setLoading(true);
    try {
      const res = await getAllStudiesAPI();
      if (res?.data) {
        // Map API response to IExerciseItem
        const mappedItems: IExerciseItem[] = res.data.map((item: any) => {
          let parsedOptions = item.options;
          if (typeof item.options === "string") {
            try {
              parsedOptions = JSON.parse(item.options);
            } catch (e) {
              parsedOptions = [];
            }
          }

          let parsedMedia = item.media;
          if (typeof item.media === "string") {
            try {
              parsedMedia = JSON.parse(item.media);
            } catch (e) {
              parsedMedia = undefined;
            }
          }

          let parsedRelatedIds = item.related_question_ids;
          if (typeof item.related_question_ids === "string") {
            try {
              parsedRelatedIds = JSON.parse(item.related_question_ids);
            } catch (e) {
              parsedRelatedIds = [];
            }
          }

          return {
            id: item.id.toString(),
            market: item.section?.topic?.market || "gold",
            topic_id: item.section?.topic?.id,
            topic_name: item.section?.topic?.name,
            section_id: item.section_id,
            section_name: item.section?.name,
            type: item.type,
            content: item.content,
            options: parsedOptions,
            media: parsedMedia,
            correct_answer: item.correct_answer,
            explanation: item.explanation,
            related_question_ids: parsedRelatedIds,
          };
        });
        setItems(mappedItems);
      }
    } catch (error) {
      console.error("Failed to fetch studies", error);
      message.error("Lỗi khi tải danh sách bài tập");
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = async (topicId: number) => {
    setSelectedTopicId(topicId);
    setSelectedSectionId(null);
    setSections([]);
    setInterviewQuestions([]);
    form.setFieldsValue({
      section_id: undefined,
      related_question_ids: undefined,
    });
    try {
      const res = await getSectionsByTopicAPI(topicId);
      if (res?.data) setSections(res.data);
    } catch (error) {
      console.error("Failed to fetch sections", error);
    }
  };

  const handleSectionChange = async (sectionId: number) => {
    setSelectedSectionId(sectionId);
    form.setFieldsValue({ related_question_ids: undefined });
    try {
      const res = await getQuestionsBySectionAPI(sectionId);
      if (res?.data) setInterviewQuestions(res.data);
    } catch (error) {
      console.error("Failed to fetch questions", error);
    }
  };

  const handleAdd = () => {
    setEditingId(null);
    form.resetFields();
    form.setFieldsValue({
      type: "multiple-choice",
      options: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ],
      correctOptionIndex: 0,
    });
    setIsModalOpen(true);
  };

  const handleEdit = async (record: IExerciseItem) => {
    setEditingId(record.id);
    setSelectedTopicId(record.topic_id);
    setSelectedSectionId(record.section_id);

    try {
      const sectionsRes = await getSectionsByTopicAPI(record.topic_id);
      if (sectionsRes?.data) setSections(sectionsRes.data);

      const questionsRes = await getQuestionsBySectionAPI(record.section_id);
      if (questionsRes?.data) setInterviewQuestions(questionsRes.data);
    } catch (error) {
      console.error("Error pre-fetching form data", error);
    }

    let correctIdx = 0;
    if (record.options && Array.isArray(record.options)) {
      correctIdx = record.options.findIndex((o) => o.isCorrect);
      if (correctIdx === -1) correctIdx = 0;
    }

    form.setFieldsValue({
      ...record,
      media_type: record.media?.type,
      media_url: record.media?.url,
      correctOptionIndex: correctIdx,
    });
    setPreviewMedia(record.media?.url || null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteStudyAPI(Number(id));
      if (res && res.err === 0) {
        message.success("Xóa bài tập thành công");
        fetchStudies();
      } else {
        message.error(res?.mess || "Lỗi khi xóa bài tập");
      }
    } catch (error) {
      message.error("Lỗi khi xóa bài tập");
    }
  };

  const handleRemoveOption = (
    index: number,
    remove: (index: number) => void
  ) => {
    if (correctOptionIndex === index) {
      form.setFieldValue("correctOptionIndex", 0);
    } else if (correctOptionIndex > index) {
      form.setFieldValue("correctOptionIndex", correctOptionIndex - 1);
    }
    remove(index);
  };

  const handleFinish = async (values: any) => {
    const {
      topic_id,
      section_id,
      type,
      content,
      options,
      media_type,
      media_url,
      correct_answer,
      explanation,
      related_question_ids,
      correctOptionIndex,
    } = values;

    const payload: any = {
      section_id,
      type,
      content,
      options:
        type === "multiple-choice"
          ? options.map((o: any, idx: number) => ({
              id: o.id || `opt-${Date.now()}-${idx}`,
              text: o.text,
              isCorrect: idx === correctOptionIndex,
            }))
          : undefined,
      media:
        type === "case-study" && media_url
          ? {
              type: media_type,
              url: media_url,
            }
          : undefined,
      correct_answer: type !== "multiple-choice" ? correct_answer : undefined,
      explanation: type === "case-study" ? explanation : undefined,
      related_question_ids: related_question_ids || [],
    };

    try {
      if (editingId) {
        const res = await updateStudyAPI(Number(editingId), payload);
        if (res && res.err === 0) {
          message.success("Cập nhật bài tập thành công");
          fetchStudies();
          setIsModalOpen(false);
        } else {
          message.error(res?.mess || "Lỗi khi cập nhật");
        }
      } else {
        const res = await createStudyAPI(payload);
        if (res && res.err === 0) {
          message.success("Thêm bài tập thành công");
          fetchStudies();
          setIsModalOpen(false);
        } else {
          message.error(res?.mess || "Lỗi khi thêm mới");
        }
      }
    } catch (error) {
      message.error("Đã có lỗi xảy ra");
    }
  };

  const handleUploadMedia = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploadingMedia(true);
    try {
      const res = await uploadStudyMediaAPI(file);
      if (res.err === 0 && res.data?.url) {
        form.setFieldsValue({ media_url: res.data.url });
        setPreviewMedia(res.data.url);
        await form.validateFields(["mediaUpload"]);
        message.success("Upload ảnh thành công");
      } else {
        message.error(res.mess || "Upload ảnh thất bại");
      }
    } catch (error) {
      message.error("Upload ảnh thất bại");
    }
    setUploadingMedia(false);
  };

  const columns = [
    {
      title: "STT",
      key: "index",
      width: 80,
      align: "center" as const,
      render: (_: any, __: IExerciseItem, index: number) =>
        (tablePagination.current - 1) * tablePagination.pageSize + index + 1,
    },
    {
      title: "Phần phỏng vấn",
      dataIndex: "section_name",
      key: "section_name",
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Loại bài tập",
      dataIndex: "type",
      key: "type",
      render: (type: string) => {
        let color = "default";
        let label = type;
        if (type === "multiple-choice") {
          color = "green";
          label = "Trắc nghiệm";
        }
        if (type === "essay") {
          color = "orange";
          label = "Tự luận";
        }
        if (type === "case-study") {
          color = "purple";
          label = "Case Study";
        }
        return <Tag color={color}>{label}</Tag>;
      },
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: IExerciseItem) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Filter items by market
  const filteredItems = items.filter((item) => item.market === market);

  return (
    <div className="study-admin-container">
      <Card
        title="Quản lý bài tập (Exercise)"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm bài tập
          </Button>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <Segmented
            options={[
              { label: "Thị trường Crypto", value: "crypto" },
              { label: "Thị trường Vàng", value: "gold" },
            ]}
            value={market}
            onChange={(val) => setMarket(val as IMarket)}
          />
        </div>

        <Table
          columns={columns}
          dataSource={filteredItems}
          rowKey="id"
          loading={loading}
          pagination={tablePagination}
          onChange={(pag) =>
            setTablePagination({
              current: pag.current || 1,
              pageSize: pag.pageSize || tablePagination.pageSize,
            })
          }
        />
      </Card>
      <Modal
        title={editingId ? "Cập nhật bài tập" : "Thêm bài tập mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{ type: "multiple-choice" }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Chủ đề (Topic)"
                name="topic_id"
                rules={[{ required: true, message: "Vui lòng chọn chủ đề" }]}
              >
                <Select
                  placeholder="Chọn chủ đề"
                  onChange={handleTopicChange}
                  options={topics.map((t) => ({
                    label: `${t.name} (${t.market})`,
                    value: t.id,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Phần (Section)"
                name="section_id"
                rules={[{ required: true, message: "Vui lòng chọn phần" }]}
              >
                <Select
                  placeholder="Chọn phần"
                  onChange={handleSectionChange}
                  options={sections.map((s) => ({
                    label: s.name,
                    value: s.id,
                  }))}
                  disabled={!selectedTopicId}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Liên kết câu hỏi phỏng vấn (theo phần)"
            name="related_question_ids"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn ít nhất một câu hỏi phỏng vấn",
              },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Chọn các câu hỏi phỏng vấn liên quan"
              options={interviewQuestions.map((q) => ({
                label: q.question,
                value: q.id,
              }))}
              disabled={!selectedSectionId}
            />
          </Form.Item>

          <Form.Item
            label="Loại bài tập"
            name="type"
            rules={[{ required: true, message: "Vui lòng chọn loại bài tập" }]}
          >
            <Radio.Group>
              <Radio value="multiple-choice">Trắc nghiệm</Radio>
              <Radio value="essay">Tự luận</Radio>
              <Radio value="case-study">Case Study</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item
            label="Nội dung câu hỏi / Đề bài"
            name="content"
            rules={[
              { required: true, message: "Vui lòng nhập nội dung câu hỏi" },
            ]}
          >
            <Input.TextArea rows={4} placeholder="Nhập nội dung câu hỏi..." />
          </Form.Item>
          {questionType === "multiple-choice" && (
            <div className="options-container">
              <Form.Item name="correctOptionIndex" hidden>
                <Input />
              </Form.Item>
              <p style={{ fontWeight: 500, marginBottom: 8 }}>Các lựa chọn:</p>
              <Form.List name="options">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }, index) => (
                      <Row
                        key={key}
                        gutter={8}
                        align="middle"
                        style={{ marginBottom: 8 }}
                      >
                        <Col flex="auto">
                          <Form.Item
                            {...restField}
                            name={[name, "text"]}
                            rules={[
                              {
                                required: true,
                                message: "Nhập nội dung đáp án",
                              },
                            ]}
                            noStyle
                          >
                            <Input placeholder={`Đáp án ${index + 1}`} />
                          </Form.Item>
                        </Col>
                        <Col>
                          <Radio
                            checked={correctOptionIndex === name}
                            onChange={() =>
                              form.setFieldValue("correctOptionIndex", name)
                            }
                          >
                            Đúng
                          </Radio>
                        </Col>
                        <Col>
                          <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleRemoveOption(name, remove)}
                          />
                        </Col>
                      </Row>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Thêm đáp án
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
            </div>
          )}
          {questionType === "case-study" && (
            <div className="media-container">
              <Divider orientation="left">Media (Hình ảnh / Video)</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="media_type"
                    label="Loại Media"
                    initialValue="image"
                  >
                    <Select>
                      <Select.Option value="image">
                        <PictureOutlined /> Hình ảnh
                      </Select.Option>
                      <Select.Option value="video">
                        <VideoCameraOutlined /> Video
                      </Select.Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={16}>
                  {mediaType === "image" ? (
                    <>
                      <Form.Item name="media_url" hidden>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Upload ảnh"
                        name="mediaUpload"
                        rules={[
                          {
                            validator: async () => {
                              const url = form.getFieldValue("media_url");
                              if (!url) {
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
                            onChange={handleUploadMedia}
                            disabled={uploadingMedia}
                          />
                          {uploadingMedia && <span>Đang upload ảnh...</span>}
                          {previewMedia && (
                            <Image
                              src={previewMedia}
                              width={200}
                              style={{ marginTop: 8, borderRadius: 4 }}
                            />
                          )}
                        </Space>
                      </Form.Item>
                    </>
                  ) : (
                    <Form.Item name="media_url" label="URL Media">
                      <Input placeholder="https://example.com/video.mp4" />
                    </Form.Item>
                  )}
                </Col>
              </Row>
            </div>
          )}

          {/* Logic cho Tự luận & Case Study: Đáp án đúng & Giải thích */}
          {questionType !== "multiple-choice" && (
            <>
              <Form.Item
                label="Đáp án gợi ý (Kết quả mong muốn)"
                name="correct_answer"
                rules={[
                  { required: true, message: "Vui lòng nhập đáp án gợi ý" },
                ]}
              >
                <Input.TextArea rows={3} placeholder="Nhập đáp án gợi ý..." />
              </Form.Item>

              {questionType === "case-study" && (
                <Form.Item
                  label="Giải thích chi tiết"
                  name="explanation"
                  rules={[
                    { required: true, message: "Vui lòng nhập giải thích" },
                  ]}
                >
                  <Input.TextArea
                    rows={4}
                    placeholder="Giải thích tại sao lại có kết quả này..."
                  />
                </Form.Item>
              )}
            </>
          )}

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <Space>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">
                {editingId ? "Cập nhật" : "Thêm mới"}
              </Button>
            </Space>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default StudyAdminComponent;
