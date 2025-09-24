import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Modal,
  Typography,
  Space,
  Statistic,
  message,
  Button,
  Divider,
} from "antd";
import { buildVietQRUrl } from "@utils/vietqr";
import { GAS_BASE, GAS_TOLERANCE } from "@utils/gas"; // GAS_BASE = domain Worker!

const { Text, Title } = Typography;

const randomCode = (len = 8) =>
  Math.random()
    .toString(36)
    .slice(2)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, len);

// === FE hard-guard: chuẩn hoá & tách token giống GAS ===
const normalize = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .trim();

const tokenize = (s) =>
  normalize(s)
    .split(/[^A-Z0-9]+/)
    .filter(Boolean);

const isExactCodeInTx = (tx, code) => {
  const codeNorm = normalize(code);
  const codeCellNorm = normalize(tx?.rawCode || "");
  const tokens = tokenize(tx?.content || "");
  return codeCellNorm === codeNorm || tokens.includes(codeNorm);
};

const copyText = async (txt) => {
  try {
    await navigator.clipboard.writeText(txt);
    message.success("Đã sao chép thông tin.");
  } catch {
    message.warning("Trình duyệt chặn sao chép, vui lòng copy thủ công.");
  }
};

// Chuẩn hóa mọi schema verify (mới/cũ) → {matched, transactions[], totalMatched, status?}
const unifyVerify = (raw, needAmount, tol) => {
  if (!raw) return null;
  if (raw.ok === false)
    return {
      matched: false,
      status: "ERROR",
      message: raw.message,
      transactions: [],
      totalMatched: 0,
    };

  // schema mới
  if (Array.isArray(raw?.transactions)) {
    const paid = Number(raw.totalMatched ?? raw.transactions?.[0]?.amount ?? 0);
    return {
      matched: !!raw.matched,
      status: raw.status,
      transactions: raw.transactions,
      totalMatched: paid,
    };
  }

  // schema cũ
  if ("tx" in (raw || {}) || "row" in (raw || {})) {
    const t = raw.tx || {};
    const txs = raw.row
      ? [
          {
            row: raw.row,
            amount: Number(t.amount || 0),
            at: t.at,
            rawCode: t.code,
            content: t.content,
          },
        ]
      : [];
    const paid = txs[0]?.amount || 0;
    // status tạm, FE sẽ tự phân loại lại
    return {
      matched: !!raw.matched,
      status: raw.matched ? "UNKNOWN" : "WRONG_CODE",
      transactions: txs,
      totalMatched: paid,
    };
  }

  return {
    matched: false,
    status: "WRONG_CODE",
    transactions: [],
    totalMatched: 0,
  };
};

// Phân loại sau khi đã lọc giao dịch đúng mã tuyệt đối
const classify = (txs, needAmount, tol) => {
  if (!txs?.length) return { kind: "none" };
  const paid = txs.reduce((s, t) => s + Number(t.amount || 0), 0);
  const delta = paid - Number(needAmount || 0);

  if (Math.abs(delta) <= (tol ?? 0))
    return { kind: "ok", paid, row: txs[0].row };
  if (delta < 0)
    return { kind: "underpay", missing: -delta, paid, row: txs[0].row };
  return { kind: "overpay", over: delta, paid, row: txs[0].row };
};

