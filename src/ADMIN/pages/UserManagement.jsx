import React, { useEffect, useState } from "react";
import { Table, Tag, Input, Select, Button, Space, Avatar, Modal } from "antd";
import { fetchAdminUsers, updateAdminUser } from "@adminApi/userApi";
import {
  EditOutlined,
  DeleteOutlined,
  UserAddOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import EditUserModal from "@adminComponents/EditUserModal";
import OrderHistoryModal from "@adminComponents/OrderHistoryModal";

const { Option } = Select;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);

  const getUsers = async () => {
    const res = await fetchAdminUsers();
    setUsers(res);
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleDelete = (id_user) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa người dùng này?",
      onOk: async () => {
        console.log("Xoá user với ID:", id_user);
        // TODO: Gọi API xoá user
        await getUsers();
      },
    });
  };

  const filteredUsers = users.filter((user) => {
    const matchName = user.username
      ?.toLowerCase()
      .includes(searchKeyword.toLowerCase());
    const matchRole = !filterRole || String(user.role) === filterRole;
    const matchStatus = !filterStatus || user.status === filterStatus;
    return matchName && matchRole && matchStatus;
  });

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: 90,
      render: (img) => (
        <Avatar
          src={img ? `${import.meta.env.VITE_ASSET_BASE_URL}${img}` : undefined}
          alt="avatar"
          style={{ backgroundColor: "#ccc" }}
        />
      ),
    },
    {
      title: "Tên người dùng",
      dataIndex: "username",
      key: "username",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      align: "center",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      align: "center",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) =>
        role === 1 ? (
          <Tag color="red">Admin</Tag>
        ) : (
          <Tag color="blue">User</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) =>
        status === "active" ? (
          <Tag color="green">Hoạt động</Tag>
        ) : (
          <Tag color="gray">Không hoạt động</Tag>
        ),
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            icon={<ShoppingOutlined />}
            style={{
              backgroundColor: "#4096ff",
              borderColor: "#4096ff",
              color: "#fff",
            }}
            size="small"
            onClick={() => {
              setSelectedUser(record);
              setOrderModalVisible(true);
            }}
          >
            Đơn hàng
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{
              backgroundColor: "#DBB671",
              borderColor: "#DBB671",
              color: "#000",
            }}
            onClick={() => {
              setEditingUser(record);
              setEditModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            style={{
              backgroundColor: "#DF0404",
              borderColor: "#DF0404",
              color: "#fff",
            }}
            size="small"
            onClick={() => handleDelete(record.id_user)}
          >
            Xoá
          </Button>
        </Space>
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
      <h2 style={{ marginBottom: 16 }}>Quản lý người dùng</h2>

      <div
        style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}
      >
        <Input
          placeholder="Tìm kiếm theo tên..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 200 }}
        />

        <Select
          placeholder="Lọc theo vai trò"
          value={filterRole || undefined}
          onChange={(value) => setFilterRole(value)}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="1">Admin</Option>
          <Option value="0">User</Option>
        </Select>

        <Select
          placeholder="Lọc theo trạng thái"
          value={filterStatus || undefined}
          onChange={(value) => setFilterStatus(value)}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="active">Hoạt động</Option>
          <Option value="inactive">Không hoạt động</Option>
        </Select>

        <Button type="primary" onClick={getUsers}>
          Làm mới
        </Button>
      </div>

      <Table
        dataSource={filteredUsers.map((u) => ({ ...u, key: u.id_user }))}
        columns={columns}
        pagination={{ pageSize: 6 }}
        scroll={{ x: "max-content" }}
      />

      <EditUserModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        user={editingUser}
        onSubmit={async (formData) => {
          try {
            await updateAdminUser(editingUser.id_user, formData);
            setEditModalVisible(false);
            await getUsers();
          } catch (err) {
            console.error("Cập nhật thất bại:", err);
          }
        }}
      />

      <OrderHistoryModal
        visible={orderModalVisible}
        onCancel={() => setOrderModalVisible(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default UserManagement;
