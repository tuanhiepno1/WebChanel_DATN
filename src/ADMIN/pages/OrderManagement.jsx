import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Select, message, Input } from "antd";
import {
  fetchAllOrders,
  updateOrderStatus,
  fetchOrderById,
} from "@adminApi/orderAPI";
import { ORDER_STATUS } from "@utils/orderStatus";
import OrderDetailModal from "@adminComponents/OrderDetailModal";

const { Option } = Select;

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await fetchAllOrders();
      setOrders(data);
    } catch (error) {
      message.error("Lỗi khi tải đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id_order, newStatus) => {
    try {
      await updateOrderStatus(id_order, newStatus);
      message.success("Cập nhật trạng thái thành công");
      loadOrders(); // Reload lại
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchKeyword = order.customer_name
      ?.toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const matchStatus = !filterStatus || order.status === filterStatus;
    return matchKeyword && matchStatus;
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const columns = [
    {
      title: "ID",
      dataIndex: "id_order",
      key: "id_order",
      align: "center",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customer_name",
      key: "customer_name",
      align: "center",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total",
      key: "total",
      align: "center",
      render: (total) => total.toLocaleString() + "₫",
    },
    {
      title: "Thanh toán",
      dataIndex: "payment_method",
      key: "payment_method",
      align: "center",
      render: (method) => method.toUpperCase(),
    },
    {
      title: "Trạng thái",
      key: "status",
      align: "center",
      render: (_, record) => {
        const status = ORDER_STATUS[record.status];
        return (
          <Tag color={status?.color || "default"}>
            {status?.label || record.status}
          </Tag>
        );
      },
    },
    {
      title: "Cập nhật trạng thái",
      key: "action",
      align: "center",
      render: (_, record) => (
        <Select
          value={record.status}
          onChange={(value) => handleStatusChange(record.id_order, value)}
          style={{ width: 150 }}
        >
          {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
            <Option key={key} value={key}>
              {label}
            </Option>
          ))}
        </Select>
      ),
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
        placeholder="Tìm theo tên khách hàng..."
        value={searchKeyword}
        onChange={(e) => setSearchKeyword(e.target.value)}
        style={{ width: 220 }}
      />

      <Select
        placeholder="Lọc theo trạng thái"
        value={filterStatus || undefined}
        onChange={(value) => setFilterStatus(value)}
        allowClear
        style={{ width: 180 }}
      >
        {Object.entries(ORDER_STATUS).map(([key, { label }]) => (
          <Option key={key} value={key}>
            {label}
          </Option>
        ))}
      </Select>

      <Button type="primary" onClick={loadOrders}>
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
}

export default OrderManagement;

