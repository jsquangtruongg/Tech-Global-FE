import "./style.scss";
import logo from "../../assets/images/antech.png";
import { Outlet, useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import ApiOutlinedIcon from "@mui/icons-material/ApiOutlined";
import FooterLayout from "../FooterLayoutClient";
import { Dropdown, Avatar, Space } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BookOutlined,
  LogoutOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const HeaderLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("profile");
    setUser(null);
    navigate("/login");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <div style={{ padding: "4px 0" }}>
          <p style={{ fontWeight: "bold", margin: 0 }}>
            {user?.userData?.name || user?.name || "User"}
          </p>
          <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
            {user?.userData?.email || user?.email}
          </p>
        </div>
      ),
      disabled: true,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Thông tin tài khoản",
      icon: <UserOutlined />,
    },
    {
      key: "3",
      label: "Cài đặt",
      icon: <SettingOutlined />,
    },
    {
      key: "4",
      label: "Khóa học hiện có",
      icon: <BookOutlined />,
      onClick: () => navigate("/course-user"),
    },
    ...(user?.userData?.roleData?.code === "R1" ||
    user?.userData?.roleData?.code === "R2"
      ? [
          {
            key: "5",
            label: "Admin & Quản lý",
            icon: <ApiOutlined />,
            onClick: () => navigate("/admin/dashboard"),
          },
        ]
      : []),
    {
      type: "divider",
    },
    {
      key: "6",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  const handleClickXau = () => {
    navigate("/xau");
  };
  const handleClickMargin = () => {
    navigate("/margin");
  };
  const handleClickHome = () => {
    navigate("/home");
  };
  const handleClickCourse = () => {
    navigate("/course");
  };
  const handleClickBlog = () => {
    navigate("/blog");
  };
  const handleClickRegister = () => {
    navigate("/register");
  };
  const handleClickBotTrade = () => {
    navigate("/bot-trade");
  };
  return (
    <>
      <div className="header-layout">
        <div className="header-layout__container">
          <div className="header-layout__container__logo">
            <img src={logo} alt="logo" className="logo" />
            <p className="header-layout__container__logo__title">Tech Global</p>
          </div>
          <div className="header-layout__container__nav">
            <div className="header-layout-right">
              <div
                className="header-layout-right__item"
                onClick={handleClickHome}
              >
                <p>Trang chủ</p>
              </div>
              <div className="header-layout-right__item features">
                <p>Tính năng</p>
                <div className="features-dropdown">
                  <div className="features-grid">
                    <div className="features-section">
                      <p className="section-title">Cơ bản</p>
                      <div className="feature-item" onClick={handleClickXau}>
                        <ShoppingCartOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">Phân Tích</p>
                          <p className="feature-desc">
                            Phân tích chuyến lược và hành vi
                          </p>
                        </div>
                      </div>
                      <div className="feature-item" onClick={handleClickMargin}>
                        <TrendingUpOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">Top câu hỏi phỏng vấn</p>
                          <p className="feature-desc">
                            Hướng dẫn tối đa lợi nhuận bằng đòn bẩy cao
                          </p>
                        </div>
                      </div>
                      <div className="feature-item" onClick={handleClickCourse}>
                        <SwapHorizOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">Khóa học</p>
                          <p className="feature-desc">
                            Cách dễ nhất để giao dịch ở mọi thời điểm
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="features-section">
                      <p className="section-title">Nâng cao</p>
                      <div
                        className="feature-item"
                        onClick={handleClickBotTrade}
                      >
                        <SmartToyOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">Bot giao dịch</p>
                          <p className="feature-desc">
                            Chiến lược tự động đa dạng, nhanh chóng và tin cậy
                          </p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <ContentCopyOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">Sao chép giao dịch</p>
                          <p className="feature-desc">
                            Theo dõi các giao dịch nổi tiếng nhất
                          </p>
                        </div>
                      </div>
                      <div className="feature-item">
                        <ApiOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">API</p>
                          <p className="feature-desc">
                            Tích hợp nhanh với hệ thống của bạn
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="header-layout-right__item"
                onClick={handleClickBlog}
              >
                <p>Bài viết</p>
              </div>
              <div className="header-layout-right__item">
                <p>Liên hệ</p>
              </div>
            </div>
            {user ? (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <div className="header-layout-user">
                  <span style={{ fontWeight: 500 }}>
                    {user?.userData?.name || user?.name}
                  </span>
                  <Avatar
                    src={user?.userData?.avatar || user?.avatar}
                    icon={<UserOutlined />}
                  />
                </div>
              </Dropdown>
            ) : (
              <div className="header-layout-item" onClick={handleClickRegister}>
                <p>Đăng ký</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="header-layout-main">
        <Outlet />
      </div>

      <FooterLayout />
    </>
  );
};

export default HeaderLayout;
