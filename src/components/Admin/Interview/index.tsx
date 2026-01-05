import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Card,
  Typography,
  Tag,
  Segmented,
  Select,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  QuestionCircleOutlined,
  AppstoreAddOutlined,
  BarsOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import {
  type IMarket,
  type ILevel,
  type ITopic,
  type ISection,
  type IQuestion,
  getTopicsAPI,
  createTopicAPI,
  updateTopicAPI,
  deleteTopicAPI,
  getSectionsByTopicAPI,
  createSectionAPI,
  updateSectionAPI,
  deleteSectionAPI,
  getQuestionsBySectionAPI,
  createQuestionAPI,
  updateQuestionAPI,
  deleteQuestionAPI,
} from "../../../api/interview";
import "./style.scss";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

const LEVELS: ILevel[] = ["Entry", "Junior", "Middle", "Senior", "Expert"];
const DEFAULT_TOPICS: ITopic[] = [
  { id: 1, name: "Phân tích kỹ thuật", market: "crypto" },
  { id: 2, name: "Quản lý rủi ro", market: "crypto" },
  { id: 3, name: "Tâm lý giao dịch", market: "crypto" },
  { id: 4, name: "Tin tức & vĩ mô", market: "crypto" },
  { id: 5, name: "Phân tích kỹ thuật", market: "gold" },
  { id: 6, name: "Quản lý rủi ro", market: "gold" },
  { id: 7, name: "Tâm lý giao dịch", market: "gold" },
  { id: 8, name: "Tin tức & vĩ mô", market: "gold" },
];
const DEFAULT_SECTIONS: ISection[] = [
  { id: 1, topic_id: 1, name: "Price Action" },
  { id: 2, topic_id: 1, name: "Mô hình nến" },
  { id: 3, topic_id: 1, name: "Kháng cự/Hỗ trợ" },
  { id: 4, topic_id: 1, name: "Trendline" },
  { id: 5, topic_id: 1, name: "Fibonacci" },
  { id: 6, topic_id: 1, name: "RSI" },
  { id: 7, topic_id: 1, name: "MACD" },
  { id: 8, topic_id: 5, name: "Price Action" },
  { id: 9, topic_id: 5, name: "Mô hình nến" },
];
const DEFAULT_QUESTIONS: IQuestion[] = [
  {
    id: 1,
    section_id: 1,
    question: "Price Action là gì và nguyên lý cốt lõi?",
    answer:
      "Phân tích hành động giá dựa trên cấu trúc thị trường, vùng cung cầu và phản ứng của nến.",
    level: "Entry",
  },
  {
    id: 2,
    section_id: 1,
    question: "Cấu trúc thị trường gồm những thành phần nào?",
    answer: "Xu hướng, vùng tích lũy, vùng quay đầu, và điểm phá vỡ.",
    level: "Junior",
  },
  {
    id: 3,
    section_id: 2,
    question: "Mô hình nến đảo chiều mạnh thường gặp?",
    answer: "Engulfing, Pin Bar, Morning Star, Evening Star.",
    level: "Middle",
  },
];

