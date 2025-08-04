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
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ORDER_STATUS } from "@utils/orderStatus";
import Header from "@components/header";
import Footer from "@components/footer";


const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        message.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

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
      render: (img) => (
        <Image src={`http://localhost:8000/${img}`} width={80} />
      ),
    },
    {
      title: "Giá",
      dataIndex: ["product", "price"],
      key: "price",
      render: (price) => `${price.toLocaleString()}₫`,
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
        `${(record.quantity * record.product.price).toLocaleString()}₫`,
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
            <Descriptions.Item label="Địa chỉ">
              {order.address}
            </Descriptions.Item>
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
              <strong>{order.total.toLocaleString()}₫</strong>
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
