// src/components/OrderDetailModal.jsx
import React, { useMemo } from "react";
import { Modal, Descriptions, Tag, Table, Image } from "antd";
import { ORDER_STATUS } from "@utils/orderStatus";

// Map trạng thái thanh toán → nhãn VN + màu
const PAYMENT_STATUS = {
  paid:    { label: "Đã thanh toán",      color: "green" },
  pending: { label: "Chưa thanh toán",    color: "gold"  },
  unpaid:  { label: "Chưa thanh toán",    color: "gold"  }, // phòng khi BE trả 'unpaid'
  failed:  { label: "Thanh toán thất bại", color: "red"   },
};

// Helper: lấy giá trị đầu tiên có dữ liệu
const pickFirst = (...vals) => {
  for (const v of vals) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return null;
};

// Chuẩn hoá địa chỉ (object/string) thành chuỗi safe để render
const toAddressText = (addr) => {
  if (!addr) return "—";
  if (typeof addr === "string") return addr;
  if (typeof addr === "object") {
    const parts = [
      addr.recipient_name,
      addr.phone,
      addr.address_line || addr.full,
    ].filter(Boolean);
    if (parts.length) return parts.join(" • ");
    try {
      return JSON.stringify(addr);
    } catch {
      return "—";
    }
  }
  return String(addr);
};

const OrderDetailModal = ({ open, onCancel, order }) => {
  // Thông tin trạng thái
  const statusInfo = ORDER_STATUS?.[order?.status];
  const payKey = String(order?.payment_status || "pending").toLowerCase();
  const payInfo = PAYMENT_STATUS[payKey] || PAYMENT_STATUS.pending;

  // Tên, SĐT, địa chỉ hiển thị an toàn
  const customerName = useMemo(
    () =>
      pickFirst(
        order?.customer_name,
        order?.customerName,
        order?.recipient_name,
        order?.recipientName,
        order?.address?.recipient_name,
        order?.address?.name,
        order?.user?.username,
        order?.user?.name
      ) || "Không rõ",
    [order]
  );

  const customerPhone = useMemo(
    () =>
      pickFirst(
        order?.phone,
        order?.customer_phone,
        order?.recipient_phone,
        order?.address?.phone,
        order?.user?.phone
      ) || "Không rõ",
    [order]
  );

  const addressText = useMemo(() => toAddressText(order?.address), [order]);

  const columns = [
    {
      title: "Ảnh",
      key: "image",
      render: (_, record) => {
        const img = record?.product?.image;
        if (!img) return <span>—</span>;
        return (
          <Image
            src={`${import.meta.env.VITE_ASSET_BASE_URL}/${img}`}
            alt={record.product?.name || "product"}
            width={60}
            height={60}
            style={{ objectFit: "cover", borderRadius: 8 }}
            fallback="/fallback-image.jpg"
          />
        );
      },
    },
    {
      title: "Tên sản phẩm",
      key: "name",
      render: (_, record) => record?.product?.name || "Không có tên",
    },
    {
      title: "Giá",
      key: "price",
      render: (_, record) =>
        `${Number(record?.product?.price || 0).toLocaleString()}₫`,
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
        const price = Number(record?.product?.price || 0);
        const discount = Number(record?.discount || 0);
        const quantity = Number(record?.quantity || 1);
        const total = Math.max(0, (price - discount) * quantity);
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
        <Descriptions.Item label="Tên khách hàng">{customerName}</Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">{String(customerPhone)}</Descriptions.Item>
        <Descriptions.Item label="Địa chỉ giao hàng">{addressText}</Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          {order?.payment_method?.toLowerCase() === "cod"
            ? "Thanh toán khi nhận hàng (COD)"
            : (order?.payment_method || "").toUpperCase() || "—"}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thanh toán">
          <Tag color={payInfo.color}>{payInfo.label}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái đơn hàng">
          <Tag color={statusInfo?.color || "default"}>
            {statusInfo?.label || order?.status}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đặt hàng">
          {order?.order_date ? new Date(order.order_date).toLocaleString() : "—"}
        </Descriptions.Item>

        {order?.notes && (
          <Descriptions.Item label="Ghi chú">{String(order.notes)}</Descriptions.Item>
        )}

        {order?.voucher && (
          <Descriptions.Item label="Voucher đã áp dụng">
            <Tag color="purple">{order?.voucher?.code}</Tag>{" "}
            {order?.voucher?.type === "percentage"
              ? `Giảm ${Number(order?.voucher?.discount_amount || 0)}%`
              : `Giảm ${Number(order?.voucher?.discount_amount || 0).toLocaleString()}₫`}
            {order?.voucher?.description ? (
              <>
                <br />
                <small>{String(order.voucher.description)}</small>
              </>
            ) : null}
          </Descriptions.Item>
        )}

        <Descriptions.Item label="Tổng tiền sau khuyến mãi">
          <b style={{ fontSize: 16 }}>
            {Number(order?.total ?? order?.total_amount ?? 0).toLocaleString()}₫
          </b>
        </Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 24 }}>
        <h4 style={{ fontWeight: "bold", marginBottom: 10 }}>Danh sách sản phẩm</h4>
        <Table
          columns={columns}
          dataSource={order?.order_details || order?.orderdatails || []}
          pagination={false}
          rowKey={(record) =>
            record?.id_order_detail ||
            record?.id ||
            `${record?.product?.id || ""}_${record?.quantity || ""}`
          }
        />
      </div>
    </Modal>
  );
};

export default OrderDetailModal;
