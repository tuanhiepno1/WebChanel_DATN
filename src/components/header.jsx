import { Layout, Menu, Input, Dropdown } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import endPoints from "@routes/router";
import logo from "@assets/images/logo2.jpg";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@features/authSlice";

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const menuItems = [
    { key: "1", label: "NƯỚC HOA", path: endPoints.NUOCHOA },
    { key: "2", label: "MẮT KÍNH", path: endPoints.MATKINH },
    { key: "3", label: "ĐỒNG HỒ", path: endPoints.DONGHO },
    { key: "4", label: "TRANG ĐIỂM", path: endPoints.TRANGDIEM },
    { key: "5", label: "TIN TỨC", path: endPoints.TINTUC },
    { key: "6", label: "LIÊN HỆ", path: endPoints.LIENHE },
  ];

  const pathToKeyMap = [
    { path: endPoints.NUOCHOA, key: "1" },
    { path: endPoints.MATKINH, key: "2" },
    { path: endPoints.DONGHO, key: "3" },
    { path: endPoints.TRANGDIEM, key: "4" },
    { path: endPoints.TINTUC, key: "5" },
    { path: endPoints.LIENHE, key: "6" },
  ];

  const selectedKey =
    pathToKeyMap.find((item) => location.pathname.startsWith(item.path))?.key ||
    null;

  const handleLogout = (e) => {
  e?.domEvent?.stopPropagation(); // Ngăn event lan ra ngoài nếu có
  dispatch(logout());
  navigate(endPoints.ALL);
};

  const userMenuItems = isLoggedIn
    ? [
        {
          key: "profile",
          label: <Link to="/profile">Thông tin cá nhân</Link>,
        },
        {
          key: "logout",
          label: "Đăng xuất",
          onClick: handleLogout,
        },
      ]
    : [
        {
          key: "login",
          label: <Link to={endPoints.LOGIN}>Đăng nhập</Link>,
        },
      ];

  const handleMenuClick = ({ key }) => {
    const selectedItem = menuItems.find((item) => item.key === key);
    if (selectedItem?.path) {
      navigate(selectedItem.path);
    }
  };

  return (
    <Header
      style={{
        backgroundColor: "white",
        padding: 0,
        height: "100px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
          gap: "20px",
        }}
      >
        {/* Logo */}
        <div style={{ flex: "0 0 auto" }}>
          <Link to="/" onClick={() => navigate("/")}>
            <img src={logo} alt="Logo" style={{ width: 100, height: 80 }} />
          </Link>
        </div>

        {/* Menu */}
        <div style={{ flex: "1 1 0%", minWidth: 0 }}>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick}
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              borderBottom: "none",
              display: "flex",
              flexWrap: "nowrap",
              justifyContent: "center",
            }}
            items={menuItems}
          />
        </div>

        {/* Search + User + Cart */}
        <div
          style={{
            flex: "0 0 auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "240px",
          }}
        >
          <Search placeholder="Tìm là thấy" style={{ width: 160 }} allowClear />

          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                maxWidth: 140,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              <UserOutlined style={{ fontSize: 22 }} />
              {isLoggedIn && (
                <span style={{ fontWeight: 500 }}>
                  {user?.username}
                </span>
              )}
            </div>
          </Dropdown>

          <ShoppingCartOutlined
            onClick={() => navigate(endPoints.GIOHANG)}
            style={{ fontSize: "28px", cursor: "pointer" }}
          />
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
