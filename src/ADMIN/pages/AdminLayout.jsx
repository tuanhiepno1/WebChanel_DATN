import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
  GiftOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { logoutAndClearCart } from "@features/authSlice";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const username = useSelector(
    (state) => state.auth?.user?.username || "Admin"
  );

  useEffect(() => {
    document.title = "ADMIN Chanel";
  }, []);

  const menuItems = [
    {
      key: "/admin/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: "/admin/category",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/category">Danh mục</Link>,
    },
    {
      key: "/admin/product",
      icon: <ShoppingOutlined />,
      label: <Link to="/admin/product">Sản phẩm</Link>,
    },
    {
      key: "/admin/user",
      icon: <UserOutlined />,
      label: <Link to="/admin/user">Người dùng</Link>,
    },
    {
      key: "/admin/voucher",
      icon: <GiftOutlined />,
      label: <Link to="/admin/voucher">Voucher</Link>,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: <span style={{ color: "#fff" }}>Đăng xuất</span>,
      onClick: () => dispatch(logoutAndClearCart()),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={220}
        style={{
          backgroundColor: "#1f1f1f",
        }}
      >
        <Link
          to="/"
          style={{
            padding: 20,
            fontWeight: "bold",
            fontSize: 20,
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
            color: "#DBB671",
          }}
        >
          <img
            src="/logo3.png"
            alt="logo"
            style={{ width: 60, height: 60, objectFit: "contain" }}
          />
          ADMIN
        </Link>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => {
            if (key === "logout") {
              dispatch(logoutAndClearCart());
            }
          }}
          style={{
            backgroundColor: "#1f1f1f",
            color: "#fff",
            borderRight: "none",
          }}
          items={menuItems.map((item) => ({
            ...item,
            label:
              item.key === "logout" ? (
                item.label
              ) : (
                <Link style={{ color: "#fff" }} to={item.key}>
                  {item.label.props.children}
                </Link>
              ),
            style:
              location.pathname === item.key
                ? {
                    backgroundColor: "#DBB671",
                    color: "#000",
                    fontWeight: "bold",
                  }
                : {
                    transition: "all 0.3s",
                  },
            icon: React.cloneElement(item.icon, {
              style: {
                color: location.pathname === item.key ? "#000" : "#DBB671",
              },
            }),
          }))}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #eee",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              paddingLeft: 16,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <UserOutlined />
            <span>
              Xin chào, <strong>{username}</strong>
            </span>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px",
            background: "#fff",
            padding: 24,
            borderRadius: 8,
            minHeight: 360,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
