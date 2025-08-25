import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Button,
  Space,
  Modal,
  Tag,
  DatePicker,
  Select,
  message,
  Switch, // 👈 thêm
} from "antd";
import {
  fetchVouchers,
  createVoucher,
  updateVoucher,
  deleteVoucher,
} from "@adminApi/voucherApi";
import dayjs from "dayjs";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import VoucherModal from "@adminComponents/VoucherModal";

const { RangePicker } = DatePicker;
const { Option } = Select;

const VoucherManagement = () => {
  const [vouchers, setVouchers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // loading theo từng switch
  const [switchLoading, setSwitchLoading] = useState({}); // { [id_voucher]: boolean }

  const getVouchers = async () => {
    try {
      const data = await fetchVouchers();    // trả về mảng vouchers
      setVouchers(data);
    } catch (err) {
      console.error("Failed to fetch vouchers:", err);
    }
  };

  useEffect(() => {
    getVouchers();
  }, []);

  const filteredVouchers = vouchers.filter((voucher) =>
    (voucher.code || "").toLowerCase().includes(searchKeyword.toLowerCase())
  );

  // ====== Toggle nhanh trạng thái (active <-> inactive) ======
  const handleQuickToggle = async (row, checked) => {
    const nextStatus = checked ? "active" : "inactive";
    if (row.status === nextStatus) return;

    setSwitchLoading((p) => ({ ...p, [row.id_voucher]: true }));
    try {
      // chỉ đổi mỗi status
      const fd = new FormData();
      fd.append("status", nextStatus);
      await updateVoucher(row.id_voucher, fd);

      setVouchers((prev) =>
        prev.map((it) =>
          it.id_voucher === row.id_voucher ? { ...it, status: nextStatus } : it
        )
      );
      message.success(
        nextStatus === "active" ? "Đã chuyển sang Hoạt động" : "Đã chuyển sang Không hoạt động"
      );
    } catch (err) {
      console.error("Đổi trạng thái thất bại:", err);
      message.error("Đổi trạng thái thất bại");
    } finally {
      setSwitchLoading((p) => ({ ...p, [row.id_voucher]: false }));
    }
  };

  const handleDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc chắn muốn xoá voucher này?",
      okText: "Xoá",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteVoucher(id);
          message.success("Đã xoá thành công");
          await getVouchers();
        } catch (err) {
          console.error("Delete failed", err);
          message.error("Không thể xoá voucher");
        }
      },
    });
  };

  const columns = [
    {
      title: "Mã voucher",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Giảm giá",
      key: "discount",
      render: (_, record) =>
        record.type === "percentage"
          ? `${record.discount_amount}%`
          : `${Number(record.discount_amount || 0).toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Đơn tối thiểu",
      dataIndex: "min_order_amount",
      render: (amount) => `${Number(amount || 0).toLocaleString("vi-VN")}đ`,
    },
    {
      title: "Giảm tối đa",
      dataIndex: "max_discount_amount",
      render: (amount) =>
        amount ? `${Number(amount).toLocaleString("vi-VN")}đ` : "Không giới hạn",
    },
    {
      title: "Thời gian",
      key: "duration",
      render: (_, record) =>
        `${dayjs(record.start_date).format("DD/MM/YYYY")} - ${dayjs(
          record.end_date
        ).format("DD/MM/YYYY")}`,
    },
    {
      title: "Giới hạn lượt dùng",
      dataIndex: "usage_limit",
      width: 140,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 200,
      align: "center",
      render: (status, record) => (
        <Space direction="vertical" size={4} style={{ alignItems: "center" }}>
          <Tag color={status === "active" ? "green" : "red"}>
            {status === "active" ? "Hoạt động" : "Không hoạt động"}
          </Tag>
          <Switch
            checked={status === "active"}
            loading={!!switchLoading[record.id_voucher]}
            onChange={(checked) => handleQuickToggle(record, checked)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
        </Space>
      ),
      filters: [
        { text: "Hoạt động", value: "active" },
        { text: "Không hoạt động", value: "inactive" },
      ],
      onFilter: (val, rec) => rec.status === val,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            style={{ backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" }}
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedVoucher(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            style={{ backgroundColor: "#DF0404", borderColor: "#DF0404", color: "#fff" }}
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id_voucher)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Quản lý voucher</h2>

      <div style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Input
          placeholder="Tìm theo mã voucher..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 250 }}
        />

        <Button
          style={{ backgroundColor: "#16C098", borderColor: "#16C098", color: "#fff" }}
          icon={<PlusOutlined />}
          onClick={() => {
            setSelectedVoucher(null);
            setModalVisible(true);
          }}
        >
          Thêm voucher
        </Button>

        <Button onClick={getVouchers}>Làm mới</Button>
      </div>

      <Table
        dataSource={filteredVouchers.map((v) => ({ ...v, key: v.id_voucher }))}
        columns={columns}
        pagination={{ pageSize: 6 }}
        rowKey="key"
      />

      <VoucherModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        voucher={selectedVoucher}
        onSubmit={async (formData) => {
          try {
            if (selectedVoucher) {
              await updateVoucher(selectedVoucher.id_voucher, formData);
              message.success("Cập nhật voucher thành công");
            } else {
              await createVoucher(formData);
              message.success("Tạo voucher thành công");
            }
            setModalVisible(false);
            await getVouchers();
          } catch (err) {
            console.error("Lỗi khi gửi form:", err);
            message.error("Thao tác thất bại");
          }
        }}
      />
    </div>
  );
};

export default VoucherManagement;