const InterviewAdminComponent = () => {
  const [market, setMarket] = useState<IMarket>("crypto");
  const [topics, setTopics] = useState<ITopic[]>([]);
  const [sections, setSections] = useState<ISection[]>([]);
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(
    null
  );
  const [levelFilter, setLevelFilter] = useState<"All" | ILevel>("All");
  const [loading, setLoading] = useState(false);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [questionModalOpen, setQuestionModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<ITopic | null>(null);
  const [editingSection, setEditingSection] = useState<ISection | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<IQuestion | null>(
    null
  );
  const [topicForm] = Form.useForm();
  const [sectionForm] = Form.useForm();
  const [questionForm] = Form.useForm();

  const visibleTopics = useMemo(
    () => topics.filter((t) => t.market === market),
    [topics, market]
  );
  const visibleSections = useMemo(
    () => sections.filter((s) => s.topic_id === selectedTopicId),
    [sections, selectedTopicId]
  );
  const visibleQuestions = useMemo(() => {
    const base = questions.filter((q) => q.section_id === selectedSectionId);
    if (levelFilter === "All") return base;
    return base.filter((q) => q.level === levelFilter);
  }, [questions, selectedSectionId, levelFilter]);

  const initMock = () => {
    setTopics(DEFAULT_TOPICS);
    setSections(DEFAULT_SECTIONS);
    setQuestions(DEFAULT_QUESTIONS);
    setSelectedTopicId(
      DEFAULT_TOPICS.find((t) => t.market === market)?.id || null
    );
    setSelectedSectionId(
      DEFAULT_SECTIONS.find((s) => s.topic_id === selectedTopicId || 1)?.id ||
        null
    );
  };

  const loadTopics = async () => {
    setLoading(true);
    const res = await getTopicsAPI();
    if (res.err === 0 && Array.isArray(res.data) && res.data.length) {
      setTopics(res.data);
      const first = (res.data as ITopic[]).find((t) => t.market === market);
      setSelectedTopicId(first?.id || null);
    } else {
      setTopics(DEFAULT_TOPICS);
      const first = DEFAULT_TOPICS.find((t) => t.market === market);
      setSelectedTopicId(first?.id || null);
    }
    setLoading(false);
  };

  const loadSections = async (tid: number | null) => {
    if (!tid) {
      setSections([]);
      setSelectedSectionId(null);
      return;
    }
    setLoading(true);
    const res = await getSectionsByTopicAPI(tid);
    if (res.err === 0 && Array.isArray(res.data)) {
      setSections(res.data);
      setSelectedSectionId(res.data[0]?.id || null);
    } else {
      const list = DEFAULT_SECTIONS.filter((s) => s.topic_id === tid);
      setSections(list);
      setSelectedSectionId(list[0]?.id || null);
    }
    setLoading(false);
  };

  const loadQuestions = async (sid: number | null) => {
    if (!sid) {
      setQuestions([]);
      return;
    }
    setLoading(true);
    const res = await getQuestionsBySectionAPI(sid);
    if (res.err === 0 && Array.isArray(res.data)) {
      setQuestions(res.data);
    } else {
      setQuestions(DEFAULT_QUESTIONS.filter((q) => q.section_id === sid));
    }
    setLoading(false);
  };

  useEffect(() => {
    initMock();
    loadTopics();
  }, [market]);

  useEffect(() => {
    loadSections(selectedTopicId);
  }, [selectedTopicId]);

  useEffect(() => {
    loadQuestions(selectedSectionId);
  }, [selectedSectionId]);

  const handleOpenTopicModal = (topic?: ITopic) => {
    setEditingTopic(topic || null);
    topicForm.resetFields();
    if (topic) topicForm.setFieldsValue(topic);
    else topicForm.setFieldsValue({ market });
    setTopicModalOpen(true);
  };

  const handleOpenSectionModal = (section?: ISection) => {
    setEditingSection(section || null);
    sectionForm.resetFields();
    if (section) sectionForm.setFieldsValue(section);
    else sectionForm.setFieldsValue({ topic_id: selectedTopicId });
    setSectionModalOpen(true);
  };

  const handleOpenQuestionModal = (question?: IQuestion) => {
    setEditingQuestion(question || null);
    questionForm.resetFields();
    if (question) questionForm.setFieldsValue(question);
    else
      questionForm.setFieldsValue({
        section_id: selectedSectionId,
        level: "Entry",
      });
    setQuestionModalOpen(true);
  };

  const onSubmitTopic = async () => {
    const values = await topicForm.validateFields();
    if (editingTopic?.id) {
      const res = await updateTopicAPI(editingTopic.id, values);
      if (res.err === 0) {
        message.success("Cập nhật mục thành công");
        await loadTopics();
      } else {
        setTopics((prev) =>
          prev.map((t) => (t.id === editingTopic.id ? { ...t, ...values } : t))
        );
      }
    } else {
      const res = await createTopicAPI(values);
      if (res.err === 0) {
        message.success("Thêm mục thành công");
        await loadTopics();
      } else {
        const newId =
          Math.max(...topics.map((t) => t.id || 0), 0) + 1 || Date.now();
        setTopics((prev) => [...prev, { ...values, id: newId }]);
      }
    }
    setTopicModalOpen(false);
  };

  const onSubmitSection = async () => {
    const values = await sectionForm.validateFields();
    if (editingSection?.id) {
      const res = await updateSectionAPI(editingSection.id, values);
      if (res.err === 0) {
        message.success("Cập nhật phần thành công");
        await loadSections(values.topic_id);
      } else {
        setSections((prev) =>
          prev.map((s) =>
            s.id === editingSection.id ? { ...s, ...values } : s
          )
        );
      }
    } else {
      const res = await createSectionAPI(values);
      if (res.err === 0) {
        message.success("Thêm phần thành công");
        await loadSections(values.topic_id);
      } else {
        const newId =
          Math.max(...sections.map((s) => s.id || 0), 0) + 1 || Date.now();
        setSections((prev) => [...prev, { ...values, id: newId }]);
      }
    }
    setSectionModalOpen(false);
  };

  const onSubmitQuestion = async () => {
    const values = await questionForm.validateFields();
    if (editingQuestion?.id) {
      const res = await updateQuestionAPI(editingQuestion.id, values);
      if (res.err === 0) {
        message.success("Cập nhật câu hỏi thành công");
        await loadQuestions(values.section_id);
      } else {
        setQuestions((prev) =>
          prev.map((q) =>
            q.id === editingQuestion.id ? { ...q, ...values } : q
          )
        );
      }
    } else {
      const res = await createQuestionAPI(values);
      if (res.err === 0) {
        message.success("Thêm câu hỏi thành công");
        await loadQuestions(values.section_id);
      } else {
        const newId =
          Math.max(...questions.map((q) => q.id || 0), 0) + 1 || Date.now();
        setQuestions((prev) => [...prev, { ...values, id: newId }]);
      }
    }
    setQuestionModalOpen(false);
  };

  const deleteTopic = async (id: number) => {
    const res = await deleteTopicAPI(id);
    if (res.err === 0) {
      message.success("Xóa mục thành công");
      await loadTopics();
    } else {
      setTopics((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const deleteSection = async (id: number) => {
    const res = await deleteSectionAPI(id);
    if (res.err === 0) {
      message.success("Xóa phần thành công");
      await loadSections(selectedTopicId!);
    } else {
      setSections((prev) => prev.filter((s) => s.id !== id));
      if (selectedSectionId === id) setSelectedSectionId(null);
    }
  };

  const deleteQuestion = async (id: number) => {
    const res = await deleteQuestionAPI(id);
    if (res.err === 0) {
      message.success("Xóa câu hỏi thành công");
      await loadQuestions(selectedSectionId!);
    } else {
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    }
  };

  const questionColumns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    {
      title: "Câu hỏi",
      dataIndex: "question",
      key: "question",
      render: (text: string) => <b style={{ color: "#1890ff" }}>{text}</b>,
    },
    {
      title: "Câu trả lời",
      dataIndex: "answer",
      key: "answer",
      ellipsis: true,
      render: (text: string) => (
        <div
          style={{
            maxWidth: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      render: (lv: ILevel) => (
        <Tag
          color={
            lv === "Entry"
              ? "blue"
              : lv === "Junior"
              ? "green"
              : lv === "Middle"
              ? "gold"
              : lv === "Senior"
              ? "orange"
              : "red"
          }
        >
          {lv}
        </Tag>
      ),
      width: 120,
    },
    {
      title: "Hành động",
      key: "action",
      width: 170,
      render: (_: any, record: IQuestion) => (
        <Space size="middle">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleOpenQuestionModal(record)}
          />
          <Popconfirm
            title="Xóa câu hỏi?"
            onConfirm={() => deleteQuestion(record.id!)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="interview-admin">
      <Card>
        <div className="header-actions">
          <Title level={3}>
            <QuestionCircleOutlined /> Quản lý câu hỏi phỏng vấn
          </Title>
          <div className="header-actions__right">
            <Segmented
              value={market}
              onChange={(val) => setMarket(val as IMarket)}
              options={[
                { label: "Crypto", value: "crypto" },
                { label: "Vàng", value: "gold" },
              ]}
            />
            <Button
              type="primary"
              icon={<AppstoreAddOutlined />}
              onClick={() => handleOpenTopicModal()}
              style={{ marginLeft: 8 }}
            >
              Thêm mục
            </Button>
            <Button
              icon={<BarsOutlined />}
              onClick={() => handleOpenSectionModal()}
              style={{ marginLeft: 8 }}
              disabled={!selectedTopicId}
            >
              Thêm phần
            </Button>
            <Button
              icon={<FileTextOutlined />}
              onClick={() => handleOpenQuestionModal()}
              style={{ marginLeft: 8 }}
              disabled={!selectedSectionId}
            >
              Thêm câu hỏi
            </Button>
          </div>
        </div>

        <div className="topics-grid">
          {visibleTopics.map((t) => {
            const active = selectedTopicId === t.id;
            return (
              <div
                key={t.id}
                className={`topic-item ${active ? "active" : ""}`}
                onClick={() => setSelectedTopicId(t.id!)}
              >
                <span className="topic-name">{t.name}</span>
                <Space>
                  <Button
                    size="small"
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenTopicModal(t);
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa mục?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      deleteTopic(t.id!);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <Button size="small" type="link" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              </div>
            );
          })}
        </div>

        <div className="sections-row">
          {visibleSections.map((s) => {
            const active = selectedSectionId === s.id;
            return (
              <Tag
                key={s.id}
                className={`section-tag ${active ? "active" : ""}`}
                onClick={() => setSelectedSectionId(s.id!)}
              >
                <Space>
                  <span>{s.name}</span>
                  <Button
                    size="small"
                    type="link"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenSectionModal(s);
                    }}
                  >
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa phần?"
                    onConfirm={(e) => {
                      e?.stopPropagation();
                      deleteSection(s.id!);
                    }}
                    onCancel={(e) => e?.stopPropagation()}
                  >
                    <Button size="small" type="link" danger>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              </Tag>
            );
          })}
        </div>

        <div className="questions-filter">
          <Space>
            <Tag
              className={`level-filter ${
                levelFilter === "All" ? "active" : ""
              }`}
              onClick={() => setLevelFilter("All")}
            >
              All
            </Tag>
            {LEVELS.map((lv) => (
              <Tag
                key={lv}
                className={`level-filter ${levelFilter === lv ? "active" : ""}`}
                onClick={() => setLevelFilter(lv)}
              >
                {lv}
              </Tag>
            ))}
          </Space>
        </div>

        <Table
          columns={questionColumns}
          dataSource={visibleQuestions}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
        />
      </Card>

      <Modal
        title={editingTopic ? "Chỉnh sửa mục" : "Thêm mục mới"}
        open={topicModalOpen}
        onOk={onSubmitTopic}
        onCancel={() => setTopicModalOpen(false)}
        okText={editingTopic ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={520}
      >
        <Form form={topicForm} layout="vertical">
          <Form.Item
            name="name"
            label="Tên mục"
            rules={[{ required: true, message: "Nhập tên mục" }]}
          >
            <Input placeholder="Ví dụ: Phân tích kỹ thuật" />
          </Form.Item>
          <Form.Item
            name="market"
            label="Thị trường"
            rules={[{ required: true, message: "Chọn thị trường" }]}
          >
            <Select placeholder="Chọn thị trường">
              <Option value="crypto">Crypto</Option>
              <Option value="gold">Vàng</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingSection ? "Chỉnh sửa phần" : "Thêm phần mới"}
        open={sectionModalOpen}
        onOk={onSubmitSection}
        onCancel={() => setSectionModalOpen(false)}
        okText={editingSection ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={520}
      >
        <Form form={sectionForm} layout="vertical">
          <Form.Item
            name="topic_id"
            label="Thuộc mục"
            rules={[{ required: true, message: "Chọn mục" }]}
          >
            <Select placeholder="Chọn mục" value={selectedTopicId || undefined}>
              {visibleTopics.map((t) => (
                <Option key={t.id} value={t.id}>
                  {t.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên phần"
            rules={[{ required: true, message: "Nhập tên phần" }]}
          >
            <Input placeholder="Ví dụ: Price Action" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={editingQuestion ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
        open={questionModalOpen}
        onOk={onSubmitQuestion}
        onCancel={() => setQuestionModalOpen(false)}
        okText={editingQuestion ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
        width={700}
      >
        <Form form={questionForm} layout="vertical">
          <Form.Item
            name="section_id"
            label="Thuộc phần"
            rules={[{ required: true, message: "Chọn phần" }]}
          >
            <Select
              placeholder="Chọn phần"
              value={selectedSectionId || undefined}
            >
              {visibleSections.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="question"
            label="Câu hỏi"
            rules={[{ required: true, message: "Nhập câu hỏi" }]}
          >
            <Input placeholder="Nhập câu hỏi" />
          </Form.Item>
          <Form.Item
            name="answer"
            label="Câu trả lời"
            rules={[{ required: true, message: "Nhập câu trả lời" }]}
          >
            <TextArea rows={6} placeholder="Nhập câu trả lời" />
          </Form.Item>
          <Form.Item
            name="level"
            label="Mức độ"
            rules={[{ required: true, message: "Chọn mức độ" }]}
          >
            <Select placeholder="Chọn mức độ">
              {LEVELS.map((lv) => (
                <Option key={lv} value={lv}>
                  {lv}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InterviewAdminComponent;
