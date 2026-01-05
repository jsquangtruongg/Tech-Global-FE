import "./style.scss";
import Logo from "../../assets/images/antech.png";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";

const FooterLayout = () => {
  return (
    <div className="footer-layout">
      <div className="footer-cta">
        <p className="cta-title">Bạn đã sẵn sàng để trải nghiệm Tech Global?</p>
        <button className="btn-demo">
          Trang chủ <ArrowRightAltIcon className="icon-arrow" />
        </button>
      </div>
      <div className="footer-content">
        <div className="footer-brand">
          <div className="brand-logo">
            <img src={Logo} alt="logo" className="logo-img" />
            <p className="brand-name">Tech Global</p>
          </div>
          <p className="brand-copy">
            Copyright © 2024 Tech Global.
            <br />
            All rights reserved
          </p>
          <div className="social-icons">
            <InstagramIcon className="social-icon" />
            <TwitterIcon className="social-icon" />
            <YouTubeIcon className="social-icon" />
          </div>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <p className="link-title">Công ty</p>
            <a className="link-item">Giới thiệu</a>
            <a className="link-item">Blog</a>
            <a className="link-item">Liên hệ</a>
            <a className="link-item">Pricing</a>
            <a className="link-item">Testimonials</a>
          </div>
          <div className="link-group">
            <p className="link-title">Hỗ trợ</p>
            <a className="link-item">Trung tâm trợ giúp</a>
            <a className="link-item">Chính sách quyền riêng tư</a>
            <a className="link-item">Chính sách bảo mật</a>
            <a className="link-item">Trạng thái</a>
          </div>
          <div className="newsletter">
            <p className="link-title">Cập nhật mới nhất</p>
            <div className="input-email">
              <input type="email" placeholder="Email của bạn" />
              <SendOutlinedIcon className="icon-send" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterLayout;
