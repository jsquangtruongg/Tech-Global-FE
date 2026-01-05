import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPostsAPI, type IPost } from "../../../api/post";
import dayjs from "dayjs";
import bannerBg from "../../../assets/images/Bieu-Do-Gia-Vang-The-Gioi-XAUUSD-1000x563.jpg.webp";
import "./style.scss";

const BlogComponent = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await getAllPostsAPI({ limit: "all" });
        if (res.err === 0 && res.data) {
          // Sort by newest first
          const sortedPosts = Array.isArray(res.data)
            ? res.data.sort(
                (a: IPost, b: IPost) =>
                  dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
              )
            : [];
          setPosts(sortedPosts);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category).filter(Boolean));
    return ["Tất cả", ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "Tất cả" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchText.toLowerCase()) ||
        (post.desc &&
          post.desc.toLowerCase().includes(searchText.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchText, posts]);

  const getReadTime = (content: string) => {
    if (!content) return "1 phút đọc";
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} phút đọc`;
  };

  return (
    <div className="blog-page">
      <div
        className="blog-hero"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Góc Nhìn Thị Trường & Kiến Thức Trading</h1>
          <p>
            Cập nhật xu hướng giá Vàng, tin tức FED và chiến lược giao dịch hiệu
            quả.
          </p>
        </div>
      </div>

      <div className="blog-container">
        {/* Sidebar / Filter */}
        <div className="blog-sidebar">
          <div className="search-box">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="search-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </div>

          <div className="categories">
            <h3>Danh mục</h3>
            <ul>
              {categories.map((cat) => (
                <li
                  key={cat}
                  className={selectedCategory === cat ? "active" : ""}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </li>
              ))}
            </ul>
          </div>

          <div className="newsletter">
            <h3>Đăng ký nhận tin</h3>
            <p>Nhận những bài viết mới nhất qua email.</p>
            <input type="email" placeholder="Email của bạn" />
            <button>Đăng ký</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="blog-main">
          {loading ? (
            <div className="loading-state">Đang tải bài viết...</div>
          ) : (
            <>
              <div className="posts-grid">
                {filteredPosts.map((post) => (
                  <div
                    key={post.id}
                    className="post-card"
                    onClick={() => navigate(`/blog-detail/${post.id}`)}
                  >
                    <div className="post-image">
                      <img
                        src={
                          post.image ||
                          "https://images.unsplash.com/photo-1642543492481-44e81e3914a7?q=80&w=2070&auto=format&fit=crop"
                        }
                        alt={post.title}
                      />
                      <span className="post-category">{post.category}</span>
                    </div>
                    <div className="post-content">
                      <div className="post-meta">
                        <span className="post-date">
                          {dayjs(post.createdAt).format("DD/MM/YYYY")}
                        </span>
                        <span className="post-read-time">
                          • {getReadTime(post.content)}
                        </span>
                      </div>
                      <h3 className="post-title">{post.title}</h3>
                      <p className="post-excerpt">{post.desc}</p>
                      <div className="post-author">
                        <div className="author-avatar">
                          {(post.author || "A").charAt(0)}
                        </div>
                        <span className="author-name">
                          {post.author || "Admin"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!loading && filteredPosts.length === 0 && (
                <div className="no-posts">
                  Không tìm thấy bài viết nào phù hợp.
                </div>
              )}

              {filteredPosts.length > 0 && (
                <div className="pagination">
                  <button disabled>&laquo;</button>
                  <button className="active">1</button>
                  {/* Logic phân trang có thể phát triển thêm sau */}
                  <button>&raquo;</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogComponent;
