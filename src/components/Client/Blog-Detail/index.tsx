import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostDetailAPI, type IPost } from "../../../api/post";
import dayjs from "dayjs";
import { Spin, Breadcrumb, Button } from "antd";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  UserOutlined,
  FolderOutlined,
} from "@ant-design/icons";
import "./style.scss";

const BlogDetailComponent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getPostDetailAPI(Number(id));
        if (res.err === 0 && res.data) {
          setPost(res.data);
        }
      } catch (error) {
        console.error("Failed to fetch post detail", error);
      }
      setLoading(false);
    };

    fetchPostDetail();
    // Scroll to top when entering
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="blog-detail-loading">
        <Spin size="large" tip="Đang tải nội dung..." />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="blog-detail-not-found">
        <h2>Không tìm thấy bài viết</h2>
        <Button type="primary" onClick={() => navigate("/blog")}>
          Quay lại trang Blog
        </Button>
      </div>
    );
  }

  return (
    <div className="blog-detail-page">
      <div className="blog-detail-container">
        <div className="blog-breadcrumb">
          <Breadcrumb
            items={[
              {
                title: (
                  <span onClick={() => navigate("/home")} className="bc-link">
                    Trang chủ
                  </span>
                ),
              },
              {
                title: (
                  <span onClick={() => navigate("/blog")} className="bc-link">
                    Blog
                  </span>
                ),
              },
              { title: post.title },
            ]}
          />
        </div>

        <div className="blog-header">
          <div className="blog-meta-top">
            <span className="blog-category">
              <FolderOutlined /> {post.category}
            </span>
            <span className="blog-date">
              <CalendarOutlined /> {dayjs(post.createdAt).format("DD/MM/YYYY")}
            </span>
          </div>

          <h1 className="blog-title">{post.title}</h1>

          <div className="blog-author">
            <div className="author-avatar">
              <UserOutlined />
            </div>
            <div className="author-info">
              <span className="author-name">{post.author || "Admin"}</span>
              <span className="author-role">Tác giả</span>
            </div>
          </div>
        </div>

        <div className="blog-featured-image">
          <img
            src={
              post.image ||
              "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop"
            }
            alt={post.title}
          />
        </div>

        <div className="blog-content-wrapper">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="blog-footer">
            <div className="blog-tags">
              {/* Nếu có tags thì hiển thị ở đây */}
            </div>

            <div className="blog-navigation">
              <Button
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate("/blog")}
                size="large"
                className="back-btn"
              >
                Quay lại danh sách bài viết
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailComponent;
