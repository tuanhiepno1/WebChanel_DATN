// @components/ModalVoucher.js
import React, { useState, useEffect } from "react";
import { Modal, Typography, Radio, message } from "antd";
import { applyVoucherAPI } from "@api/cartApi";

const ModalVoucher = ({
  visible,
  onClose,
  vouchers,
  totalPrice,
  paymentMethod,
  shippingFee,
  selectedVoucherId,
  onVoucherApplied,
  userId,
}) => {
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    setSelected(selectedVoucherId || null);
  }, [selectedVoucherId]);

  const getVoucherDiscount = (voucher) => {
    const validPrice = !voucher.min_order_amount || totalPrice >= voucher.min_order_amount;
    const validPayment = !voucher.payment_required || paymentMethod === voucher.payment_required;
    if (!validPrice || !validPayment) return 0;

    if (voucher.type === "fixed") {
      return voucher.discount_amount;
    }

    if (voucher.type === "percentage") {
      const percentDiscount = (voucher.discount_amount / 100) * totalPrice;
      return Math.min(percentDiscount, voucher.max_discount_amount || percentDiscount);
    }

    return 0;
  };

  const handleApply = async () => {
    if (!selected) {
      message.warning("Vui lòng chọn 1 voucher để áp dụng.");
      return;
    }

    try {
      const res = await applyVoucherAPI(userId, vouchers.find(v => v.id_voucher === selected)?.code);
      message.success(res.message || "Áp dụng voucher thành công!");
      onVoucherApplied(selected);
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Không thể áp dụng voucher. Vui lòng thử lại.");
    }
  };

  return (
    <Modal
      title="Chọn voucher"
      open={visible}
      onCancel={onClose}
      onOk={handleApply}
      okText="Áp dụng"
      cancelText="Hủy"
      okButtonProps={{
        style: { background: "#DBB671", borderColor: "#DBB671", color: "#000" },
      }}
    >
      <Radio.Group
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        style={{ width: "100%" }}
      >
        {vouchers.map((voucher) => {
          const discount = getVoucherDiscount(voucher);
          const disabled = discount <= 0;

          return (
            <Radio
              key={voucher.id_voucher}
              value={voucher.id_voucher}
              disabled={disabled}
              style={{
                display: "block",
                padding: "8px",
                border: selected === voucher.id_voucher ? "2px solid #DBB671" : "1px solid #ddd",
                borderRadius: 6,
                marginBottom: 12,
                cursor: disabled ? "not-allowed" : "pointer",
                backgroundColor: disabled ? "#f5f5f5" : "#fff",
              }}
            >
              <Typography.Text strong>{voucher.code}</Typography.Text>
              <br />
              <Typography.Text type="secondary">
                {voucher.type === "fixed"
                  ? `Giảm ${voucher.discount_amount.toLocaleString()}₫. `
                  : `Giảm ${voucher.discount_amount}%${
                      voucher.max_discount_amount
                        ? ` (tối đa ${voucher.max_discount_amount.toLocaleString()}₫)`
                        : ""
                    }. `}
                {voucher.min_order_amount &&
                  `Đơn từ ${voucher.min_order_amount.toLocaleString()}₫. `}
                {voucher.note}
              </Typography.Text>
              {discount > 0 && (
                <div style={{ color: "green", fontWeight: 500 }}>
                  → Giảm: {discount.toLocaleString()}₫
                </div>
              )}
            </Radio>
          );
        })}
      </Radio.Group>
    </Modal>
  );
};

export default ModalVoucher;
