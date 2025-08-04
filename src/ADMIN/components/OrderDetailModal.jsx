// src/components/OrderDetailModal.jsx
import React from "react";
import { Modal, Descriptions, Tag, Table, Image } from "antd";
import { ORDER_STATUS } from "@utils/orderStatus";

const OrderDetailModal = ({ open, onCancel, order }) => {
  const statusInfo = ORDER_STATUS[order?.status];

  const columns = [
    {
      title: "Ảnh",
      key: "image",
      render: (_, record) => (
        <Image
          src={`${import.meta.env.VITE_ASSET_BASE_URL}/${
            record.product?.image
          }`}
          alt={record.product?.name}
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
          fallback="/fallback-image.jpg" // optional: ảnh thay thế khi lỗi
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      key: "name",
      render: (_, record) => record.product?.name || "Không có tên",
    },
    {
      title: "Giá",
      key: "price",
      render: (_, record) => `${record.product?.price?.toLocaleString() || 0}₫`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Thành tiền",
      key: "total",
      render: (_, record) => {
        const price = record.product?.price || 0;
        const discount = parseFloat(record.discount || 0);
        const quantity = record.quantity || 1;
        const total = (price - discount) * quantity;
        return `${total.toLocaleString()}₫`;
      },
    },
  ];

  return (
    <Modal
      open={open}
      title={`Chi tiết đơn hàng #${order?.id_order || ""}`}
      onCancel={onCancel}
      footer={null}
      width={1000}
    >
      <Descriptions bordered column={1} size="small">
        <Descriptions.Item label="Tên khách hàng">
          {order?.customer_name}
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          {order?.phone}
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng">
          {order?.address}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {order?.payment_method?.toLowerCase() === "cod"
            ? "Thanh toán khi nhận hàng (COD)"
            : order?.payment_method?.toUpperCase()}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {new Date(order?.order_date).toLocaleString()}
        </Descriptions.Item>

        {order?.notes && (
          <Descriptions.Item label="Ghi chú">{order.notes}</Descriptions.Item>
        )}

        {order?.voucher && (
          <Descriptions.Item label="Voucher đã áp dụng">
            <Tag color="purple">{order.voucher.code}</Tag> -{" "}
            {order.voucher.type === "percentage"
              ? `Giảm ${order.voucher.discount_amount}%`
              : `Giảm ${parseFloat(
                  order.voucher.discount_amount
                ).toLocaleString()}₫`}
            <br />
            <small>{order.voucher.description}</small>
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Trạng thái đơn hàng">
          <Tag color={statusInfo?.color || "default"}>
            {statusInfo?.label || order?.status}
          </Tag>
        </Descriptions.Item>

        <Descriptions.Item label="Tổng tiền sau khuyến mãi">
          <b style={{ fontSize: 16 }}>{order?.total?.toLocaleString()}₫</b>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <h4 style={{ fontWeight: "bold", marginBottom: 10 }}>
          Danh sách sản phẩm
        </h4>
        <Table
          columns={columns}
          dataSource={order?.order_details || []}
          pagination={false}
          rowKey={(record) => record.id_order_detail}
        />
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
