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
import { Dropdown, Avatar, Drawer } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  BookOutlined,
  LogoutOutlined,
  ApiOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { postUserActivityAPI } from "../../api/analytics";

const HeaderLayout = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  useEffect(() => {
    const getDeviceInfo = () => {
      const ua = navigator.userAgent || "";
      const isMobile = /Mobi|Android/i.test(ua);
      const isTablet = /iPad|Tablet/i.test(ua);
      const device = isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop";
      let os = "Unknown";
      if (/Windows/i.test(ua)) os = "Windows";
      else if (/Mac OS/i.test(ua)) os = "macOS";
      else if (/Android/i.test(ua)) os = "Android";
      else if (/iPhone|iPad|iPod/i.test(ua)) os = "iOS";
      let browser = "Unknown";
      if (/Chrome\//i.test(ua)) browser = "Chrome";
      else if (/Firefox\//i.test(ua)) browser = "Firefox";
      else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua))
        browser = "Safari";
      else if (/Edg\//i.test(ua)) browser = "Edge";
      return { device, os, browser };
    };

    const recordEvent = () => {
      const { device, os, browser } = getDeviceInfo();
      const ev = { t: Date.now(), device, os, browser };
      const raw = localStorage.getItem("tg_user_events");
      const arr = raw ? JSON.parse(raw) : [];
      arr.push(ev);
      if (arr.length > 500) arr.shift();
      localStorage.setItem("tg_user_events", JSON.stringify(arr));
      const id = user?.userData?.id || user?.id || "guest";
      localStorage.setItem(
        "tg_user_last_active",
        JSON.stringify({ id, ts: ev.t, device, os, browser }),
      );
      postUserActivityAPI({
        userId: id,
        timestamp: new Date(ev.t).toISOString(),
        device,
        os,
        browser,
      });
    };

    const handleActivity = () => {
      recordEvent();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") recordEvent();
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);
    document.addEventListener("visibilitychange", handleVisibility);
    const interval = setInterval(() => {
      if (document.visibilityState === "visible") recordEvent();
    }, 30000);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
      document.removeEventListener("visibilitychange", handleVisibility);
      clearInterval(interval);
    };
  }, [user]);

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
          <p style={{ fontWeight: "bold", margin: 0, color: "#e5e7eb" }}>
            {user?.userData?.name || user?.name || "User"}
          </p>
          <p style={{ fontSize: "12px", color: "#9ca3af", margin: 0 }}>
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
      onClick: () => navigate("/profile"),
    },
    {
      key: "3",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      onClick: () => navigate("/setting"),
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
  const handleClickContact = () => {
    navigate("/contact");
  };
  const handleClickFund = () => {
    navigate("/fund");
  };
  const handleClickTraderDNA = () => {
    navigate("/trader-dna");
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
                      <div
                        className="feature-item"
                        onClick={handleClickTraderDNA}
                      >
                        <TrendingUpOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">Trader DNA</p>
                          <p className="feature-desc">
                            Trắc nghiệm tính cách & chiến lược giao dịch
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
                      <div className="feature-item" onClick={handleClickFund}>
                        <ContentCopyOutlinedIcon className="feature-icon" />
                        <div className="feature-text">
                          <p className="feature-title">Quỹ Giao Dịch Uy Tín</p>
                          <p className="feature-desc">
                            Cách dễ nhất để giao dịch ở mọi thời điểm
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
              <div
                className="header-layout-right__item"
                onClick={handleClickContact}
              >
                <p>Liên hệ</p>
              </div>
            </div>
            {user ? (
              <Dropdown menu={{ items }} trigger={["click"]}>
                <div className="header-layout-user">
                  <span style={{ fontWeight: 500 }}>
                    {[user?.userData?.lastName, user?.userData?.firstName]
                      .filter(Boolean)
                      .join(" ")}
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
          <div
            className="mobile-toggle"
            onClick={() => setMobileOpen(true)}
            aria-label="open menu"
          >
            <MenuOutlined />
          </div>
        </div>
      </div>
      <div className="header-layout-main">
        <Outlet />
      </div>

      <Drawer
        title="Menu"
        placement="right"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <div className="mobile-menu">
          <div className="mobile-menu-item" onClick={() => navigate("/home")}>
            Trang chủ
          </div>
          <div className="mobile-menu-section-title">Tính năng</div>
          <div className="mobile-menu-item" onClick={handleClickXau}>
            Phân Tích
          </div>
          <div className="mobile-menu-item" onClick={handleClickMargin}>
            Top câu hỏi phỏng vấn
          </div>
          <div className="mobile-menu-item" onClick={handleClickCourse}>
            Khóa học
          </div>
          <div className="mobile-menu-item" onClick={handleClickTraderDNA}>
            Trader DNA
          </div>
          <div className="mobile-menu-item" onClick={handleClickBotTrade}>
            Bot giao dịch
          </div>
          <div className="mobile-menu-item" onClick={handleClickFund}>
            Quỹ Giao Dịch Uy Tín
          </div>
          <div className="mobile-menu-item" onClick={handleClickBlog}>
            Bài viết
          </div>
          <div className="mobile-menu-item" onClick={handleClickContact}>
            Liên hệ
          </div>
          {user ? (
            <>
              <div className="mobile-menu-section-title">Tài khoản</div>
              <div
                className="mobile-menu-item"
                onClick={() => navigate("/profile")}
              >
                Thông tin tài khoản
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => navigate("/setting")}
              >
                Cài đặt
              </div>
              <div
                className="mobile-menu-item"
                onClick={() => navigate("/course-user")}
              >
                Khóa học hiện có
              </div>
              {(user?.userData?.roleData?.code === "R1" ||
                user?.userData?.roleData?.code === "R2") && (
                <div
                  className="mobile-menu-item"
                  onClick={() => navigate("/admin/dashboard")}
                >
                  Admin & Quản lý
                </div>
              )}
              <div className="mobile-menu-item danger" onClick={handleLogout}>
                Đăng xuất
              </div>
            </>
          ) : (
            <div className="mobile-menu-item" onClick={handleClickRegister}>
              Đăng ký
            </div>
          )}
        </div>
      </Drawer>
      <FooterLayout />
    </>
  );
};

export default HeaderLayout;
