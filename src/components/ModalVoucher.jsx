import React, { useState, useEffect } from "react";
import { Modal, Checkbox, Typography, message } from "antd";

const ModalVoucher = ({
  visible,
  onClose,
  vouchers,
  totalPrice,
  paymentMethod,
  shippingFee,
  selectedVoucherIds,
  onChangeSelectedVouchers,
}) => {
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    setSelected(selectedVoucherIds || []);
  }, [selectedVoucherIds]);

  const handleSelect = (voucherId, canUse) => {
    if (!canUse) return;
    setSelected((prev) =>
      prev.includes(voucherId)
        ? prev.filter((id) => id !== voucherId)
        : [...prev, voucherId]
    );
  };

  const handleApply = () => {
    onChangeSelectedVouchers(selected);
    onClose();
    message.success("Áp dụng voucher thành công!");
  };

  const getVoucherDiscount = (voucher) => {
    const validPrice = !voucher.min_order_amount || totalPrice >= voucher.min_order_amount;
    const isValid = validPrice;

    if (!isValid) return 0;

    if (voucher.type === "fixed") {
      return voucher.discount_amount;
    }

    if (voucher.type === "percentage") {
      const percentDiscount = (voucher.discount_amount / 100) * totalPrice;
      return Math.min(percentDiscount, voucher.max_discount_amount || percentDiscount);
    }

    return 0;
  };

  const totalDiscount = vouchers.reduce((sum, v) => {
    if (selected.includes(v.id_voucher)) {
      return sum + getVoucherDiscount(v);
    }
    return sum;
  }, 0);

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
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {vouchers.map((voucher) => {
          const validPrice = !voucher.min_order_amount || totalPrice >= voucher.min_order_amount;
          const canUse = validPrice;

          const isChecked = selected.includes(voucher.id_voucher);
          const discount = getVoucherDiscount(voucher);

          return (
            <div
              key={voucher.id_voucher}
              onClick={() => handleSelect(voucher.id_voucher, canUse)}
              style={{
                cursor: canUse ? "pointer" : "not-allowed",
                backgroundColor: canUse ? "#fff" : "#f5f5f5",
                padding: 10,
                borderRadius: 6,
                border: isChecked ? "2px solid #DBB671" : "1px solid #ddd",
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Checkbox checked={isChecked} disabled={!canUse} />
              <div>
                <Typography.Text strong>{voucher.code}</Typography.Text>
                <br />
                <Typography.Text type="secondary">
                  {voucher.type === "fixed" &&
                    `Giảm ${voucher.discount_amount.toLocaleString()}₫. `}
                  {voucher.type === "percentage" &&
                    `Giảm ${voucher.discount_amount}%${
                      voucher.max_discount_amount
                        ? ` (tối đa ${voucher.max_discount_amount.toLocaleString()}₫)`
                        : ""
                    }. `}
                  {voucher.min_order_amount &&
                    `Đơn từ ${voucher.min_order_amount.toLocaleString()}₫. `}
                  {voucher.note && voucher.note}
                </Typography.Text>
                {canUse && discount > 0 && (
                  <div style={{ color: "green", fontWeight: 500 }}>
                    → Giảm: {discount.toLocaleString()}₫
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {totalDiscount > 0 && (
        <div style={{ marginTop: 16, fontWeight: 600, color: "green" }}>
          Tổng giảm giá: {totalDiscount.toLocaleString()}₫
        </div>
      )}
    </Modal>
  );
};

export default ModalVoucher;
