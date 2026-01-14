import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Layout,
  Button,
  Spin,
  message,
  Collapse,
  Typography,
  Tabs,
  Progress,
  Avatar,
  Empty,
} from "antd";
import {
  LeftOutlined,
  PlayCircleFilled,
  CheckCircleFilled,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import {
  getCourseDetailAPI,
  type ICourse,
  type ILesson,
} from "../../../api/course";
import "./style.scss";

const { Sider, Content, Header } = Layout;
const { Panel } = Collapse;
const { Title, Text, Paragraph } = Typography;

const CourseStudyComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [currentLesson, setCurrentLesson] = useState<ILesson | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetail(Number(id));
    }
  }, [id]);

  const getYoutubeId = (url?: string | null) => {
    if (!url) return null;
    const m =
      url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/) ||
      url.match(/\/embed\/([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  };

  const fetchCourseDetail = async (courseId: number) => {
    setLoading(true);
    try {
      const res = await getCourseDetailAPI(courseId);
      if (res.err === 0 && res.data) {
        setCourse(res.data);
        // Auto select first lesson with video if available
        const sections = res.data.sections || [];
        for (const sec of sections) {
          const lessons = sec.lessons || [];
          const lessonWithVideo = lessons.find((l: ILesson) => !!l.video_url);
          if (lessonWithVideo) {
            setCurrentLesson(lessonWithVideo);
            break;
          }
          if (lessons.length > 0 && !currentLesson) {
            setCurrentLesson(lessons[0]);
          }
        }
      } else {
        message.error(res.mes || "Không thể tải nội dung khóa học");
      }
    } catch (error) {
      message.error("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectLesson = (lesson: ILesson) => {
    setCurrentLesson(lesson);
  };

  if (loading)
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  if (!course)
    return <div className="error-container">Không tìm thấy khóa học</div>;

  const currentVideoId =
    getYoutubeId(currentLesson?.video_url || null) ||
    getYoutubeId(course.video_demo || null);

  const items = [
    {
      key: "1",
      label: "Tổng quan",
      children: (
        <div className="tab-content">
          <Title level={4}>Về bài học này</Title>
          <Paragraph>
            {course.desc || "Chưa có mô tả cho bài học này."}
          </Paragraph>
          <div className="instructor-info">
            <Avatar
              size={40}
              src={
                course.instructor?.avatar ||
                "https://joeschmoe.io/api/v1/random"
              }
            />
            <div className="instructor-detail">
              <Text strong>{course.instructor?.name || "Giảng viên"}</Text>
              <Text type="secondary">Giảng viên tại Tech Global</Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Ghi chú",
      children: (
        <div className="tab-content">
          <Text type="secondary">Tính năng ghi chú đang được phát triển.</Text>
        </div>
      ),
    },
    {
      key: "3",
      label: "Hỏi đáp",
      children: (
        <div className="tab-content">
          <Text type="secondary">Tính năng hỏi đáp đang được phát triển.</Text>
        </div>
      ),
    },
  ];

  return (
    <Layout className="course-study-layout">
      <Header className="study-header">
        <div className="header-left">
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => navigate("/course-user")}
            className="back-btn"
          />
          <div className="logo-text">Tech Global</div>
          <div className="divider">|</div>
          <span className="course-title">{course.title}</span>
        </div>
        <div className="header-right">
          <div className="progress-info">
            <span className="progress-text">Tiến độ 0%</span>
            <Progress
              percent={0}
              showInfo={false}
              strokeColor="#52c41a"
              trailColor="rgba(255,255,255,0.2)"
              size="small"
              style={{ width: 100 }}
            />
          </div>
        </div>
      </Header>
      <Layout hasSider>
        <Content className="study-content-container">
          {currentLesson ? (
            <>
              <div className="video-container-fluid">
                <div className="video-aspect-ratio">
                  {currentVideoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${currentVideoId}`}
                      title={currentLesson.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "column",
                        background: "#f0f2f5",
                        color: "#000",
                      }}
                    >
                      <Empty
                        image={Empty.PRESENTED_IMAGE_SIMPLE}
                        description={
                          <span style={{ fontSize: 16, color: "#888" }}>
                            Video hiện chưa được cập nhật
                          </span>
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="lesson-content-wrapper">
                <div className="lesson-header-info">
                  <Title level={3} style={{ margin: 0 }}>
                    {currentLesson.title}
                  </Title>
                  <Text type="secondary">Cập nhật tháng 10 năm 2025</Text>
                </div>
                <Tabs defaultActiveKey="1" items={items} />
              </div>
            </>
          ) : (
            <div className="empty-lesson">Chọn bài học để bắt đầu</div>
          )}
        </Content>
        <Sider
          width={400}
          theme="light"
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          className="study-sider"
          trigger={null}
          collapsedWidth={0}
        >
          <div className="sider-header">
            <h3>Nội dung khóa học</h3>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
          </div>
          <div className="sider-body">
            <Collapse
              defaultActiveKey={course.sections?.map((_, index) =>
                String(index)
              )}
              ghost
              expandIconPosition="end"
            >
              {course.sections?.map((section, index) => (
                <Panel
                  header={
                    <div className="section-headers">
                      <span className="section-title">{section.title}</span>
                      <span className="section-meta">
                        {section.lessons?.length || 0} bài học
                      </span>
                    </div>
                  }
                  key={index}
                >
                  <ul className="lesson-list">
                    {section.lessons?.map((lesson, lIndex) => {
                      const isActive = currentLesson?.title === lesson.title;
                      return (
                        <li
                          key={lIndex}
                          className={`lesson-item ${isActive ? "active" : ""}`}
                          onClick={() => handleSelectLesson(lesson)}
                        >
                          <div className="lesson-item-inner">
                            <div className="lesson-status">
                              {isActive ? (
                                <PlayCircleFilled />
                              ) : (
                                <CheckCircleFilled className="check-icon" />
                              )}
                            </div>
                            <div className="lesson-info">
                              <span className="lesson-name">
                                {lIndex + 1}. {lesson.title}
                              </span>
                              <div className="lesson-meta">
                                <PlayCircleFilled
                                  style={{ fontSize: 10, marginRight: 4 }}
                                />
                                <span>{lesson.duration}</span>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </Panel>
              ))}
            </Collapse>
          </div>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default CourseStudyComponent;
