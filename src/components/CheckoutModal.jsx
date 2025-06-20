import React from "react";
import { Modal, List, Typography, Divider } from "antd";

const CheckoutModal = ({
  visible,
  onCancel,
  onConfirm,
  deliveryInfo,
  cartItems,
  selectedIds,
  paymentMethod,
  total,
}) => {
  const selectedItems = cartItems.filter((item) => selectedIds.includes(item.id));

  return (
    <Modal
      title="Xác nhận đặt hàng"
      open={visible}
      onCancel={onCancel}
      onOk={onConfirm}
      okText="Xác nhận"
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
      <div style={{ marginBottom: 12 }}>
        <h4>Người nhận:</h4>
        <p>
          {deliveryInfo.name} | {deliveryInfo.phone}
          <br />
          Địa chỉ: {deliveryInfo.address}
        </p>
      </div>

      <Divider />

      <h4>Danh sách sản phẩm:</h4>
      <List
        size="small"
        dataSource={selectedItems}
        renderItem={(item) => (
          <List.Item>
            <Typography.Text>{item.name}</Typography.Text>
            <div>
              {item.quantity} x {(Number(item.price)).toLocaleString()} ₫
            </div>
          </List.Item>
        )}
      />

      <Divider />

      <p>
        <strong>Phương thức thanh toán:</strong>{" "}
        {paymentMethod === "cod" ? "COD" : "VNPay"}
      </p>

      <p>
        <strong>Tổng thanh toán:</strong> {total.toLocaleString()} ₫
      </p>
    </Modal>
  );
};

export default CheckoutModal;
