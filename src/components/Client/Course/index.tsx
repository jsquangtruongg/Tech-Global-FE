import "./style.scss";
import { useMemo, useState, useEffect } from "react";
import {
  SearchOutlined,
  StarFilled,
  ClockCircleOutlined,
  PlayCircleOutlined,
  ReadOutlined,
  ArrowRightOutlined,
  UserOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllCoursesAPI, type ICourse } from "../../../api/course";
import { Empty, Spin } from "antd";

const CourseComponent = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("Tất cả");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const res = await getAllCoursesAPI({ limit: "all" });
        if (res.err === 0 && res.data) {
          setCourses(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch courses", error);
      }
      setLoading(false);
    };
    fetchCourses();
  }, []);

  const handleClickCourse = (id: number) => {
    navigate(`/course-detail/${id}`);
  };

  const categories = useMemo(() => {
    const cats = new Set(courses.map((c) => c.category).filter(Boolean));
    return [
      { key: "Tất cả", label: "Tất cả" },
      ...Array.from(cats).map((cat) => ({ key: cat, label: cat })),
    ];
  }, [courses]);

  const filtered = useMemo(() => {
    return courses
      .filter(
        (c) => activeCategory === "Tất cả" || c.category === activeCategory
      )
      .filter((c) =>
        c.title.toLowerCase().includes(query.toLowerCase().trim())
      );
  }, [courses, activeCategory, query]);

  return (
    <div className="course-page">
      <div className="course-header">
        <h1 className="course-title">KHÓA HỌC</h1>
        <p className="course-desc">
          Lộ trình học tập dành cho Trader với nội dung hệ thống, có bài giảng,
          bài tập và tổng kết theo từng chủ đề.
        </p>
      </div>

      <div className="course-filters">
        <div className="search-bar">
          <SearchOutlined className="search-icon" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm khóa học..."
          />
        </div>
        <div className="category-pills">
          {categories.map((c) => (
            <button
              key={c.key}
              className={`pill ${activeCategory === c.key ? "active" : ""}`}
              onClick={() => setActiveCategory(c.key)}
            >
              <span className="pill-name">{c.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="course-grid">
        {loading ? (
          <div className="loading-container">
            <Spin size="large" tip="Đang tải khóa học..." />
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((course) => (
            <div
              key={course.id}
              className="course-card"
              onClick={() => handleClickCourse(course.id!)}
            >
              <div className="card-image-wrapper">
                <img
                  src={
                    course.image ||
                    "https://files.fullstack.edu.vn/f8-prod/courses/13/13.png"
                  }
                  alt={course.title}
                  className="course-image"
                />
                <div className="badge-level">{course.level || "Beginner"}</div>
              </div>

              <div className="card-content">
                <h3 className="course-name">{course.title}</h3>

                <div className="course-meta">
                  <div className="meta-item">
                    <PlayCircleOutlined className="icon" />
                    <span>{course.lessons_count || 0} bài</span>
                  </div>
                  <div className="meta-item">
                    <ClockCircleOutlined className="icon" />
                    <span>{course.duration || "0h"}</span>
                  </div>
                  <div className="meta-item">
                    <UserOutlined className="icon" />
                    <span>{course.students || 0}</span>
                  </div>
                </div>

                <div className="course-footer">
                  <div className="price-box">
                    {course.price === 0 ? (
                      <span className="price-free">Miễn phí</span>
                    ) : (
                      <div className="price-group">
                        <span className="current-price">
                          {new Intl.NumberFormat("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          }).format(
                            Math.round(
                              course.price *
                                (1 -
                                  (course.discount ? course.discount : 0) / 100)
                            )
                          )}
                        </span>
                        {course.discount && course.discount > 0 && (
                          <span className="original-price">
                            {new Intl.NumberFormat("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            }).format(course.price)}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="button-group">
                    <button className="btn-view">Chi tiết</button>
                    <button
                      className="btn-register"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/register-study", {
                          state: { courseId: course.id },
                        });
                      }}
                    >
                      Đăng kí
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="no-courses">
            <Empty description="Không tìm thấy khóa học nào phù hợp." />
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseComponent;
