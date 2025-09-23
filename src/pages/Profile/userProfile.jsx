import React, { useEffect, useState } from "react";
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
  Radio,
  Popconfirm,
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

import { fetchOrderHistoryByUserId, cancelOrder } from "@api/userApi";
import {
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from "@api/userApi";
import { ORDER_STATUS } from "@utils/orderStatus";
import endPoints from "@routes/router";
import HeaderComponent from "@components/Header";
import FooterComponent from "@components/Footer";
import EditUserModal from "@components/EditUserModal";
import ChangePasswordModal from "@components/ChangePasswordModal";
import AddressModal from "@components/AddressModal";

const { Text } = Typography;

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [orderHistory, setOrderHistory] = useState([]);
  const [editVisible, setEditVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [addrModalOpen, setAddrModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const defaultAvatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  const canCancel = (status) => status === "ordered";
  const isDelivered = (status) => (status || "").toLowerCase() === "delivered";

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

  // 🔧 Helper an toàn lấy ID địa chỉ
  const getAddressId = (addr) =>
    addr?.id ?? addr?.address_id ?? addr?.id_address ?? addr?._id ?? null;

  // ---- Load dữ liệu
  useEffect(() => {
    const loadOrderHistory = async () => {
      if (!user?.id_user) return;
      const raw = await fetchOrderHistoryByUserId(user.id_user);
      const orders = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];
      const filtered = orders.filter(
        (o) => (o?.status || "").toLowerCase() !== "cart"
      );
      setOrderHistory(filtered);
    };

    const loadAddresses = async () => {
      if (!user?.id_user) return;
      const res = await getUserAddresses(user.id_user);
      if (res.ok) {
        const list = res.data?.addresses || [];
        setAddresses(list);
        const def = list.find(
          (a) => (a.status || "").toLowerCase() === "default"
        );
        setSelectedAddressId(
          def ? getAddressId(def) : list[0] ? getAddressId(list[0]) : null
        );
      } else {
        message.error(res.error || "Không tải được địa chỉ");
      }
    };

    loadOrderHistory();
    loadAddresses();
  }, [user?.id_user]);

  // ---- Address handlers
  const handleSelectAddress = async (addressId) => {
    setSelectedAddressId(addressId);
    // optimistic UI: chỉ 1 default
    setAddresses((prev) =>
      prev.map((a) => {
        const id = getAddressId(a);
        return { ...a, status: id === addressId ? "default" : "none" };
      })
    );
    const res = await updateUserAddress(addressId, { status: "default" });
    if (!res.ok) {
      message.error(res.error || "Đặt mặc định thất bại");
    } else {
      message.success("Đã đặt làm mặc định");
    }
  };

  const openAddAddress = () => {
    setEditingAddress(null);
    setAddrModalOpen(true);
  };

  const submitAddAddress = async (payload) => {
    const res = await createUserAddress(user.id_user, payload);
    if (res.ok) {
      message.success("Đã thêm địa chỉ");
      const r = await getUserAddresses(user.id_user);
      if (r.ok) {
        const list = r.data?.addresses || [];
        setAddresses(list);
        const def = list.find(
          (a) => (a.status || "").toLowerCase() === "default"
        );
        setSelectedAddressId(
          def ? getAddressId(def) : list[0] ? getAddressId(list[0]) : null
        );
      }
      setAddrModalOpen(false);
    } else {
      message.error(res.error || "Thêm địa chỉ thất bại");
    }
  };

  const openEditAddress = (addr) => {
    setEditingAddress(addr);
    setAddrModalOpen(true);
  };

  const submitEditAddress = async (payload) => {
    const res = await updateUserAddress(getAddressId(editingAddress), payload);
    if (res.ok) {
      message.success("Đã cập nhật địa chỉ");
      const r = await getUserAddresses(user.id_user);
      if (r.ok) {
        const list = r.data?.addresses || [];
        setAddresses(list);
        const def = list.find(
          (a) => (a.status || "").toLowerCase() === "default"
        );
        setSelectedAddressId(
          def ? getAddressId(def) : list[0] ? getAddressId(list[0]) : null
        );
      }
      setAddrModalOpen(false);
      setEditingAddress(null);
    } else {
      message.error(res.error || "Cập nhật thất bại");
    }
  };

  const handleDeleteAddress = async (addr) => {
    const id = getAddressId(addr);
    const res = await deleteUserAddress(id);
    if (res.ok) {
      message.success("Đã xóa địa chỉ");
      setAddresses((prev) => prev.filter((a) => getAddressId(a) !== id));
      setSelectedAddressId((prevSelected) => {
        if (prevSelected === id) {
          const nextList = addresses.filter((a) => getAddressId(a) !== id);
          return nextList[0] ? getAddressId(nextList[0]) : null;
        }
        return prevSelected;
      });
    } else {
      message.error(res.error || "Xóa địa chỉ thất bại");
    }
  };

  // ---- Orders
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

  const getProductId = (product) =>
    product?.id_product || product?.id || product?._id || product?.productId;

  const buildProductDetailPath = (productId) =>
    `/category/san-pham/${productId}`;

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

          {/* Địa chỉ giao hàng */}
          <Card
            title="Địa chỉ giao hàng"
            style={{ marginBottom: 24 }}
            extra={
              <Button
                type="primary"
                onClick={openAddAddress}
                style={{
                  backgroundColor: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                }}
              >
                Thêm địa chỉ
              </Button>
            }
          >
            {addresses.length === 0 ? (
              <Text type="secondary">Chưa có địa chỉ. Hãy thêm địa chỉ mới.</Text>
            ) : (
              <Radio.Group
                value={selectedAddressId}
                onChange={(e) => handleSelectAddress(e.target.value)}
                style={{ width: "100%" }}
              >
                <List
                  dataSource={addresses}
                  renderItem={(addr) => {
                    const id = getAddressId(addr);
                    const isDefault =
                      (addr.status || "").toLowerCase() === "default";
                    return (
                      <List.Item
                        key={id}
                        actions={[
                          <Button
                            key="edit"
                            type="link"
                            onClick={() => openEditAddress(addr)}
                            style={{ paddingInline: 0 }}
                          >
                            Sửa
                          </Button>,
                          <Popconfirm
                            key="del"
                            title="Xoá địa chỉ này?"
                            okText="Xoá"
                            cancelText="Không"
                            onConfirm={() => handleDeleteAddress(addr)}
                          >
                            <Button type="link" danger style={{ paddingInline: 0 }}>
                              Xoá
                            </Button>
                          </Popconfirm>,
                        ]}
                      >
                        <List.Item.Meta
                          avatar={<Radio value={id} />}
                          title={
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                                flexWrap: "wrap",
                              }}
                            >
                              <span style={{ fontWeight: 600 }}>
                                {addr.recipient_name} • {addr.phone}
                              </span>
                              {isDefault && <Tag color="green">Mặc định</Tag>}
                            </div>
                          }
                          description={<span>{addr.address_line}</span>}
                        />
                      </List.Item>
                    );
                  }}
                />
              </Radio.Group>
            )}
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
                        Đơn hàng #{order.id_order} - {getOrderTag(order.status)} - Ngày:{" "}
                        {formatDate(order.order_date)}
                      </span>
                    }
                    extra={
                      <>
                        <Text strong style={{ color: "#d4380d", marginRight: 12 }}>
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
                      renderItem={(item) => {
                        const productId = getProductId(item.product);
                        const delivered = isDelivered(order.status);
                        return (
                          <List.Item
                            actions={
                              delivered && productId
                                ? [
                                    <Button
                                      key="review"
                                      type="primary"
                                      size="small"
                                      onClick={() =>
                                        navigate(buildProductDetailPath(productId))
                                      }
                                      style={{
                                        backgroundColor: "#DBB671",
                                        borderColor: "#DBB671",
                                        color: "#000",
                                      }}
                                    >
                                      Đánh giá
                                    </Button>,
                                  ]
                                : []
                            }
                          >
                            <List.Item.Meta
                              avatar={
                                <img
                                  src={
                                    item?.product?.image
                                      ? `http://localhost:8000/${item.product.image}`
                                      : defaultAvatar
                                  }
                                  alt={item?.product?.name || "product"}
                                  style={{
                                    width: 60,
                                    height: 60,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                  }}
                                  onError={(e) => {
                                    e.currentTarget.src = defaultAvatar;
                                  }}
                                />
                              }
                              title={item?.product?.name || "Sản phẩm"}
                              description={
                                <>
                                  <div>Số lượng: {item.quantity}</div>
                                  <div>Đơn giá: {formatCurrency(item?.product?.price)}</div>
                                  <div>Loại: {item?.product?.type || "Không rõ"}</div>
                                </>
                              }
                            />
                          </List.Item>
                        );
                      }}
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

          <AddressModal
            open={addrModalOpen}
            onCancel={() => {
              setAddrModalOpen(false);
              setEditingAddress(null);
            }}
            initialValues={editingAddress}
            onSubmit={editingAddress ? submitEditAddress : submitAddAddress}
          />
        </div>
      </div>
      <FooterComponent />
    </>
  );
};

export default UserProfile;
