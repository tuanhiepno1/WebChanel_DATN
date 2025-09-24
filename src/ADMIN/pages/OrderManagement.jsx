import React, { useEffect, useState, useMemo } from "react";
import { Table, Tag, Button, Select, message, Input, Modal } from "antd";
import {
  fetchAllOrders,
  updateOrderStatus,
  fetchOrderById,
} from "@adminApi/orderAPI";
import { ReloadOutlined } from "@ant-design/icons";
import { ORDER_STATUS } from "@utils/orderStatus";
import OrderDetailModal from "@adminComponents/OrderDetailModal";

const { Option } = Select;

// Chuỗi trạng thái luồng xử lý đơn
const FLOW = ["ordered", "preparing", "shipping", "delivered"];
const TERMINAL = new Set(["delivered", "cancelled"]);

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

// Lấy tên khách hàng từ nhiều nguồn có thể có
const getCustomerName = (o) =>
  pickFirst(
    o?.customer_name,
    o?.customerName,
    o?.recipient_name,
    o?.recipientName,
    o?.address?.recipient_name,
    o?.address?.name,
    o?.user?.username,
    o?.user?.name
  ) || "";

// Chuẩn hoá payment_status về: 'paid' | 'pending' | 'failed'
const getPaymentStatusKey = (o) => {
  // ưu tiên các key thường gặp
  const raw = pickFirst(
    o?.payment_status,
    o?.paymentStatus,
    o?.status_payment,
    o?.payment?.status, // nếu BE lồng vào object payment
    // boolean/number flags
    o?.is_paid === true ? "paid" : null,
    o?.is_paid === 1 ? "paid" : null,
    o?.paid === true ? "paid" : null,
    o?.paid === 1 ? "paid" : null
  );

  // fallback 'pending' nếu rỗng
  let key = String(raw ?? "pending").trim().toLowerCase();

  // Chuẩn hoá vài biến thể
  if (key === "true" || key === "1") key = "paid";
  if (key === "false" || key === "0") key = "pending";
  if (key === "unpaid") key = "pending";

  return ["paid", "pending", "failed"].includes(key) ? key : "pending";
};

