import "./style.scss";
import { useEffect, useMemo, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import SchoolIcon from "@mui/icons-material/School";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCourseDetailAPI,
  type ICourse,
  type ISection,
} from "../../../api/course";
import { addToCartAPI } from "../../../api/cart";
import { message, notification, App as AntdApp } from "antd";

const CourseDetailComponent = () => {
  const navigate = useNavigate();
  const { notification: apiNotification } = AntdApp.useApp();
  const { id } = useParams();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleClickRegister = () => {
    navigate("/register-study", { state: { courseId: course?.id } });
  };

  const handleAddToWishlist = async () => {
    if (!course?.id) return;
    if (isWishlisted) return;

    try {
      const res = await addToCartAPI(course.id);
      // Kiểm tra cả err = 0 và mes chứa "thành công"
      if (
        res.err === 0 ||
        (res.mes && res.mes.toLowerCase().includes("thành công"))
      ) {
        apiNotification.success({
          message: "Thêm vào yêu thích thành công",
          placement: "topRight",
        });
        setIsWishlisted(true);
      } else {
        // Xử lý trường hợp đã tồn tại
        if (
          res.mes &&
          (res.mes.toLowerCase().includes("exist") ||
            res.mes.toLowerCase().includes("tồn tại"))
        ) {
          apiNotification.info({
            message: "Khóa học này đã có trong danh sách yêu thích của bạn",
            placement: "topRight",
          });
          setIsWishlisted(true);
        } else {
          message.warning(res.mes);
        }
      }
    } catch (error) {
      console.error("Add wishlist error:", error);
      message.error("Lỗi khi thêm vào yêu thích");
    }
  };

  type TabKey = "overview" | "curriculum" | "instructor" | "reviews";

  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([1]));
  const getYoutubeId = (url: string) => {
    const m =
      url.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{11})/) ||
      url.match(/\/embed\/([A-Za-z0-9_-]{11})/);
    return m ? m[1] : null;
  };
  const videoId = useMemo(
    () => (course?.video_demo ? getYoutubeId(course.video_demo) : null),
    [course]
  );
  const totalLessons = useMemo(() => {
    if (!course) return 0;
    if (course.sections && course.sections.length > 0) {
      return course.sections.reduce(
        (sum, sec) => sum + (sec.lessons ? sec.lessons.length : 0),
        0
      );
    }
    return course.lessons_count || 0;
  }, [course]);

  useEffect(() => {
    const fetchCourseDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getCourseDetailAPI(+id);
        if (res.err === 0 && res.data) {
          setCourse(res.data);
          if (res.data.sections && res.data.sections.length > 0) {
            setOpenSections(new Set([res.data.sections[0].id!]));
          }
        }
      } catch (error) {
        console.error("Failed to fetch course detail", error);
      }
      setLoading(false);
    };
    fetchCourseDetail();
  }, [id]);

  const toggleSection = (id: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (loading) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  if (!course) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        Không tìm thấy khóa học
      </div>
    );
  }

  return (
    <div className="course-detail-page">
      <div className="detail-header">
        <div className="breadcrumb">Khóa học / {course.category}</div>
        <h1 className="detail-title">{course.title}</h1>
        <p className="detail-desc">{course.desc}</p>
      </div>

      <div className="detail-body">
        <div className="detail-left">
          <div className="preview-box">
            <div
              className={`preview-thumb ${
                course.video_demo && getYoutubeId(course.video_demo)
                  ? "has-video"
                  : ""
              }`}
            >
              {course.video_demo && getYoutubeId(course.video_demo) ? (
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeId(
                    course.video_demo
                  )}`}
                  title="Video demo"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                    border: "none",
                  }}
                />
              ) : (
                <SchoolIcon className="preview-icon" />
              )}
            </div>
          </div>

          <div className="tabs">
            <button
              className={`tab ${activeTab === "overview" ? "active" : ""}`}
              onClick={() => setActiveTab("overview")}
            >
              Tổng quan
            </button>
            <button
              className={`tab ${activeTab === "curriculum" ? "active" : ""}`}
              onClick={() => setActiveTab("curriculum")}
            >
              Nội dung
            </button>
            <button
              className={`tab ${activeTab === "instructor" ? "active" : ""}`}
              onClick={() => setActiveTab("instructor")}
            >
              Giảng viên
            </button>
            <button
              className={`tab ${activeTab === "reviews" ? "active" : ""}`}
              onClick={() => setActiveTab("reviews")}
            >
              Đánh giá
            </button>
          </div>

          {activeTab === "overview" && (
            <div className="tab-pane overview-pane">
              <div className="overview-grid">
                <div className="overview-card">
                  <h3 className="card-title">Bạn sẽ học được</h3>
                  <ul className="bullet-list">
                    <li>Nhận diện cấu trúc và vùng giá quan trọng</li>
                    <li>Áp dụng mô hình nến trong thực chiến</li>
                    <li>Quản lý lệnh, tối ưu điểm vào/ra</li>
                    <li>Xây dựng nhật ký giao dịch cá nhân</li>
                  </ul>
                </div>
                <div className="overview-card">
                  <h3 className="card-title">Yêu cầu trước khi học</h3>
                  <ul className="bullet-list">
                    <li>Kiến thức cơ bản về thị trường</li>
                    <li>Biết sử dụng nền tảng biểu đồ</li>
                    <li>Tinh thần kỷ luật và kiên nhẫn</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="tab-pane curriculum-pane">
              {course.sections &&
                course.sections.map((sec) => {
                  const open = openSections.has(sec.id!);
                  return (
                    <div
                      key={sec.id}
                      className={`section-card ${open ? "open" : ""}`}
                    >
                      <button
                        className="section-header"
                        onClick={() => toggleSection(sec.id!)}
                      >
                        <div className="section-title">{sec.title}</div>
                        <div className="section-meta">
                          <PlayCircleOutlineIcon className="meta-icon" />
                          <span>
                            {sec.lessons ? sec.lessons.length : 0} bài
                          </span>
                        </div>
                      </button>
                      <div className="section-content">
                        {sec.lessons &&
                          sec.lessons.map((l) => (
                            <div key={l.id} className="lesson-item">
                              <div className="lesson-left">
                                <PlayCircleOutlineIcon className="lesson-icon" />
                                <span className="lesson-title">{l.title}</span>
                              </div>
                              <div className="lesson-right">
                                {l.preview && (
                                  <span className="preview-pill">Xem thử</span>
                                )}
                                <div className="lesson-time">
                                  <ScheduleIcon className="time-icon" />
                                  <span>{l.duration}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="tab-pane instructor-pane">
              <div className="instructor-card">
                <div className="avatar">
                  {course.instructor?.avatar ? (
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <div className="avatar-circle">
                      {course.instructor?.name
                        ? course.instructor.name.charAt(0).toUpperCase()
                        : "TP"}
                    </div>
                  )}
                </div>
                <div className="instructor-info">
                  <h3 className="instructor-name">
                    {course.instructor?.name || "Trader Pro"}
                  </h3>
                  <p className="instructor-bio">
                    {course.instructor
                      ? "Giảng viên tại Tech Global"
                      : "8+ năm giao dịch thực chiến, tập trung vào Price Action thuần và quản lý rủi ro. Đã đào tạo hơn 2.000 học viên."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="tab-pane reviews-pane">
              <div className="review-card">
                <div className="review-head">
                  <div className="stars">
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                  </div>
                  <span className="reviewer">Nguyễn Văn A</span>
                </div>
                <p className="review-text">
                  Nội dung rõ ràng, thực tế. Phần quản lý lệnh rất giá trị.
                </p>
              </div>
              <div className="review-card">
                <div className="review-head">
                  <div className="stars">
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                    <StarIcon className="star" />
                  </div>
                  <span className="reviewer">Trần B</span>
                </div>
                <p className="review-text">
                  Giảng viên nhiệt tình, bài giảng dễ hiểu. Tuy nhiên cần thêm
                  nhiều ví dụ thực tế hơn.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="detail-right">
          <div className="detail-stats">
            <div className="stat">
              <StarIcon className="stat-icon" />
              <span>{(course.rating || 0).toFixed(1)}</span>
            </div>
            <div className="stat">
              <PlayCircleOutlineIcon className="stat-icon" />
              <span>{totalLessons} bài giảng</span>
            </div>
            <div className="stat">
              <ScheduleIcon className="stat-icon" />
              <span>{course.duration || "0h"}</span>
            </div>
            <div className="stat">
              <span>{course.students || 0} học viên</span>
            </div>
            <div className="badge-levels">{course.level}</div>
          </div>
          <div className="cta-group">
            <button className="btn-primary" onClick={handleClickRegister}>
              Đăng ký học <ArrowForwardIcon className="btn-icon" />
            </button>
            <button
              className="btn-outline"
              onClick={handleAddToWishlist}
              style={
                isWishlisted
                  ? {
                      backgroundColor: "#ffebee",
                      borderColor: "#ff4d4f",
                      color: "#ff4d4f",
                    }
                  : {}
              }
            >
              {isWishlisted ? (
                <FavoriteIcon className="btn-icon" style={{ marginRight: 5 }} />
              ) : (
                <FavoriteBorderIcon
                  className="btn-icon"
                  style={{ marginRight: 5 }}
                />
              )}
              {isWishlisted ? "Đã thêm vào yêu thích" : "Thêm vào yêu thích"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailComponent;
