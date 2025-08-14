import React, { useEffect, useMemo, useRef, useState } from "react";
import { Modal, Typography, Space, Statistic, message } from "antd";
import { buildVietQRUrl } from "@utils/vietqr";
import { GAS_BASE, GAS_SECRET, GAS_TOLERANCE } from "@utils/gas";

const { Text, Title } = Typography;

// Tạo mã ngắn giống format bank log: "ORD2BP3Y4p"
const randomCode = (len = 8) =>
  Math.random().toString(36).slice(2).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, len);

const VietQRPayModal = ({
  open,
  onClose,
  totalAmount,
  userId, // không dùng trong mã nữa để tránh quá dài
  onConfirmTransferred, // sẽ tạo đơn + điều hướng
}) => {
  // => mã CK ngắn, KHỚP với bank content
  const [seed] = useState(() => Date.now().toString(36));
  const paymentCode = useMemo(
    () => `ORD${randomCode(8)}`, // ví dụ: ORD2BP3Y4p
    [seed] 
  );

  const [expireTs] = useState(() => Date.now() + 15 * 60 * 1000);
  const qrUrl = useMemo(
    () =>
      buildVietQRUrl({
        bank: "TPB",
        accountNumber: "04330819301",
        accountName: "VO TUAN HIEP",
        amount: totalAmount,
        addInfo: paymentCode, // rất quan trọng: MÃ này phải y hệt thứ bạn poll
        template: "print",
      }),
    [totalAmount, paymentCode]
  );

  // --- NGĂN GỌI TRÙNG ---
  const firedRef = useRef(false);

  useEffect(() => {
    if (!open) return;
    localStorage.setItem("lastVietQRCode", paymentCode);
    localStorage.setItem("lastVietQRAmount", String(totalAmount));
  }, [open, paymentCode, totalAmount]);

  // ---- Polling auto-verify ----
  useEffect(() => {
    if (!open) return;
    firedRef.current = false; // reset mỗi lần mở

    let stopped = false;
    let timerId;

    const onceWhenMatched = async (rowIdx) => {
      if (firedRef.current) return;
      firedRef.current = true;

      message.success("Đã phát hiện chuyển khoản khớp — xác nhận đơn...");

      // claim ở GAS để khóa giao dịch (không block UI)
      fetch(
        `${GAS_BASE}?action=claim&secret=${encodeURIComponent(
          GAS_SECRET
        )}&row=${rowIdx}&orderId=${encodeURIComponent(paymentCode)}`
      ).catch(() => {});

      try {
        await onConfirmTransferred({ paymentCode, amount: totalAmount });
      } finally {
        onClose?.(); // đóng modal
      }
    };

    const verifyOnce = async () => {
      const url =
        `${GAS_BASE}?action=verify&secret=${encodeURIComponent(GAS_SECRET)}` +
        `&code=${encodeURIComponent(paymentCode)}` +
        `&amount=${Math.floor(totalAmount)}` +
        `&tolerance=${GAS_TOLERANCE}`;

      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        if (data?.matched && !firedRef.current) {
          return onceWhenMatched(data.row);
        }
      } catch {
        // JSONP fallback (khi CORS chặn)
        const cbName = "__handleGas_" + Math.random().toString(36).slice(2);
        window[cbName] = (data) => {
          if (data?.matched && !firedRef.current) onceWhenMatched(data.row);
          try { delete window[cbName]; } catch {}
        };
        const s = document.createElement("script");
        s.src =
          `${GAS_BASE}?action=verify&secret=${encodeURIComponent(GAS_SECRET)}` +
          `&code=${encodeURIComponent(paymentCode)}` +
          `&amount=${Math.floor(totalAmount)}` +
          `&tolerance=${GAS_TOLERANCE}` +
          `&callback=${cbName}`;
        document.body.appendChild(s);
      }

      if (!stopped && Date.now() < expireTs && !firedRef.current) {
        timerId = setTimeout(verifyOnce, 3000);
      }
    };

    verifyOnce();
    return () => {
      stopped = true;
      clearTimeout(timerId);
    };
  }, [open, paymentCode, totalAmount, expireTs, onConfirmTransferred, onClose]);

  return (
    <Modal title="Thanh toán VietQR" open={open} onCancel={onClose} footer={null} destroyOnClose>
      <Title level={5} style={{ marginBottom: 8 }}>Quét QR để chuyển khoản</Title>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Text>Mã nội dung CK:</Text>
        <Text strong>{paymentCode}</Text>
      </Space>

      <div style={{ textAlign: "center", margin: "12px 0" }}>
        <img
          src={qrUrl}
          alt="VietQR"
          style={{ width: 500, height: 500, objectFit: "contain", borderRadius: 8 }}
        />
      </div>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Text>Số tiền:</Text>
        <Text strong>{Number(totalAmount).toLocaleString()} ₫</Text>
      </Space>

      <div style={{ marginTop: 12 }}>
        <Statistic.Countdown
          title="Mã QR hết hạn sau"
          value={expireTs}
          onFinish={() => message.warning("Mã QR đã hết hạn, vui lòng tạo lại.")}
        />
      </div>
      {/* Bỏ hoàn toàn nút thủ công để auto 100% */}
    </Modal>
  );
};

export default VietQRPayModal;
