import "./style.scss";
import {
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  BarChartOutlined,
  FileTextOutlined,
  UpOutlined,
  DownOutlined,
  TeamOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const NavBarLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openKeys, setOpenKeys] = useState<string[]>([]);

  const toggleOpen = (key: string) => {
    setOpenKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <AppstoreOutlined />,
      label: "Tổng quan",
    },
    {
      key: "users",
      icon: <TeamOutlined />,
      label: "Người dùng",
      children: [
        {
          key: "/admin/users/permission",
          label: "Phân quyền",
        },
        {
          key: "/admin/users/list",
          label: "Danh sách",
        },
        {
          key: "/admin/users/admin",
          label: "Admin",
        },
        {
          key: "/admin/users/staff",
          label: "Nhân viên",
        },
        {
          key: "/admin/users/customer",
          label: "Khách hàng",
        },
      ],
    },
    {
      key: "learn",
      icon: <BookOutlined />,
      label: "Học tập",
      children: [
        {
          key: "/admin/course",
          label: "Khóa học",
        },
        {
          key: "/admin/bot-products",
          label: "Bot sản phẩm",
        },

        {
          key: "/admin/interview",
          label: "Phỏng vấn",
        },
        {
          key: "/admin/study",
          label: "Quản lý câu hỏi bài tập",
        },
      ],
    },
    {
      key: "psychology",
      icon: <TeamOutlined />,
      label: "Thư viện",
      children: [
        {
          key: "/admin/psychology",
          label: "Thư viện tâm lý",
        },
        {
          key: "/admin/knowledge",
          label: "Thư viện kiến thức",
        },
      ],
    },
    {
      key: "analysis",
      icon: <TeamOutlined />,
      label: "Phân tích",
      children: [
        {
          key: "/admin/analytics",
          label: "Phân tích thói quen",
        },
        {
          key: "/admin/analytics/feeling",
          label: "Phân tích tâm lý",
        },
      ],
    },
    {
      key: "/admin/post-new",
      icon: <FileTextOutlined />,
      label: "Bài viết",
    },
    {
      key: "/admin/profile",
      icon: <UserOutlined />,
      label: "Cá nhân",
    },
    {
      key: "/admin/settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
    },
  ];

  return (
    <div className="navbar-layout">
      <div className="navbar-container">
        <div className="navbar-menu">
          {menuItems.map((item) => {
            const hasChildren = item.children && item.children.length > 0;
            const isOpen = openKeys.includes(item.key);
            const isActive =
              location.pathname === item.key ||
              (hasChildren &&
                item.children?.some(
                  (child) => location.pathname === child.key,
                ));

            return (
              <div key={item.key} className="navbar-item-group">
                <div
                  className={`navbar-item ${isActive ? "active" : ""}`}
                  onClick={() => {
                    if (hasChildren) {
                      toggleOpen(item.key);
                    } else {
                      navigate(item.key);
                    }
                  }}
                >
                  <div className="navbar-item__content">
                    <div className="navbar-item__icon">{item.icon}</div>
                    <span className="navbar-item__label">{item.label}</span>
                  </div>
                  {hasChildren && (
                    <div className="navbar-item__toggle">
                      {isOpen ? <UpOutlined /> : <DownOutlined />}
                    </div>
                  )}
                </div>

                {hasChildren && (
                  <div className={`navbar-submenu ${isOpen ? "open" : ""}`}>
                    {item.children.map((child) => (
                      <div
                        key={child.key}
                        className={`navbar-item submenu-item ${
                          location.pathname === child.key ? "active" : ""
                        }`}
                        onClick={() => navigate(child.key)}
                      >
                        <span className="navbar-item__label">
                          {child.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NavBarLayout;