const VietQRPayModal = ({
  open,
  onClose,
  totalAmount,
  userId, // giữ signature
  onConfirmTransferred,
}) => {
  // waiting | topup | overpay | wrongcode | done
  const [phase, setPhase] = useState("waiting");

  // MAIN QR
  const [seed] = useState(() => Date.now().toString(36));
  const mainCode = useMemo(() => `ORD${randomCode(8)}`, [seed]);
  const [mainExpire] = useState(() => Date.now() + 15 * 60 * 1000);

  const mainQrUrl = useMemo(
    () =>
      buildVietQRUrl({
        bank: "TPB",
        accountNumber: "04330819301",
        accountName: "VO TUAN HIEP",
        amount: totalAmount,
        addInfo: mainCode,
        template: "print",
      }),
    [totalAmount, mainCode]
  );

  // TOP-UP
  const [topUpCode, setTopUpCode] = useState(null);
  const [topUpAmount, setTopUpAmount] = useState(0);
  const [topUpExpire, setTopUpExpire] = useState(0);
  const topUpQrUrl = useMemo(() => {
    if (!topUpCode || !topUpAmount) return null;
    return buildVietQRUrl({
      bank: "TPB",
      accountNumber: "04330819301",
      accountName: "VO TUAN HIEP",
      amount: topUpAmount,
      addInfo: topUpCode,
      template: "print",
    });
  }, [topUpCode, topUpAmount]);

  const firedRef = useRef(false);
  const openAtRef = useRef(null);
  useEffect(() => {
    if (open) openAtRef.current = Date.now();
  }, [open]);

  // Worker endpoints
  const claimRow = async (row, orderId) => {
    if (!row) return;
    try {
      await fetch(
        `${GAS_BASE}/claim?row=${encodeURIComponent(
          row
        )}&orderId=${encodeURIComponent(orderId)}`
      );
    } catch {}
  };

  // verify (qua Worker) – luôn truyền from/windowRows để thu hẹp & tránh match nhầm quá khứ
  const verifyCodeAmount = async (code, amount, tolerance = GAS_TOLERANCE) => {
    const openedAt = openAtRef.current || Date.now();
    const fromISO = new Date(openedAt - 2 * 60 * 60 * 1000).toISOString(); // lùi 2 tiếng
    const url =
      `${GAS_BASE}/verify?` +
      `code=${encodeURIComponent(code)}` +
      `&amount=${Math.floor(amount)}` +
      `&tolerance=${tolerance}` +
      `&from=${encodeURIComponent(fromISO)}` +
      `&windowRows=2000`; // quét sâu nhưng có from

    const res = await fetch(url, { method: "GET" });
    const text = await res.text();
    let raw;
    try {
      raw = JSON.parse(text);
    } catch {
      console.error("VERIFY non-JSON:", text);
      throw new Error("Verify returned non-JSON (check Worker/GAS)");
    }
    return unifyVerify(raw, amount, tolerance);
  };

  // Áp FE-hard-guard (lọc đúng mã tuyệt đối) + hành động UI
  const handleVerifyResult = async (resp, needAmount, codeForThis, context) => {
    if (!resp) return false;
    if (resp.ok === false && resp.message) {
      message.error(`Bridge error: ${resp.message}`);
      return false;
    }

    // LỌC CHẶT: chỉ giữ giao dịch có token == codeForThis
    const goodTxs = (resp.transactions || []).filter((t) =>
      isExactCodeInTx(t, codeForThis)
    );

    const r = classify(
      goodTxs,
      needAmount,
      context === "topup" ? GAS_TOLERANCE : 0
    );
    if (r.kind === "ok") {
      if (!firedRef.current && r.row) {
        firedRef.current = true;
        await claimRow(r.row, `${context.toUpperCase()}-OK`);
        message.success("Đã phát hiện chuyển khoản khớp — xác nhận đơn...");
        await onConfirmTransferred({
          paymentCode: codeForThis,
          amount: needAmount,
        });
        setPhase("done");
        onClose?.();
      }
      return true;
    }
    if (r.kind === "underpay") {
      if (context === "main") {
        if (goodTxs[0]?.row) await claimRow(goodTxs[0].row, `${mainCode}-P1`);
        setTopUpAmount(r.missing);
        setTopUpCode(`ORD${randomCode(8)}`);
        setTopUpExpire(Date.now() + 10 * 60 * 1000);
        setPhase("topup");
        message.warning(
          `Bạn đã chuyển thiếu ${r.missing.toLocaleString()} ₫. Vui lòng chuyển bù.`
        );
        return true;
      }
      return false;
    }
    if (r.kind === "overpay") {
      if (context === "main") {
        setPhase("overpay");
        return true;
      }
      return false;
    }

    // kind === "none" → không có giao dịch đúng mã ⇒ coi như chưa match
    return false;
  };

  // Poll MAIN
  useEffect(() => {
    if (!open) return;
    firedRef.current = false;
    setPhase("waiting");
    localStorage.setItem("lastVietQRCode", mainCode);
    localStorage.setItem("lastVietQRAmount", String(totalAmount));

    let stopped = false;
    let timerId;

    const tick = async () => {
      try {
        // 1) Đúng mã + đúng tiền (tolerance=0) → confirm ngay nếu có
        const strict = await verifyCodeAmount(mainCode, totalAmount, 0);
        if (await handleVerifyResult(strict, totalAmount, mainCode, "main"))
          return;

        // 2) Đúng mã (bỏ tiền) → phát hiện thiếu/thừa sớm
        const BIG_TOL = 10 ** 12;
        const any = await verifyCodeAmount(mainCode, 0, BIG_TOL);
        if (await handleVerifyResult(any, totalAmount, mainCode, "main"))
          return;
      } catch (err) {
        console.error("verify error:", err);
        message.error(
          "Không kiểm tra được giao dịch (verify). Kiểm tra cấu hình bridge (GAS_BASE)!"
        );
      }

      if (!stopped && Date.now() < mainExpire && !firedRef.current) {
        timerId = setTimeout(tick, 3000);
      }
    };

    tick();
    return () => {
      stopped = true;
      clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mainCode, totalAmount, mainExpire, onConfirmTransferred, onClose]);

  // Hết giờ → hậu kiểm 1 lần rồi wrongcode
  const handleMainExpired = async () => {
    if (firedRef.current || phase !== "waiting") return;
    try {
      const BIG_TOL = 10 ** 12;
      const any = await verifyCodeAmount(mainCode, 0, BIG_TOL);
      if (await handleVerifyResult(any, totalAmount, mainCode, "main")) return;
      setPhase("wrongcode");
    } catch {
      setPhase("wrongcode");
    }
  };

  // “Tôi đã chuyển khoản” → kiểm tra ngay (và nếu không thấy, chuyển wrongcode)
  const [manualBusy, setManualBusy] = useState(false);
  const handleManualConfirm = async () => {
    if (manualBusy || firedRef.current) return;
    setManualBusy(true);
    try {
      const strict = await verifyCodeAmount(mainCode, totalAmount, 0);
      if (await handleVerifyResult(strict, totalAmount, mainCode, "main"))
        return;

      const BIG_TOL = 10 ** 12;
      const any = await verifyCodeAmount(mainCode, 0, BIG_TOL);
      if (await handleVerifyResult(any, totalAmount, mainCode, "main")) return;

      setPhase("wrongcode");
      message.warning(
        "Không tìm thấy giao dịch phù hợp với mã CK. Vui lòng liên hệ CSKH để rà soát."
      );
    } catch (err) {
      console.error(err);
      message.error("Không kiểm tra được giao dịch. Vui lòng thử lại.");
    } finally {
      setManualBusy(false);
    }
  };

  // Poll TOP-UP
  useEffect(() => {
    if (!open || phase !== "topup" || !topUpCode || !topUpAmount) return;
    let stopped = false;
    let timerId;

    const tick = async () => {
      try {
        const strict = await verifyCodeAmount(
          topUpCode,
          topUpAmount,
          GAS_TOLERANCE
        );
        // Chỉ accept nếu giao dịch đúng token == topUpCode
        const ok = await handleVerifyResult(
          strict,
          topUpAmount,
          topUpCode,
          "topup"
        );
        if (ok) {
          // handleVerifyResult đã confirm & chuyển trang rồi
          // nhưng ở case topup, cần confirm đơn tổng tiền:
          // chuyển ngay sang done + onConfirmTransferred đã gọi trong handleVerifyResult
          // (do context=topup)
          await onConfirmTransferred({
            paymentCode: topUpCode,
            amount: totalAmount,
          });
          return;
        }
      } catch (e) {
        console.debug("topup verify error:", e);
      }
      if (!stopped && Date.now() < topUpExpire && !firedRef.current) {
        timerId = setTimeout(tick, 3000);
      }
    };

    tick();
    return () => {
      stopped = true;
      clearTimeout(timerId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    open,
    phase,
    topUpCode,
    topUpAmount,
    topUpExpire,
    totalAmount,
    onConfirmTransferred,
    onClose,
    mainCode,
  ]);

  // ==== UI ====
  const renderMainQR = () => (
    <>
      <Title level={5} style={{ marginBottom: 8 }}>
        Quét QR để chuyển khoản
      </Title>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Text>Mã nội dung CK:</Text>
        <Text strong>{mainCode}</Text>
      </Space>

      <div style={{ textAlign: "center", margin: "12px 0" }}>
        <img
          src={mainQrUrl}
          alt="VietQR"
          style={{
            width: 500,
            height: 500,
            objectFit: "contain",
            borderRadius: 8,
          }}
        />
      </div>

      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Text>Số tiền:</Text>
        <Text strong>{Number(totalAmount).toLocaleString()} ₫</Text>
      </Space>

      <div style={{ marginTop: 12 }}>
        <Statistic.Countdown
          title="Mã QR hết hạn sau"
          value={mainExpire}
          onFinish={handleMainExpired}
        />
      </div>

      <div
        style={{
          marginTop: 12,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        <Button
          style={{
            background: "#DBB671",
            borderColor: "#DBB671",
            color: "#000",
            marginBottom: 16,
          }}
          onClick={handleManualConfirm}
          loading={manualBusy}
        >
          Tôi đã chuyển khoản
        </Button>
      </div>
    </>
  );

  const renderTopup = () => (
    <>
      <Title level={5} style={{ marginBottom: 8 }}>
        Vui lòng chuyển bù
      </Title>
      <Space style={{ width: "100%", justifyContent: "space-between" }}>
        <Text>Thiếu cần bù:</Text>
        <Text strong>{topUpAmount.toLocaleString()} ₫</Text>
      </Space>
      <Divider />
      {!topUpCode ? (
        <Button
          type="primary"
          onClick={() => {
            setTopUpCode(`ORD${randomCode(8)}`);
            setTopUpExpire(Date.now() + 10 * 60 * 1000);
            setPhase("topup");
          }}
        >
          Tạo mã chuyển bù
        </Button>
      ) : (
        <>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Text>Mã CK bù:</Text>
            <Text strong>{topUpCode}</Text>
          </Space>
          <div style={{ textAlign: "center", margin: "12px 0" }}>
            {topUpQrUrl && (
              <img
                src={topUpQrUrl}
                alt="VietQR Topup"
                style={{
                  width: 500,
                  height: 500,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
              />
            )}
          </div>
          <Space style={{ width: "100%", justifyContent: "space-between" }}>
            <Text>Số tiền bù:</Text>
            <Text strong>{topUpAmount.toLocaleString()} ₫</Text>
          </Space>
          <div style={{ marginTop: 12 }}>
            <Statistic.Countdown
              title="Mã bù hết hạn sau"
              value={topUpExpire}
              onFinish={() =>
                message.warning("Mã bù đã hết hạn, vui lòng tạo lại.")
              }
            />
          </div>
        </>
      )}
    </>
  );

  const renderOverpay = () => {
    const info =
      `Mã CK: ${mainCode}\n` +
      `Số tiền cần: ${Number(totalAmount).toLocaleString()} ₫\n` +
      `Tài khoản nhận: 04330819301 (TPB) - VO TUAN HIEP\n` +
      `Thời điểm: ${new Date().toLocaleString()}`;
    return (
      <>
        <Title level={5} style={{ marginBottom: 8 }}>
          Bạn đã chuyển <b>thừa</b>
        </Title>
        <Text>
          Để tránh lệch sổ, hệ thống không tự tạo đơn khi số tiền lớn hơn yêu
          cầu. Vui lòng liên hệ <b>Zalo CSKH: 0876111815</b> để hoàn/điều chỉnh.
        </Text>
        <Divider />
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text type="secondary">Thông tin cần cung cấp cho CSKH:</Text>
          <pre
            style={{
              background: "#f6f6f6",
              padding: 12,
              borderRadius: 8,
              whiteSpace: "pre-wrap",
            }}
          >
            {info}
          </pre>
          <Space>
            <Button onClick={() => copyText(info)}>Sao chép</Button>
            <Button type="primary" onClick={onClose}>
              Đóng
            </Button>
          </Space>
        </Space>
      </>
    );
  };

  const renderWrongCode = () => {
    const info =
      `Mã CK đã nhập: ${mainCode}\n` +
      `Số tiền cần: ${Number(totalAmount).toLocaleString()} ₫\n` +
      `Tài khoản nhận: 04330819301 (TPB) - VO TUAN HIEP\n` +
      `Thời điểm tạo QR: ${new Date().toLocaleString()}`;
    return (
      <>
        <Title level={5} style={{ marginBottom: 8 }}>
          Không tìm thấy giao dịch phù hợp
        </Title>
        <Text>
          Có thể bạn đã nhập <b>sai mã CK</b>, dùng lại mã cũ đã được{" "}
          <b>CSKH xử lý/đã claim</b>, hoặc chưa chuyển khoản. Vui lòng liên hệ{" "}
          <b>Zalo CSKH: 0876111815</b> để được rà soát.
        </Text>
        <Divider />
        <Space direction="vertical" style={{ width: "100%" }}>
          <Text type="secondary">Thông tin cần cung cấp cho CSKH:</Text>
          <pre
            style={{
              background: "#f6f6f6",
              padding: 12,
              borderRadius: 8,
              whiteSpace: "pre-wrap",
            }}
          >
            {info}
          </pre>
          <Space>
            <Button onClick={() => copyText(info)}>Sao chép</Button>
            <Button type="primary" onClick={onClose}>
              Đóng
            </Button>
          </Space>
        </Space>
      </>
    );
  };

  return (
    <Modal
      title="Thanh toán VietQR"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnClose
    >
      {phase === "waiting" && renderMainQR()}
      {phase === "topup" && renderTopup()}
      {phase === "overpay" && renderOverpay()}
      {phase === "wrongcode" && renderWrongCode()}
    </Modal>
  );
};

export default VietQRPayModal;