// Trả về danh sách trạng thái kế tiếp (tiến lên 1 bước)
const getAllowedNextStatuses = (current) => {
  const idx = FLOW.indexOf(current);
  if (idx === -1 || idx >= FLOW.length - 1) return [];
  return [FLOW[idx + 1]];
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      const filtered = Array.isArray(data)
        ? data.filter((o) => o.status !== "cart")
        : [];
      setOrders(filtered);
    } catch (error) {
      message.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredOrders = useMemo(() => {
    const kw = (searchKeyword || "").toLowerCase();
    return orders.filter((order) => {
      const name = (getCustomerName(order) || "").toLowerCase();
      const phone =
        String(
          pickFirst(
            order?.phone,
            order?.customer_phone,
            order?.recipient_phone,
            order?.address?.phone,
            order?.user?.phone
          ) || ""
        ).toLowerCase();

      const matchKeyword =
        !kw ||
        name.includes(kw) ||
        phone.includes(kw) ||
        String(order?.id_order || "").includes(kw);

      const matchStatus = !filterStatus || order.status === filterStatus;
      return matchKeyword && matchStatus;
    });
  }, [orders, searchKeyword, filterStatus]);

  const handleStatusChange = async (record, newStatus) => {
    const { id_order, status: current } = record;

    if (TERMINAL.has(current)) {
      message.warning("Đơn đã ở trạng thái kết thúc, không thể cập nhật.");
      return;
    }

    const allowed = getAllowedNextStatuses(current);
    if (!allowed.includes(newStatus)) {
      message.warning("Chỉ được chuyển sang trạng thái kế tiếp.");
      return;
    }

    try {
      await updateOrderStatus(id_order, newStatus);
      message.success("Cập nhật trạng thái thành công");
      loadOrders();
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleCancelOrder = (record) => {
    if (record.status !== "ordered") {
      message.warning("Chỉ được hủy khi đơn đang ở trạng thái 'Đã đặt hàng'.");
      return;
    }
    Modal.confirm({
      title: `Hủy đơn #${record.id_order}?`,
      content: "Bạn chắc chắn muốn hủy đơn này? Hành động không thể hoàn tác.",
      okText: "Hủy đơn",
      okButtonProps: { danger: true },
      cancelText: "Không",
      onOk: async () => {
        try {
          await updateOrderStatus(record.id_order, "cancelled");
          message.success("Đã hủy đơn hàng");
          loadOrders();
        } catch (e) {
          message.error("Hủy đơn thất bại");
        }
      },
    });
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id_order",
      key: "id_order",
      align: "center",
      width: 90,
    },
    {
      title: "Tên khách hàng",
      key: "customer_name",
      align: "center",
      render: (_, record) => getCustomerName(record) || "Không rõ",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
      width: 140,
      render: (total) => (Number(total) || 0).toLocaleString() + "₫",
    },
    {
      title: "Phương thức TT",
      dataIndex: "payment_method",
      key: "payment_method",
      align: "center",
      width: 140,
      render: (method) => (method ? String(method).toUpperCase() : "-"),
    },
    {
      title: "Trạng thái thanh toán",
      key: "payment_status",
      align: "center",
      width: 180,
      render: (_, record) => {
        const key = getPaymentStatusKey(record);
        const info = PAYMENT_STATUS[key] || PAYMENT_STATUS.pending;
        return <Tag color={info.color}>{info.label}</Tag>;
      },
    },
    {
      // ⚙️ Cập nhật trạng thái ĐƠN HÀNG (giữ nguyên chức năng)
      title: "Cập nhật",
      key: "action",
      align: "center",
      render: (_, record) => {
        const nextOptions = getAllowedNextStatuses(record.status);
        const disabled =
          TERMINAL.has(record.status) || nextOptions.length === 0;
        const currentLabel =
          ORDER_STATUS[record.status]?.label || record.status;

        return (
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Select
              value={record.status}
              onChange={(value) => handleStatusChange(record, value)}
              style={{ width: 200 }}
              disabled={disabled}
              placeholder="Chọn trạng thái kế tiếp"
            >
              {/* Trạng thái hiện tại (VN) — disable */}
              <Option value={record.status} disabled>
                {currentLabel}
              </Option>
              {/* Các lựa chọn hợp lệ kế tiếp (VN) */}
              {nextOptions.map((s) => (
                <Option key={s} value={s}>
                  {ORDER_STATUS[s]?.label || s}
                </Option>
              ))}
            </Select>

            {/* Nút Hủy chỉ hiển thị khi đang ở 'ordered' */}
            {record.status === "ordered" && (
              <Button danger onClick={() => handleCancelOrder(record)}>
                Hủy đơn
              </Button>
            )}
          </div>
        );
      },
    },
    {
      title: "Chi tiết",
      key: "detail",
      align: "center",
      render: (_, record) => (
        <Button
          onClick={async () => {
            try {
              const orderDetail = await fetchOrderById(record.id_order);
              setSelectedOrder(orderDetail);
              setModalOpen(true);
            } catch (error) {
              message.error("Không thể lấy chi tiết đơn hàng");
            }
          }}
          style={{
            backgroundColor: "#DBB671",
            borderColor: "#DBB671",
            color: "#000",
          }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "calc(100vh - 160px)",
        padding: 16,
        overflowX: "auto",
      }}
    >
      <h2 style={{ marginBottom: 16 }}>Quản lý đơn hàng</h2>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Tìm theo tên/điện thoại/ID đơn..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 260 }}
        />

        <Select
          placeholder="Lọc theo trạng thái đơn"
          value={filterStatus || undefined}
          onChange={(value) => setFilterStatus(value)}
          allowClear
          style={{ width: 220 }}
        >
          {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>

        <Button
          type="primary"
          onClick={loadOrders}
          icon={<ReloadOutlined />}
          style={{
            borderRadius: 4,
            backgroundColor: "#1677ff",
            color: "#fff",
            border: "none",
          }}
        >
          Làm mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        rowKey="id_order"
        loading={loading}
        pagination={{ pageSize: 8 }}
        bordered
      />

      <OrderDetailModal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        order={selectedOrder}
      />
    </div>
  );
};

export default OrderManagement;
