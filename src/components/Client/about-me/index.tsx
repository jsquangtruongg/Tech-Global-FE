import "./style.scss";
import { Button, Card, Row, Col, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const AboutMeComponent = () => {
  const navigate = useNavigate();
  return (
    <div className="about-me">
      <div className="about-hero">
        <div className="about-hero__content">
          <h1>Về Tech Global</h1>
          <p>
            Nền tảng tối ưu cho học tập, phân tích và giao dịch. Chúng tôi kết
            hợp dữ liệu, công nghệ và trải nghiệm để mang đến giá trị thực sự
            cho người dùng.
          </p>
          <div className="about-hero__actions">
            <Button type="primary" onClick={() => navigate("/home")}>
              Bắt đầu
            </Button>
            <Button onClick={() => navigate("/contact")}>Liên hệ</Button>
          </div>
        </div>
      </div>

      <div className="about-section">
        <h2>Mục đích của trang web</h2>
        <p className="section-desc">
          Hỗ trợ người dùng học tập, nâng cao năng lực phân tích và áp dụng vào
          thực tiễn thông qua các công cụ, khóa học và tri thức được kiểm chứng.
        </p>
        <div className="cards-grid">
          <Card className="about-card" title="Kiến thức hệ thống">
            Cấu trúc nội dung rõ ràng, cập nhật liên tục, phù hợp nhiều cấp độ
            từ cơ bản đến nâng cao.
          </Card>
          <Card className="about-card" title="Công cụ và dữ liệu">
            Bộ công cụ trực quan và dữ liệu đáng tin cậy giúp ra quyết định
            nhanh và chính xác.
          </Card>
          <Card className="about-card" title="Cộng đồng và hỗ trợ">
            Kết nối cộng đồng người dùng, chuyên gia; hỗ trợ đa kênh, phản hồi
            nhanh chóng.
          </Card>
        </div>
      </div>

      <div className="about-section">
        <h2>Lợi ích mang lại</h2>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12} lg={8}>
            <Card className="about-card" title="Tiết kiệm thời gian">
              Tối ưu quy trình học và làm việc, giảm công việc lặp lại.
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="about-card" title="Nâng cao hiệu suất">
              Tập trung vào giá trị cốt lõi, loại bỏ nhiễu và sai lệch thông
              tin.
            </Card>
          </Col>
          <Col xs={24} md={12} lg={8}>
            <Card className="about-card" title="Ra quyết định tốt hơn">
              Dựa trên dữ liệu, insight và công cụ phù hợp từng ngữ cảnh.
            </Card>
          </Col>
        </Row>
      </div>

      <div className="about-section">
        <h2>Người dùng nhận được gì</h2>
        <div className="tags-list">
          <Tag color="green">Khóa học chất lượng</Tag>
          <Tag color="blue">Công cụ phân tích</Tag>
          <Tag color="gold">Tài nguyên cập nhật</Tag>
          <Tag color="purple">Hỗ trợ 1-1</Tag>
          <Tag color="cyan">Lộ trình học tập</Tag>
        </div>
      </div>

      <div className="about-section">
        <h2>Sứ mệnh</h2>
        <p className="section-desc">
          Đưa công nghệ và tri thức đến gần hơn với mọi người; tạo ra hệ sinh
          thái học tập – phân tích – ứng dụng bền vững, minh bạch và hiệu quả.
        </p>
      </div>

      <div className="about-section">
        <h2>Giá trị cốt lõi</h2>
        <div className="cards-grid">
          <Card className="about-card" title="Minh bạch">
            Thông tin rõ ràng, có thể kiểm chứng.
          </Card>
          <Card className="about-card" title="Tin cậy">
            Dữ liệu và công cụ đáng tin để ra quyết định.
          </Card>
          <Card className="about-card" title="Liên tục">
            Cải tiến sản phẩm và nội dung không ngừng.
          </Card>
        </div>
      </div>

      <div className="about-section">
        <h2>Lộ trình phát triển</h2>
        <div className="roadmap">
          <div className="roadmap-item">
            <h4>Giai đoạn 1</h4>
            <p>Tối ưu khóa học, tài nguyên và trải nghiệm học tập.</p>
          </div>
          <div className="roadmap-item">
            <h4>Giai đoạn 2</h4>
            <p>
              Mở rộng bộ công cụ phân tích, tích hợp dữ liệu thời gian thực.
            </p>
          </div>
          <div className="roadmap-item">
            <h4>Giai đoạn 3</h4>
            <p>
              Xây dựng cộng đồng chuyên sâu, chương trình hỗ trợ nghề nghiệp.
            </p>
          </div>
        </div>
      </div>

      <div className="about-cta">
        <h3>Tham gia cùng Tech Global</h3>
        <p>
          Cùng xây dựng hệ sinh thái tri thức và công cụ hữu ích cho mọi người.
        </p>
        <div className="about-cta__actions">
          <Button type="primary" onClick={() => navigate("/register")}>
            Đăng ký ngay
          </Button>
          <Button onClick={() => navigate("/contact")}>Liên hệ</Button>
        </div>
      </div>
    </div>
  );
};

export default AboutMeComponent;
