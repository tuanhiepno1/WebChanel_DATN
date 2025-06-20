import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Button,
  Input,
  Checkbox,
  Divider,
  Radio,
  Space,
  Modal,
  Form,
} from "antd";
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity } from "@redux/cartSlice";
import Header from "@components/Header";
import Footer from "@components/Footer";
import DeliveryInfoForm from "@components/DeliveryInfoForm";
import CheckoutModal from "@components/CheckoutModal";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const [form] = Form.useForm();

  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [selectedIds, setSelectedIds] = useState(
    cartItems.map((item) => item.id)
  );

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [openDeliveryModal, setOpenDeliveryModal] = useState(false);
  const [tempDeliveryInfo, setTempDeliveryInfo] = useState(deliveryInfo);
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  useEffect(() => {
    if (openDeliveryModal) {
      setTempDeliveryInfo(deliveryInfo); // Sync lại khi mở modal
    }
  }, [openDeliveryModal]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ id, quantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
    setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    if (selectedIds.includes(item.id)) {
      return sum + (Number(item.price) || 0) * item.quantity;
    }
    return sum;
  }, 0);
  const shippingFee = paymentMethod === "cod" ? 30000 : 0;
  const finalTotal = totalPrice + shippingFee;

  const handleSaveDeliveryInfo = () => {
    setDeliveryInfo(tempDeliveryInfo);
    setOpenDeliveryModal(false);
  };

  return (
    <>
      <Header />
      <div style={{ padding: "32px 64px", minHeight: "calc(100vh - 200px)" }}>
        <h2 style={{ fontWeight: 500 }}>
          GIỎ HÀNG CỦA BẠN{" "}
          <span style={{ fontWeight: 400 }}>({cartItems.length} sản phẩm)</span>
        </h2>

        <Row gutter={32} style={{ marginTop: 24 }}>
          <Col xs={24} md={16}>
            {cartItems.length === 0 ? (
              <p>Không có sản phẩm nào trong giỏ hàng.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    borderBottom: "1px solid #eee",
                    padding: "16px 0",
                    alignItems: "center",
                    justifyContent: "space-between",
                    position: "relative",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", flex: 1 }}
                  >
                    <Checkbox
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                      style={{ marginRight: 12, transform: "scale(1.2)" }}
                    />

                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: 100,
                        height: 100,
                        objectFit: "contain",
                        marginRight: 24,
                        borderRadius: 4,
                      }}
                    />
                    <div>
                      <p style={{ fontWeight: 600, marginBottom: 4 }}>
                        {item.name}
                      </p>
                      {item.type && (
                        <p style={{ marginBottom: 4, color: "#888" }}>
                          Loại: {item.type}
                        </p>
                      )}
                      <Space>
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span>{item.quantity}</span>
                        <Button
                          size="small"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </Space>
                    </div>
                  </div>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div
                      style={{
                        fontWeight: 600,
                        whiteSpace: "nowrap",
                        width: 110,
                        textAlign: "right",
                      }}
                    >
                      {(Number(item.price) * item.quantity).toLocaleString()} ₫
                    </div>

                    <Button
                      type="text"
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemove(item.id)}
                      style={{
                        color: "rgba(0,0,0,0.45)",
                        transition: "0.3s",
                      }}
                      onMouseOver={(e) => (e.currentTarget.style.color = "red")}
                      onMouseOut={(e) =>
                        (e.currentTarget.style.color = "rgba(0,0,0,0.45)")
                      }
                    />
                  </div>
                </div>
              ))
            )}

            <div style={{ marginTop: 24 }}>
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

              <Button
                icon={<ArrowRightOutlined />}
                style={{
                  marginBottom: 16,
                  backgroundColor: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                  marginLeft: 16,
                }}
                onClick={() => {
                  const lastSlug =
                    localStorage.getItem("lastCategorySlug") || "all";
                  navigate(`/category/${lastSlug}`);
                }}
              >
                Tiếp tục mua sắm
              </Button>
            </div>
          </Col>

          <Col xs={24} md={8}>
            <div
              style={{
                border: "1px solid #eee",
                borderRadius: 6,
                padding: 16,
                background: "#fafafa",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <div>
                <h3>THÔNG TIN NGƯỜI NHẬN HÀNG:</h3>
                <p style={{ marginBottom: 4 }}>
                  {deliveryInfo.name} | {deliveryInfo.phone}
                </p>
                <p style={{ marginBottom: 8 }}>
                  Địa chỉ: {deliveryInfo.address}
                </p>
              </div>

              <Button
                size="small"
                onClick={() => setOpenDeliveryModal(true)}
                style={{
                  backgroundColor: "#FFE0A7",
                  borderColor: "#FFE0A7",
                  color: "#000",
                  alignSelf: "flex-end",
                  fontWeight: 600,
                }}
              >
                THAY ĐỔI
              </Button>

              <Divider />

              <Input
                placeholder="Nhập mã giảm giá tại đây"
                style={{ marginBottom: 12 }}
              />

              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{ marginBottom: 12 }}
              >
                <Radio value="cod">Thanh toán COD</Radio>
                <Radio value="vnpay" style={{ marginLeft: 20 }}>
                  Thanh toán VNPay
                </Radio>
              </Radio.Group>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString()} ₫</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span>Phí vận chuyển:</span>
                <span>{shippingFee.toLocaleString()} ₫</span>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 600,
                  fontSize: 16,
                  marginBottom: 16,
                }}
              >
                <span>Tổng cộng:</span>
                <span>{finalTotal.toLocaleString()} ₫</span>
              </div>

              <Button
                block
                onClick={() => setCheckoutVisible(true)}
                style={{
                  backgroundColor: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                  fontWeight: 600,
                  height: 48,
                }}
              >
                THANH TOÁN
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      {/* ✅ Modal chỉnh sửa thông tin */}
      <Modal
        title="Chỉnh sửa thông tin nhận hàng"
        open={openDeliveryModal}
        onCancel={() => setOpenDeliveryModal(false)}
        onOk={() => {
          form
            .validateFields()
            .then(() => {
              handleSaveDeliveryInfo(); // Cập nhật deliveryInfo
            })
            .catch((err) => {
              console.log("Validation Error:", err);
            });
        }}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          style: {
            backgroundColor: "#DBB671",
            borderColor: "#DBB671",
            color: "#000",
            fontWeight: 600,
          },
        }}
      >
        <DeliveryInfoForm
          info={tempDeliveryInfo}
          setInfo={setTempDeliveryInfo}
          form={form}
        />
      </Modal>

      <CheckoutModal
        visible={checkoutVisible}
        onCancel={() => setCheckoutVisible(false)}
        onConfirm={() => {
          setCheckoutVisible(false);
          message.success("Đặt hàng thành công!");
          // Gọi API nếu cần ở đây
        }}
        deliveryInfo={deliveryInfo}
        cartItems={cartItems}
        selectedIds={selectedIds}
        paymentMethod={paymentMethod}
        total={finalTotal}
      />

      <Footer />
    </>
  );
};

export default CartPage;
