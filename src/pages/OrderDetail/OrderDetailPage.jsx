import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById } from "@api/cartApi";
import {
  Card,
  Descriptions,
  Table,
  Image,
  Spin,
  message,
  Tag,
  Button,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ORDER_STATUS } from "@utils/orderStatus";
import Header from "@components/header";
import Footer from "@components/footer";
import { buildVietQRUrl } from "@utils/vietqr";

const { Text } = Typography;

/** Ép input về chuỗi rồi regex an toàn */
const extractPaymentCode = (input) => {
  if (input == null) return null;

  let text = "";
  if (typeof input === "string") {
    text = input;
  } else if (typeof input === "object") {
    text = input.address_line || input.address || input.note || "";
    if (!text) {
      try {
        text = JSON.stringify(input);
      } catch {
        text = "";
      }
    }
  } else {
    text = String(input);
  }

  if (!text) return null;
  const m = String(text).match(/m[ãa]\s*ck\s*[:\-]?\s*([A-Z0-9_]+)/i);
  return m?.[1] || null;
};

/** Lấy giá trị đầu tiên có dữ liệu (không null/undefined/"") */
const pickFirst = (...vals) => {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return null;
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const PAYMENT_STATUS = {
    paid: { label: "Đã thanh toán", color: "green" },
    pending: { label: "Chưa thanh toán", color: "gold" },
    unpaid: { label: "Chưa thanh toán", color: "gold" }, // BE đôi khi trả 'unpaid'
    failed: { label: "Thanh toán thất bại", color: "red" },
  };

  // Load đơn hàng
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        message.error(err?.message || "Không tải được đơn hàng");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // Nếu đã PAID thì dọn cache VietQR
  useEffect(() => {
    if (
      order?.payment_status &&
      String(order.payment_status).toLowerCase() === "paid"
    ) {
      localStorage.removeItem("lastVietQRCode");
      localStorage.removeItem("lastVietQRAmount");
    }
  }, [order?.payment_status]);

  const isVietQR = order?.payment_method === "vietqr";

  // ---- Chuẩn hoá tên/SĐT/địa chỉ hiển thị ----
  const customerName =
    pickFirst(
      order?.customer_name,
      order?.customerName,
      order?.recipient_name,
      order?.recipientName,
      order?.address?.recipient_name,
      order?.address?.name,
      order?.user?.username,
      order?.user?.name
    ) || "Không rõ";

  const customerPhone =
    pickFirst(
      order?.phone,
      order?.customer_phone,
      order?.recipient_phone,
      order?.address?.phone,
      order?.user?.phone
    ) || "Không rõ";

  const addressText =
    typeof order?.address === "string"
      ? order.address
      : pickFirst(order?.address?.full, order?.address?.address_line) ||
        (order?.address ? JSON.stringify(order.address) : "—");

  const payKey = String(order?.payment_status || "pending").toLowerCase();
  const payInfo = PAYMENT_STATUS[payKey] || PAYMENT_STATUS.pending;

  // ---- VietQR ----
  const embeddedCode = extractPaymentCode(order?.address);
  const lsCode = localStorage.getItem("lastVietQRCode") || null;
  const paymentCode = isVietQR ? embeddedCode || lsCode : null;

  const beTotal = Number(order?.total ?? order?.total_amount ?? 0);
  const lsAmt = Number(localStorage.getItem("lastVietQRAmount") || 0);
  const amountForQR = beTotal > 0 ? beTotal : lsAmt;

  const vietqrUrl =
    isVietQR && paymentCode && amountForQR > 0
      ? buildVietQRUrl({
          bank: "TPB",
          accountNumber: "04330819301",
          accountName: "TUAN HIEP",
          amount: amountForQR,
          addInfo: paymentCode,
          template: "print",
        })
      : null;

  if (loading) return <Spin fullscreen />;
  if (!order) return <div>Không tìm thấy đơn hàng</div>;

  const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["product", "name"],
      key: "name",
      render: (name) => name || <Text type="secondary">Không rõ</Text>,
    },
    {
      title: "Ảnh",
      dataIndex: ["product", "image"],
      key: "image",
      render: (img) =>
        img ? (
          <Image src={`http://localhost:8000/${img}`} width={80} />
        ) : (
          <Text type="secondary">—</Text>
        ),
    },
    {
      title: "Giá",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price) =>
        price != null ? `${Number(price).toLocaleString()}₫` : "—",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng",
      key: "total",
      render: (_, record) => {
        const p = Number(record?.product?.price || 0);
        const q = Number(record?.quantity || 0);
        return `${(p * q).toLocaleString()}₫`;
      },
    },
  ];

  return (
    <>
      <Header />

      <div style={{ padding: "24px", maxWidth: 1200, margin: "0 auto" }}>
        <Button
          type="default"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          style={{
            backgroundColor: "#DBB671",
            borderColor: "#DBB671",
            color: "#000",
            marginBottom: 16,
          }}
        >
          Quay lại
        </Button>

        <Card title={`Chi tiết đơn hàng #${order.id_order}`} bordered>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Khách hàng">
              {customerName}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">
              {String(customerPhone)}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{addressText}</Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {order.payment_method === "cod"
                ? "Thanh toán khi nhận hàng"
                : order.payment_method}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái thanh toán">
              <Tag color={payInfo.color}>{payInfo.label}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt hàng">
              {order.order_date}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái đơn">
              <Tag color={ORDER_STATUS[order.status]?.color || "default"}>
                {ORDER_STATUS[order.status]?.label || order.status}
              </Tag>
            </Descriptions.Item>
            {order.voucher && (
              <Descriptions.Item label="Voucher áp dụng">
                {order.voucher.code} - {order.voucher.discount_amount}
                {order.voucher.type === "percentage" ? "%" : "₫"}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Tổng tiền">
              <strong>
                {Number(
                  order.total ?? order.total_amount ?? 0
                ).toLocaleString()}
                ₫
              </strong>
            </Descriptions.Item>

            {/* Hiển thị VietQR (nếu đơn VietQR & cần thanh toán) */}
            {isVietQR && paymentCode && amountForQR > 0 && (
              <Descriptions.Item label="Thanh toán VietQR">
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  <Text>
                    Mã thanh toán: <b>{paymentCode}</b>
                  </Text>
                  <Text>
                    Số tiền: <b>{amountForQR.toLocaleString()}₫</b>
                  </Text>
                  <a href={vietqrUrl} target="_blank" rel="noreferrer">
                    Mở mã VietQR
                  </a>
                </div>
              </Descriptions.Item>
            )}
          </Descriptions>

          <h3 style={{ marginTop: 24 }}>Danh sách sản phẩm</h3>
          <Table
            dataSource={order.order_details || order.orderdatails || []}
            columns={columns}
            rowKey={(r) =>
              r.id_order_detail ||
              r.id ||
              `${r?.product?.id || ""}_${r?.quantity || ""}`
            }
            pagination={false}
          />
        </Card>
      </div>

      <Footer />
    </>
  );
};

export default OrderDetailPage;
