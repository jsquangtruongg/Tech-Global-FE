import React, { useEffect, useState } from "react";
import "./style.scss";
import { Tabs, Spin, Empty, Button, message } from "antd";
import {
  PlayCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  BookOutlined,
  ShoppingCartOutlined,
  SafetyCertificateOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllCoursesAPI, type ICourse } from "../../../api/course";
import { getCartAPI, removeFromCartAPI } from "../../../api/cart";

const CourseUserComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [purchasedCourses, setPurchasedCourses] = useState<ICourse[]>([]);
  const [wishlistCourses, setWishlistCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Fetch mock purchased courses (using all courses for now)
      // In real app, this should be getPurchasedCoursesAPI()
      const courseRes = await getAllCoursesAPI({ limit: "all" });
      if (courseRes.err === 0 && courseRes.data) {
        // Mock: First 2 courses are purchased
        setPurchasedCourses(
          courseRes.data.slice(0, Math.min(2, courseRes.data.length))
        );
      }

      // 2. Fetch real wishlist/cart
      const cartRes = await getCartAPI();
      if (cartRes.err === 0 && cartRes.data) {
        // cartRes.data is Array of CartItem { course: ICourse, ... }
        const carts = cartRes.data.map((item: any) => ({
          ...item.course,
          cart_id: item.id, // Keep track of cart item id if needed, or just use course id
        }));
        setWishlistCourses(carts);
      }
    } catch (error) {
      console.error("Failed to fetch data", error);
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handleContinueLearning = (id: number) => {
    navigate(`/course-detail/${id}`);
  };

  const handleBuyCourse = (id: number) => {
    navigate(`/payment/${id}`);
    message.info("Chuyển đến trang thanh toán...");
  };
const handleCourseStudy = (id: number) => {
    navigate(`/course-study/${id}`);
  };
  const handleRemoveFromWishlist = async (
    courseId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    try {
      const res = await removeFromCartAPI(courseId);
      if (res.err === 0) {
        message.success("Đã xóa khỏi yêu thích");
        // Refresh wishlist
        const cartRes = await getCartAPI();
        if (cartRes.err === 0 && cartRes.data) {
          const carts = cartRes.data.map((item: any) => item.course);
          setWishlistCourses(carts);
        } else {
          setWishlistCourses([]);
        }
      } else {
        message.error(res.mes);
      }
    } catch (error) {
      message.error("Lỗi khi xóa khóa học");
    }
  };

  const renderCourseCard = (
    course: ICourse,
    type: "purchased" | "wishlist"
  ) => {
    const isPurchased = type === "purchased";
    const progress = isPurchased ? Math.floor(Math.random() * 100) : 0;

    return (
      <div
        key={course.id}
        className="course-card"
      //  onClick={() => navigate(`/course-detail/${course.id}`)}
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
              <BookOutlined className="icon" />
              <span>{course.lessons_count || 0} bài học</span>
            </div>
            <div className="meta-item">
              <ClockCircleOutlined className="icon" />
              <span>{course.duration || "0h"}</span>
            </div>
          </div>

          {isPurchased ? (
            <>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-text">Đã hoàn thành {progress}%</div>

              <div className="course-footer">
                <button
                  className="action-btn btn-start"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCourseStudy(course.id!);
                  }}
                >
                  {progress > 0 ? "Tiếp tục học" : "Bắt đầu học"}
                </button>
              </div>
            </>
          ) : (
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
                      }).format(course.price)}
                    </span>
                  </div>
                )}
              </div>
              <div
                className="action-buttons"
                style={{ display: "flex", gap: 8 }}
              >
                <button
                  className="action-btn btn-pay"
                  style={{ flex: 1 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBuyCourse(course.id!);
                  }}
                >
                  Thanh toán
                </button>
                <button
                  className="action-btn btn-remove"
                  style={{
                    width: 36,
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#ffebee",
                    color: "#f44336",
                    border: "1px solid #ffcdd2",
                  }}
                  onClick={(e) => handleRemoveFromWishlist(course.id!, e)}
                  title="Xóa khỏi yêu thích"
                >
                  <DeleteOutlined />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const items = [
    {
      key: "purchased",
      label: (
        <span>
          <SafetyCertificateOutlined /> Khóa học của tôi
        </span>
      ),
      children: (
        <div className="course-grid">
          {purchasedCourses.length > 0 ? (
            purchasedCourses.map((course) =>
              renderCourseCard(course, "purchased")
            )
          ) : (
            <div
              className="no-data"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              <Empty description="Bạn chưa đăng ký khóa học nào" />
              <Button
                type="primary"
                onClick={() => navigate("/course")}
                style={{ marginTop: 16 }}
              >
                Khám phá ngay
              </Button>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "wishlist",
      label: (
        <span>
          <ShoppingCartOutlined /> Giỏ hàng / Yêu thích
        </span>
      ),
      children: (
        <div className="course-grid">
          {wishlistCourses.length > 0 ? (
            wishlistCourses.map((course) =>
              renderCourseCard(course, "wishlist")
            )
          ) : (
            <div
              className="no-data"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: "40px 0",
              }}
            >
              <Empty description="Danh sách trống" />
              <Button
                type="primary"
                onClick={() => navigate("/course")}
                style={{ marginTop: 16 }}
              >
                Tìm khóa học
              </Button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="course-user-page">
      <div className="page-header">
        <h1>Hồ sơ học tập</h1>
        <p>Quản lý khóa học và tiến độ học tập của bạn</p>
      </div>

      <div className="course-tabs">
        {loading ? (
          <div
            className="loading-container"
            style={{ textAlign: "center", padding: "50px 0" }}
          >
            <Spin size="large" tip="Đang tải dữ liệu..." />
          </div>
        ) : (
          <Tabs defaultActiveKey="purchased" items={items} />
        )}
      </div>
    </div>
  );
};

export default CourseUserComponent;
