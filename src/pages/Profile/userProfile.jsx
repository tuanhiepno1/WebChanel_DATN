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
  message,
  Modal,
  Input,
} from "antd";
import {
  ArrowLeftOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  CalendarOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { fetchOrderHistoryByUserId, cancelOrder } from "@api/userApi";
import { ORDER_STATUS } from "@utils/orderStatus";
import endPoints from "@routes/router";
import HeaderComponent from "@components/Header";
import FooterComponent from "@components/Footer";
import EditUserModal from "@components/EditUserModal";
import ChangePasswordModal from "@components/ChangePasswordModal";

const { Text } = Typography;

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [orderHistory, setOrderHistory] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  // ✅ Chỉ được hủy khi trạng thái là 'ordered'
  const canCancel = (status) => status === "ordered";

  const getOrderTag = (status) => {
    const tagInfo = ORDER_STATUS[status];
    return tagInfo ? (
      <Tag color={tagInfo.color}>{tagInfo.label}</Tag>
    ) : (
      <Tag>{status}</Tag>
    );
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

  const handleCancelOrder = (order) => {
    if (!canCancel(order.status)) {
      message.warning("Chỉ được hủy khi đơn đang ở trạng thái 'Đã đặt hàng'.");
      return;
    }

    const notesRef = { current: "" };

    Modal.confirm({
      title: `Hủy đơn #${order.id_order}?`,
      content: (
        <Input.TextArea
          placeholder="Lý do hủy (tùy chọn)"
          autoSize={{ minRows: 3 }}
          onChange={(e) => (notesRef.current = e.target.value)}
        />
      ),
      okText: "Xác nhận hủy",
      cancelText: "Không",
      okButtonProps: { danger: true },
      async onOk() {
        try {
          await cancelOrder(user.id_user, {
            id_order: order.id_order,
            notes: notesRef.current || "Customer requested cancellation",
          });
          message.success(`Đã hủy đơn #${order.id_order}`);
          // ✅ Cập nhật lại local state về 'cancelled' (không dùng 'cart')
          setOrderHistory((prev) =>
            prev.map((o) =>
              o.id_order === order.id_order ? { ...o, status: "cancelled" } : o
            )
          );
        } catch (err) {
          message.error(err?.response?.data?.message || "Hủy đơn thất bại");
        }
      },
    });
  };

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

          <Card style={{ marginBottom: 24 }}>
            <Row gutter={[32, 32]}>
              <Col xs={24} sm={8} style={{ textAlign: "center" }}>
                <Avatar
                  src={user.image || defaultAvatar}
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

                <Button
                  type="primary"
                  style={{
                    marginTop: 16,
                    marginLeft: 8,
                    backgroundColor: "#DBB671",
                    borderColor: "#DBB671",
                    color: "#000",
                  }}
                  onClick={() => setChangePasswordVisible(true)}
                >
                  Đổi mật khẩu
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

          {/* Lịch sử đơn hàng */}
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
                      <>
                        <Text
                          strong
                          style={{ color: "#d4380d", marginRight: 12 }}
                        >
                          Tổng: {formatCurrency(order.total)}
                        </Text>
                      
                        {canCancel(order.status) && (
                          <Button
                            danger
                            style={{ marginRight: 8 }}
                            onClick={() => handleCancelOrder(order)}
                          >
                            Hủy đơn
                          </Button>
                        )}

                        <Button
                          type="link"
                          onClick={() => navigate(`/order/${order.id_order}`)}
                          style={{
                            backgroundColor: "#DBB671",
                            borderColor: "#DBB671",
                            color: "#000",
                          }}
                        >
                          Xem chi tiết
                        </Button>
                      </>
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
            onSuccess={() => setEditVisible(false)}
          />

          <ChangePasswordModal
            visible={changePasswordVisible}
            onCancel={() => setChangePasswordVisible(false)}
            userId={user.id_user}
          />
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default UserProfile;
