import { Layout, Menu, Input, Dropdown } from "antd";
import { ShoppingCartOutlined, UserOutlined } from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "@assets/images/logo2.jpg";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutAndClearCart } from "@features/authSlice";
import { fetchActiveProductCategories } from "@api/productApi";

const { Header } = Layout;
const { Search } = Input;

const HeaderComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const isLoggedIn = !!user;

  const [menuItems, setMenuItems] = useState([]);
  const [selectedKey, setSelectedKey] = useState(null);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categories = await fetchActiveProductCategories();
        const categoryMenu = categories.slice(0, 4).map((cat) => ({
          key: `cat-${cat.slug}`,
          label: cat.category_name.toUpperCase(),
          path: `/category/${cat.slug}`,
        }));

        const fixedItems = [
          {
            key: "news",
            label: "TIN TỨC",
            path: "/tin-tuc",
          },
          {
            key: "contact",
            label: "LIÊN HỆ",
            path: "/lien-he",
          },
        ];

        setMenuItems([...categoryMenu, ...fixedItems]);
      } catch (err) {
        console.error("Không thể tải danh mục:", err);
      }
    };
    loadCategories();
  }, []);

  // Update selected menu key based on current URL
  useEffect(() => {
    const matched = menuItems.find((item) =>
      location.pathname.startsWith(item.path)
    );
    setSelectedKey(matched?.key || null);
  }, [location.pathname, menuItems]);

  const handleLogout = (e) => {
    e?.domEvent?.stopPropagation();
    dispatch(logoutAndClearCart());
    navigate("/");
  };

  const userMenuItems = isLoggedIn
    ? [
        { key: "profile", label: <Link to="/profile">Thông tin cá nhân</Link> },
        { key: "logout", label: "Đăng xuất", onClick: handleLogout },
      ]
    : [{ key: "login", label: <Link to="/login">Đăng nhập</Link> }];

  const handleMenuClick = ({ key }) => {
    const selectedItem = menuItems.find((item) => item.key === key);
    if (selectedItem?.path) {
      navigate(selectedItem.path);
    }
  };

  return (
    <Header style={{ backgroundColor: "white", padding: 0, height: "100px" }}>
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
        <div>
          <Link to="/">
            <img src={logo} alt="Logo" style={{ width: 100, height: 80 }} />
          </Link>
        </div>

        {/* Menu */}
        <div style={{ flex: "1 1 0%" }}>
          <Menu
            theme="light"
            mode="horizontal"
            selectedKeys={selectedKey ? [selectedKey] : []}
            onClick={handleMenuClick}
            style={{
              fontSize: "16px",
              fontWeight: "bold",
              borderBottom: "none",
              justifyContent: "center",
            }}
            items={menuItems}
          />
        </div>

        {/* Search + User + Cart */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            minWidth: "240px",
          }}
        >
          <Search placeholder="Tìm là thấy" style={{ width: 160 }} allowClear />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                maxWidth: 140,
                overflow: "hidden",
              }}
            >
              <UserOutlined style={{ fontSize: 22 }} />
              {isLoggedIn && (
                <span
                  title={user?.username}
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: 100,
                    display: "inline-block",
                  }}
                >
                  {user?.username}
                </span>
              )}
            </div>
          </Dropdown>

          <ShoppingCartOutlined
            onClick={() => navigate("/gio-hang")}
            style={{ fontSize: "28px", cursor: "pointer" }}
          />
        </div>
      </div>
    </Header>
  );
};

export default HeaderComponent;
