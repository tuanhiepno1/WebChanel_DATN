import React, { useEffect, useState } from "react";
import { Modal, List, Typography, Card, Tag, Row, Col } from "antd";
import { fetchOrderHistoryByUserId } from "@adminApi/userApi";

const { Text } = Typography;

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(Number(value || 0));

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

const OrderHistoryModal = ({ visible, onCancel, user }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      if (user?.id_user) {
        const data = await fetchOrderHistoryByUserId(user.id_user);
        setOrders(data);
      }
    };
    if (visible) load();
  }, [visible, user]);

  return (
    <Modal
      title={`Lịch sử đơn hàng - ${user?.username}`}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={900}
      bodyStyle={{ maxHeight: "70vh", overflowY: "auto", paddingRight: 12 }}
    >
      {orders.length === 0 ? (
        <Text type="secondary">Người dùng chưa có đơn hàng nào.</Text>
      ) : (
        <List
          dataSource={orders}
          renderItem={(order) => (
            <Card
              key={order.id_order}
              style={{ marginBottom: 16 }}
              title={
                <>
                  Đơn #{order.id_order} - {getOrderTag(order.status)} -{" "}
                  <Text type="secondary">{order.order_date}</Text>
                </>
              }
              extra={<Text strong>{formatCurrency(order.total)}</Text>}
            >
              <Row gutter={[16, 16]}>
                {(order.orderdatails || []).map((item) => (
                  <Col xs={24} sm={12} md={8} key={item.id_product}>
                    <Card
                      size="small"
                      bordered
                      bodyStyle={{
                        display: "flex",
                        gap: 12,
                        padding: 12,
                        height: 170,
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <img
                        src={`${import.meta.env.VITE_ASSET_BASE_URL}/${
                          item.product.image
                        }`}
                        alt={item.product.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: "cover",
                          borderRadius: 4,
                          flexShrink: 0,
                        }}
                        onError={(e) =>
                          (e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                        }
                      />
                      <div style={{ flex: 1, overflow: "hidden" }}>
                        <div
                          style={{ fontWeight: 600, wordBreak: "break-word" }}
                        >
                          {item.product.name}
                        </div>
                        <div>Số lượng: {item.quantity}</div>
                        <div>Loại: {item.product.type}</div>
                        <div>Giá: {formatCurrency(item.product.price)}</div>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card>
          )}
        />
      )}
    </Modal>
  );
};

export default OrderHistoryModal;
