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
  Alert,
  Space,
  Typography,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ORDER_STATUS } from "@utils/orderStatus";
import Header from "@components/header";
import Footer from "@components/footer";
import { buildVietQRUrl } from "@utils/vietqr";

const { Text } = Typography;

// Helper đặt ngoài component để tránh tạo lại mỗi render
const extractPaymentCode = (text) => {
  if (!text) return null;
  const m = text.match(/mã\s*ck\s*:\s*([A-Z0-9_]+)/i);
  return m?.[1] || null;
};

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // Nếu đã paid thì dọn localStorage để tránh hiển thị nhầm thông tin VietQR cũ
  useEffect(() => {
    if (order?.status === "paid") {
      localStorage.removeItem("lastVietQRCode");
      localStorage.removeItem("lastVietQRAmount");
    }
  }, [order?.status]);

  const isVietQR = order?.payment_method === "vietqr";

  const embeddedCode = extractPaymentCode(order?.address);
  const lsCode = localStorage.getItem("lastVietQRCode");
  const paymentCode = isVietQR ? (embeddedCode || lsCode) : null;

  // Ưu tiên tổng tiền từ BE; nếu không có (trường hợp đơn vừa đặt), fallback localStorage
  const lsAmt = Number(localStorage.getItem("lastVietQRAmount") || 0);
  const amountForQR = Number(order?.total || 0) > 0 ? Number(order?.total) : lsAmt;

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
    },
    {
      title: "Ảnh",
      dataIndex: ["product", "image"],
      key: "image",
      render: (img) => <Image src={`http://localhost:8000/${img}`} width={80} />,
    },
    {
      title: "Giá",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price) => `${Number(price).toLocaleString()}₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Tổng",
      key: "total",
      render: (_, record) =>
        `${(Number(record.quantity) * Number(record.product.price)).toLocaleString()}₫`,
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
              {order.customer_name}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">{order.phone}</Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">{order.address}</Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {order.payment_method === "cod"
                ? "Thanh toán khi nhận hàng"
                : order.payment_method}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày đặt hàng">
              {order.order_date}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
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
              <strong>{Number(order.total).toLocaleString()}₫</strong>
            </Descriptions.Item>
          </Descriptions>


          <h3 style={{ marginTop: 24 }}>Danh sách sản phẩm</h3>
          <Table
            dataSource={order.order_details}
            columns={columns}
            rowKey="id_order_detail"
            pagination={false}
          />
        </Card>
      </div>

      <Footer />
    </>
  );
};

export default OrderDetailPage;
