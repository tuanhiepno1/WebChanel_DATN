import React from "react";
import { Layout, Menu, Avatar } from "antd";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  UserOutlined,
  LogoutOutlined,
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
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      onClick: () => dispatch(logoutAndClearCart()),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={220} style={{ background: "#fff" }}>
        {/* Logo + Tên admin */}
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
            color: "inherit",
          }}
        >
          <img
            src="/logo2.png"
            alt="logo"
            style={{ width: 50, height: 50, objectFit: "contain" }}
          />
          ADMIN
        </Link>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
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
          }}
        >
          {/* Lời chào với icon */}
          <div
            style={{
              fontSize: 16,
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

        <Content style={{ margin: "24px", background: "#fff", padding: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
