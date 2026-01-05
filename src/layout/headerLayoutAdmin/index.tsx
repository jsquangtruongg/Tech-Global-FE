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
              <BellOutlined style={{ fontSize: "20px", color: "#5f6368" }} />
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
