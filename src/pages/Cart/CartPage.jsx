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
  message,
} from "antd";
import {
  DeleteOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { removeFromCart, updateQuantity, fetchCart } from "@redux/cartSlice";
import Header from "@components/Header";
import Footer from "@components/Footer";
import DeliveryInfoForm from "@components/DeliveryInfoForm";
import CheckoutModal from "@components/CheckoutModal";
import { useNavigate } from "react-router-dom";
import ModalVoucher from "@components/ModalVoucher";
import VietQRPayModal from "@components/VietQRPayModal";
import { fetchVouchers, checkoutAPI, applyVoucherAPI } from "@api/cartApi";
import { fetchOrderHistoryByUserId } from "@api/userApi";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const user = useSelector((state) => state.auth.user);
  const [form] = Form.useForm();

  const [vietqrOpen, setVietqrOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("vnpay");
  const [selectedIds, setSelectedIds] = useState([]);
  const [openDeliveryModal, setOpenDeliveryModal] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [vouchers, setVouchers] = useState([]);
  const [voucherModalVisible, setVoucherModalVisible] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.username || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });
  const [tempDeliveryInfo, setTempDeliveryInfo] = useState(deliveryInfo);
  const [selectedVoucherId, setSelectedVoucherId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    setSelectedIds(cartItems.map((item) => item.id));
  }, [cartItems]);

  useEffect(() => {
    if (openDeliveryModal) setTempDeliveryInfo(deliveryInfo);
  }, [openDeliveryModal, deliveryInfo]);

  useEffect(() => {
    const loadVouchers = async () => {
      const data = await fetchVouchers();
      const mapped = data.map((v) => ({
        id_voucher: v.id_voucher,
        code: v.code,
        type: v.type,
        discount_amount: v.discount_amount,
        max_discount_amount: v.max_discount_amount || 0,
        min_order_amount: v.min_order_amount || 0,
        payment_required: v.payment_required || null,
        note: v.note || "",
      }));
      setVouchers(mapped);
    };
    loadVouchers();
  }, []);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity >= 1) {
      dispatch(updateQuantity({ userId: user.id, id, quantity }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart({ userId: user.id, id }));
  };

  const totalPrice = cartItems.reduce((sum, item) => {
    if (selectedIds.includes(item.id)) {
      return sum + (Number(item.price) || 0) * item.quantity;
    }
    return sum;
  }, 0);

  const shippingFee = paymentMethod === "cod" ? 30000 : 0;

  const getVoucherDiscount = (voucher) => {
    const validPrice =
      !voucher.min_order_amount || totalPrice >= voucher.min_order_amount;
    const validPayment =
      !voucher.payment_required || paymentMethod === voucher.payment_required;
    if (!validPrice || !validPayment) return 0;

    if (voucher.type === "fixed") return voucher.discount_amount;

    if (voucher.type === "percentage") {
      const percentDiscount = (voucher.discount_amount / 100) * totalPrice;
      return Math.min(
        percentDiscount,
        voucher.max_discount_amount || percentDiscount
      );
    }

    return 0;
  };

  const totalVoucherDiscount = selectedVoucherId
    ? getVoucherDiscount(
        vouchers.find((v) => v.id_voucher === selectedVoucherId)
      )
    : 0;

  const finalTotal = totalPrice + shippingFee - totalVoucherDiscount;

  const handleApplyVoucher = async (voucherId) => {
    const voucher = vouchers.find((v) => v.id_voucher === voucherId);
    if (!voucher) return;
    try {
      const res = await applyVoucherAPI(user.id, voucher.code);
      message.success(res.message || "Áp dụng voucher thành công!");
      setSelectedVoucherId(voucherId);
    } catch (err) {
      console.error(err);
      message.error("Không thể áp dụng voucher. Vui lòng thử lại.");
    }
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
                      style={{ color: "rgba(0,0,0,0.45)", transition: "0.3s" }}
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
                style={{
                  background: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                }}
                onClick={() => navigate(-1)}
              >
                Quay lại
              </Button>
              <Button
                icon={<ArrowRightOutlined />}
                onClick={() =>
                  navigate(
                    `/category/${
                      localStorage.getItem("lastCategorySlug") || "all"
                    }`
                  )
                }
                style={{
                  background: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                  marginLeft: 16,
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
              }}
            >
              <h3>THÔNG TIN NGƯỜI NHẬN HÀNG:</h3>
              <p>
                {deliveryInfo.name} | {deliveryInfo.phone}
              </p>
              <p>Địa chỉ: {deliveryInfo.address}</p>
              <Button
                size="small"
                style={{
                  background: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                }}
                onClick={() => setOpenDeliveryModal(true)}
              >
                THAY ĐỔI
              </Button>

              <Divider />

              <Radio.Group
                onChange={(e) => setPaymentMethod(e.target.value)}
                value={paymentMethod}
                style={{
                  marginBottom: 12,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Radio value="cod" style={{ flex: 1, textAlign: "center" }}>
                  Thanh toán COD
                </Radio>
                <Radio value="vietqr" style={{ flex: 1, textAlign: "center" }}>
                  Thanh toán online (VietQR)
                </Radio>
              </Radio.Group>

              <Button
                type="dashed"
                block
                onClick={() => setVoucherModalVisible(true)}
                style={{
                  background: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                  marginBottom: 16,
                }}
              >
                Chọn voucher
              </Button>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Tạm tính:</span>
                <span>{totalPrice.toLocaleString()} ₫</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Phí vận chuyển:</span>
                <span>{shippingFee.toLocaleString()} ₫</span>
              </div>
              {totalVoucherDiscount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "green",
                  }}
                >
                  <span>Giảm giá voucher:</span>
                  <span>-{totalVoucherDiscount.toLocaleString()} ₫</span>
                </div>
              )}
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 600,
                }}
              >
                <span>Tổng cộng:</span>
                <span>{finalTotal.toLocaleString()} ₫</span>
              </div>

              <Button
                block
                onClick={async () => {
                  if (paymentMethod === "vietqr") {
                    // Mở modal VietQR, KH chuyển khoản xong sẽ bấm "Tôi đã chuyển khoản"
                    setVietqrOpen(true);
                    return;
                  }
                  // Giữ nguyên luồng cũ cho COD/VNPay của bạn
                  setCheckoutVisible(true);
                }}
                style={{
                  background: "#DBB671",
                  borderColor: "#DBB671",
                  color: "#000",
                  marginTop: 16,
                }}
              >
                THANH TOÁN
              </Button>
            </div>
          </Col>
        </Row>
      </div>

      <Modal
        title="Chỉnh sửa thông tin nhận hàng"
        open={openDeliveryModal}
        onCancel={() => setOpenDeliveryModal(false)}
        onOk={() => {
          form.validateFields().then(() => {
            setDeliveryInfo(tempDeliveryInfo);
            setOpenDeliveryModal(false);
          });
        }}
      >
        <DeliveryInfoForm
          info={tempDeliveryInfo}
          setInfo={setTempDeliveryInfo}
          form={form}
        />
      </Modal>
      <ModalVoucher
        visible={voucherModalVisible}
        onClose={() => setVoucherModalVisible(false)}
        vouchers={vouchers}
        totalPrice={totalPrice}
        paymentMethod={paymentMethod}
        shippingFee={shippingFee}
        selectedVoucherId={selectedVoucherId}
        onVoucherApplied={handleApplyVoucher}
        userId={user.id}
      />

      <CheckoutModal
        visible={checkoutVisible}
        onCancel={() => setCheckoutVisible(false)}
        onConfirm={async () => {
          try {
            await checkoutAPI(user.id, {
              customer_name: deliveryInfo.name,
              phone: deliveryInfo.phone,
              address: deliveryInfo.address,
              payment_method: paymentMethod,
              voucher_id: selectedVoucherId,
              total_price: finalTotal,
            });

            setCheckoutVisible(false);
            message.success("Đặt hàng thành công!");
            dispatch(fetchCart(user.id));

            // 👉 Gọi lấy đơn hàng mới nhất
            const orderHistory = await fetchOrderHistoryByUserId(user.id);
            if (orderHistory && orderHistory.length > 0) {
              const latestOrder = orderHistory[0]; // giả định BE trả danh sách mới nhất trước
              navigate(`/order/${latestOrder.id_order}`);
            } else {
              navigate("/order-history");
            }
          } catch (error) {
            console.error("Checkout failed", error);
            message.error("Đặt hàng thất bại. Vui lòng thử lại.");
          }
        }}
        deliveryInfo={deliveryInfo}
        cartItems={cartItems.filter((item) => selectedIds.includes(item.id))}
        selectedIds={selectedIds}
        paymentMethod={paymentMethod}
        total={finalTotal}
      />

      <VietQRPayModal
        open={vietqrOpen}
        onClose={() => setVietqrOpen(false)}
        totalAmount={finalTotal}
        userId={user?.id}
        onConfirmTransferred={async ({ paymentCode, amount }) => {
          try {
            const payload = {
              customer_name: deliveryInfo.name,
              phone: deliveryInfo.phone,
              
              address: `${deliveryInfo.address} | MÃ CK: ${paymentCode}`,
              payment_method: "vietqr",
              voucher_id: selectedVoucherId,
              total_price: amount,
            };

            const res = await checkoutAPI(user.id, payload);

          
            const createdId =
              res?.data?.id_order || res?.id_order || res?.order?.id_order;

            message.success(
              "Đặt hàng thành công! Đang chuyển đến chi tiết đơn…"
            );
            setVietqrOpen(false);
            dispatch(fetchCart(user.id));

            if (createdId) {
              navigate(`/order/${createdId}`);
            } else {
              // Fallback: lấy danh sách đơn và chọn đơn mới nhất
              const orderHistory = await fetchOrderHistoryByUserId(user.id);
              if (orderHistory && orderHistory.length > 0) {
                navigate(`/order/${orderHistory[0].id_order}`);
              } else {
                navigate("/order-history");
              }
            }
          } catch (error) {
            console.error(error);
            message.error("Không tạo được đơn. Vui lòng thử lại.");
          }
        }}
      />

      <Footer />
    </>
  );
};

export default CartPage;
