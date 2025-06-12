import React from "react";
import {
  Card,
  Descriptions,
  Button,
  Avatar,
  Row,
  Col,
  List,
  Typography,
  Tag,
} from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  ShoppingOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import endPoints from "@routes/router";
import HeaderComponent from "@components/Header";
import FooterComponent from "@components/Footer";

const { Text, Title } = Typography;

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const getOrderTag = (status) => {
    switch (status) {
      case "Đã giao":
        return <Tag color="green">{status}</Tag>;
      case "Đang giao":
        return <Tag color="blue">{status}</Tag>;
      case "Đang xử lý":
        return <Tag color="orange">{status}</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // Giả lập đơn hàng
  const mockOrders = [
    {
      id: "001",
      product: "Nước hoa Dior Sauvage",
      date: "10/06/2025",
      status: "Đã giao",
    },
    {
      id: "002",
      product: "Viktor & Rolf Flowerbomb Perfume",
      date: "08/06/2025",
      status: "Đang giao",
    },
    {
      id: "003",
      product: "Narciso Rodriguez for Her",
      date: "06/06/2025",
      status: "Đang xử lý",
    },
  ];

  const shippingAddress =
    user?.shippingAddress ||
    "248A Nơ Trang Long, phường 12, Quận Bình Thạnh, TP. Hồ Chí Minh";

  if (!user) {
    return (
      <>
        <HeaderComponent />
        <div
          style={{
            minHeight: "100vh",
            backgroundColor: "#f5f5f5",
            paddingTop: 100,
            paddingBottom: 100,
          }}
        >
          <Card
            style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}
          >
            <p>Bạn chưa đăng nhập.</p>
            <Button type="primary" onClick={() => navigate(endPoints.LOGIN)}>
              Đăng nhập
            </Button>
          </Card>
        </div>
        <FooterComponent />
      </>
    );
  }

  return (
    <>
      <HeaderComponent />
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "40px 20px 120px",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <Button
            type="link"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{ marginBottom: 16 }}
          >
            Quay lại
          </Button>

          <Card bordered style={{ marginBottom: 24 }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                <Avatar
                  src={user.avatar || defaultAvatar}
                  size={150}
                  style={{ marginBottom: 16 }}
                />
                <div style={{ fontSize: 18, fontWeight: 600 }}>
                  {user?.username}
                </div>
              </Col>

              <Col xs={24} sm={16}>
                <Descriptions column={1} bordered size="middle">
                  <Descriptions.Item label="Giới tính">
                    {user.gender || "Không xác định"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <MailOutlined /> {user.email}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số điện thoại">
                    <PhoneOutlined /> {user.phone || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    <CalendarOutlined /> {user.birthday || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ cá nhân">
                    <HomeOutlined /> {user.address || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ giao hàng">
                    <EnvironmentOutlined /> {shippingAddress}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* Đơn hàng đã đặt */}
          <Card
            title={
              <span>
                <ShoppingOutlined /> Đơn hàng đã đặt
              </span>
            }
            bordered
          >
            <List
              dataSource={mockOrders}
              itemLayout="horizontal"
              renderItem={(order) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Text strong>
                        #{order.id} - {order.product}
                      </Text>
                    }
                    description={
                      <span>
                        Ngày đặt: {order.date} | Trạng thái:{" "}
                        {getOrderTag(order.status)}
                      </span>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default UserProfile;
