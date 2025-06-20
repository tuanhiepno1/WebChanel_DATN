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
  Divider,
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
import React, { useEffect, useState } from "react";
import { fetchOrderHistoryByUserId } from "@api/userApi";
import endPoints from "@routes/router";
import HeaderComponent from "@components/Header";
import FooterComponent from "@components/Footer";
import EditUserModal from "@components/EditUserModal";

const { Text, Title } = Typography;

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState([]);
  const [editVisible, setEditVisible] = useState(false);

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const getOrderTag = (status) => {
    switch (status) {
      case "delivered":
      case "Đã giao":
        return <Tag color="green">Đã giao</Tag>;
      case "shipping":
      case "Đang giao":
        return <Tag color="blue">Đang giao</Tag>;
      case "preparing":
      case "Đang xử lý":
        return <Tag color="orange">Đang xử lý</Tag>;
      case "cart":
        return <Tag color="red">Chưa xác nhận</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không rõ";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (value) => {
    const number = Number(value || 0);
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(number);
  };

  useEffect(() => {
    const loadOrderHistory = async () => {
      if (user?.id_user) {
        const data = await fetchOrderHistoryByUserId(user.id_user);
        setOrderHistory(data);
      }
    };
    loadOrderHistory();
  }, [user?.id_user]);

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
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              marginBottom: 16,
              backgroundColor: "#DBB671",
              borderColor: "#DBB671",
              color: "#000",
            }}
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
                <Button
                  type="primary"
                  style={{
                    marginTop: 16,
                    backgroundColor: "#DBB671",
                    borderColor: "#DBB671",
                    color: "#000",
                  }}
                  onClick={() => setEditVisible(true)}
                >
                  Sửa thông tin
                </Button>
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
                    <PhoneOutlined />{" "}
                    {user.phone
                      ? `0${user.phone}`.replace(/^00+/, "0")
                      : "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Ngày sinh">
                    <CalendarOutlined /> {user.birthday || "Chưa cập nhật"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Địa chỉ">
                    <HomeOutlined /> {user.address || "Chưa cập nhật"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          </Card>

          {/* Đơn hàng đã đặt */}
          <Card
            title={
              <span>
                <ShoppingOutlined /> Lịch sử đơn hàng
              </span>
            }
            bordered
          >
            {orderHistory.length === 0 ? (
              <Text type="secondary">Bạn chưa có đơn hàng nào.</Text>
            ) : (
              <List
                dataSource={orderHistory}
                itemLayout="vertical"
                renderItem={(order) => (
                  <Card
                    key={order.id_order}
                    style={{ marginBottom: 20 }}
                    title={
                      <span>
                        Đơn hàng #{order.id_order} - {getOrderTag(order.status)}{" "}
                        - Ngày: {formatDate(order.order_date)}
                      </span>
                    }
                    extra={
                      <Text strong style={{ color: "#d4380d" }}>
                        Tổng: {formatCurrency(order.total)}
                      </Text>
                    }
                  >
                    <List
                      dataSource={order.orderdatails || []}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            avatar={
                              <img
                                src={`http://localhost:8000/${item.product.image}`}
                                alt={item.product.name}
                                style={{
                                  width: 60,
                                  height: 60,
                                  objectFit: "cover",
                                  borderRadius: 4,
                                }}
                              />
                            }
                            title={item.product.name}
                            description={
                              <>
                                <div>Số lượng: {item.quantity}</div>
                                <div>
                                  Đơn giá: {formatCurrency(item.product.price)}
                                </div>
                                <div>
                                  Loại: {item.product.type || "Không rõ"}
                                </div>
                              </>
                            }
                          />
                        </List.Item>
                      )}
                    />
                  </Card>
                )}
              />
            )}
          </Card>
          <EditUserModal
            visible={editVisible}
            onClose={() => setEditVisible(false)}
            user={user}
            onSuccess={() => {
              setEditVisible(false);
            }}
          />
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default UserProfile;
