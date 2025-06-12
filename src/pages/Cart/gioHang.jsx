import React, { useState } from "react";
import { Row, Col, Button, Input, Checkbox, Divider, Radio } from "antd";
import Header from "@components/Header";
import Footer from "@components/Footer";

const cartItems = [
  {
    id: 1,
    name: "Nước Hoa Chanel Coco Noir EDP Cho Nữ 100ml",
    color: "Đen",
    quantity: 1,
    price: 3580000,
    image: "/images/perfume/perfume3.jpg",
  },
  {
    id: 2,
    name: "Nước Hoa Chanel No 5 Eau De Toilette Cho Nữ 100ml",
    size: "30ml",
    quantity: 1,
    price: 3250000,
    image: "/images/perfume/perfume7.jpg",
  },
];

const CartPage = () => {
  const [paymentMethod, setPaymentMethod] = useState("vnpay"); // vnpay hoặc cod

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const shippingFee = paymentMethod === "cod" ? 30000 : 0;

  const finalTotal = totalPrice + shippingFee;

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
            {cartItems.map((item) => (
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
                <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
                  <img
                    src={item.image}
                    alt={item.name}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "contain",
                      marginRight: 24,
                    }}
                  />
                  <div>
                    <p style={{ fontWeight: 600 }}>{item.name}</p>
                    {item.color && <p>Màu sắc: {item.color}</p>}
                    {item.size && <p>Size: {item.size}</p>}
                    <p>Số lượng: {item.quantity}</p>
                  </div>
                </div>
                <Checkbox defaultChecked style={{ marginLeft: 16 }} />
                <div
                  style={{
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    width: 110,
                    textAlign: "right",
                    marginLeft: 16,
                  }}
                >
                  {item.price.toLocaleString()} ₫
                </div>
              </div>
            ))}
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
                  Võ Tuấn Hiệp | 0876111815
                </p>
                <p style={{ marginBottom: 8 }}>
                  Địa chỉ: 248A Nơ Trang Long, phường 12, quận Bình Thạnh, TP.HCM
                </p>
              </div>

              <Button
                size="small"
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

              <div
                style={{
                  marginBottom: 12,
                }}
              >
                <Radio.Group
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  value={paymentMethod}
                >
                  <Radio value="cod">Thanh toán COD</Radio>
                  <Radio value="vnpay" style={{ marginLeft: 20 }}>
                    Thanh toán VNPay
                  </Radio>
                </Radio.Group>
              </div>

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
      <Footer />
    </>
  );
};

export default CartPage;
