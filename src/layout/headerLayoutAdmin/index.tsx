import "./style.scss";
import logo from "../../assets/images/antech.png";
import { Outlet, useNavigate } from "react-router-dom";
import { Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { postUserActivityAPI } from "../../api/analytics";
import NavBarLayoutAdmin from "../NavBarLayoutAdmin";

const HeaderLayoutAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const profile = localStorage.getItem("profile");
    if (profile) {
      setUser(JSON.parse(profile));
    } else {
      // Nếu chưa login thì chuyển về trang login
      navigate("/login");
    }
  }, [navigate]);

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
      else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = "Safari";
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
        JSON.stringify({ id, ts: ev.t, device, os, browser })
      );
      postUserActivityAPI({
        userId: id,
        timestamp: new Date(ev.t).toISOString(),
        device,
        os,
        browser,
      });
    };
    const handleActivity = () => recordEvent();
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
      key: "0",
      label: (
        <div style={{ padding: "4px 0" }}>
          <p style={{ fontWeight: "bold", margin: 0 }}>
            {user?.userData?.name || user?.name || "Admin"}
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
      key: "1",
      label: "Cài đặt hệ thống",
      icon: <SettingOutlined />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <>
      <div className="header-layout-admin">
        <div className="header-container">
          <div className="header-container__logo">
            <img src={logo} alt="logo" className="logo" />
            <p className="header-container__logo__title">
              Tech Global <span>Admin</span>
            </p>
          </div>
          
          <div className="header-container__right">
            <div className="header-icon" style={{ cursor: "pointer", marginRight: "10px" }}>
              <BellOutlined style={{ fontSize: 20 }} />
            </div>
            
            <Dropdown menu={{ items }} trigger={["click"]}>
              <div className="header-user">
                <span style={{ fontWeight: 500 }}>
                  {user?.userData?.name || user?.name || "Admin"}
                </span>
                <Avatar
                  src={user?.userData?.avatar || user?.avatar}
                  icon={<UserOutlined />}
                />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 70px)" }}>
        <NavBarLayoutAdmin />
        <div
          className="admin-content"
          style={{
            flex: 1,
            marginLeft: "300px",
            width: "calc(100% - 280px)",
            backgroundColor: "#f5f5f5",
            padding: "20px",
            transition: "all 0.3s ease",
          }}
        >
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default HeaderLayoutAdmin;
