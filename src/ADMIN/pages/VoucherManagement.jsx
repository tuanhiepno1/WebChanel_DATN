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

  const getVouchers = async () => {
    try {
      const data = await fetchVouchers(); // <-- data chính là mảng vouchers
      setVouchers(data); // <-- dùng trực tiếp
    } catch (err) {
      console.error("Failed to fetch vouchers:", err);
    }
  };

  useEffect(() => {
    getVouchers();
  }, []);

  const filteredVouchers = vouchers.filter((voucher) =>
    voucher.code.toLowerCase().includes(searchKeyword.toLowerCase())
  );

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
      render: (text, record) => {
        return record.type === "percentage"
          ? `${record.discount_amount}%`
          : `${record.discount_amount.toLocaleString()}đ`;
      },
    },
    {
      title: "Điều kiện tối thiểu",
      dataIndex: "min_order_amount",
      render: (amount) => `${Number(amount).toLocaleString()}đ`,
    },
    {
      title: "Giảm tối đa",
      dataIndex: "max_discount_amount",
      render: (amount) =>
        amount ? `${Number(amount).toLocaleString()}đ` : "Không giới hạn",
    },
    {
      title: "Thời gian",
      key: "duration",
      render: (_, record) => {
        return `${dayjs(record.start_date).format("DD/MM/YYYY")} - ${dayjs(
          record.end_date
        ).format("DD/MM/YYYY")}`;
      },
    },
    {
      title: "Giới hạn lượt dùng",
      dataIndex: "usage_limit",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            style={{
              backgroundColor: "#DBB671",
              borderColor: "#DBB671",
              color: "#000",
            }}
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedVoucher(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            style={{
              backgroundColor: "#DF0404",
              borderColor: "#DF0404",
              color: "#fff",
            }}
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id_voucher)}
          >
            Ẩn
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Quản lý voucher</h2>

      <div
        style={{ marginBottom: 16, display: "flex", gap: 12, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Tìm theo mã voucher..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 250 }}
        />

        <Button
          style={{
            backgroundColor: "#16C098",
            borderColor: "#16C098",
            color: "#fff",
          }}
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
