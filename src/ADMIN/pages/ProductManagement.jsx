import React, { useEffect, useState } from "react";
import { Table, Input, Select, Button, Tag, Space, message, Modal } from "antd";
import { fetchAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from "@adminApi/productApi";
import AddProductModal from "@adminComponents/AddProductModal";
import EditProductModal from "@adminComponents/EditProductModal";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const getProducts = async () => {
    try {
      const res = await fetchAdminProducts();
      setProducts(res || []);
    } catch (err) {
      console.error("Không thể load sản phẩm:", err);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  const handleUpdateProduct = async (id_product, formData) => {
    try {
      await updateAdminProduct(id_product, formData);
      message.success("Cập nhật sản phẩm thành công");
      setEditModalVisible(false);
      getProducts();
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
    }
  };

  const handleDelete = (id_product) => {
  Modal.confirm({
    title: "Bạn có chắc chắn muốn xóa sản phẩm này?",
    onOk: async () => {
      try {
        await deleteAdminProduct(id_product);
        message.success("Đã xóa sản phẩm thành công!");
        await getProducts();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        message.error("Xóa sản phẩm thất bại!");
      }
    },
  });
};


  const filteredData = products.filter((item) => {
    const matchesStatus = !filterStatus || item.status === filterStatus;
    const matchesSearch = item.name?.toLowerCase().includes(searchKeyword.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      width: 100,
      render: (img) => (
        <img
          src={img}
          alt="product"
          style={{ width: 70, height: 70, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      width: 200,
      ellipsis: true,
      align: "center",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 120,
      align: "center",
      render: (price) => (price ? price.toLocaleString("vi-VN") + "₫" : "Chưa cập nhật"),
    },
    {
      title: "Giảm giá",
      dataIndex: "discount",
      key: "discount",
      width: 100,
      align: "center",
      render: (d) => (d ? `${d}%` : "0%"),
    },
    {
      title: "Dung tích",
      dataIndex: "volume",
      key: "volume",
      width: 100,
      align: "center",
      render: (v) => (v ? `${v}ml` : "-"),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      ellipsis: true,
      align: "center",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      width: 100,
      render: (g) => (g === "male" ? "Nam" : g === "female" ? "Nữ" : "Unisex"),
    },
    {
      title: "Lượt xem",
      dataIndex: "views",
      key: "views",
      width: 80,
      align: "center",
    },
    {
      title: "Tồn kho",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 80,
      render: (q) => (q !== null ? q : "-"),
    },
    {
      title: "Đánh giá",
      dataIndex: "rating",
      key: "rating",
      width: 80,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 130,
      render: (status) =>
        status === "active" ? <Tag color="green">Hoạt động</Tag> : <Tag color="red">Không hoạt động</Tag>,
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 130,
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            style={{ backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" }}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            size="small"
            style={{ backgroundColor: "#DF0404", borderColor: "#DF0404", color: "#fff" }}
            onClick={() => handleDelete(record.id_product)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 160px)" }}>
      <h2 style={{ marginBottom: 16 }}>Quản lý sản phẩm</h2>

      <div style={{ marginBottom: 16, display: "flex", flexWrap: "wrap", gap: 12 }}>
        <Input
          placeholder="Tìm kiếm sản phẩm..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 200 }}
        />

        <Select
          placeholder="Lọc trạng thái"
          onChange={(value) => setFilterStatus(value)}
          allowClear
          style={{ width: 180 }}
        >
          <Option value="active">Hoạt động</Option>
          <Option value="inactive">Không hoạt động</Option>
        </Select>

        <Button type="primary" onClick={getProducts}>Làm mới</Button>

        <Button
          style={{ backgroundColor: "#16C098", borderColor: "#16C098", color: "#fff" }}
          onClick={() => setAddModalVisible(true)}
        >
          + Thêm sản phẩm
        </Button>
      </div>

      <Table
        dataSource={filteredData.map((item) => ({ ...item, key: item.id_product }))}
        columns={columns}
        pagination={{ pageSize: 6, showSizeChanger: false }}
        scroll={{ x: 1200 }}
      />

      <AddProductModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSubmit={async (formData) => {
          try {
            await createAdminProduct(formData);
            setAddModalVisible(false);
            await getProducts();
          } catch (err) {
            console.error("Lỗi khi thêm:", err);
          }
        }}
      />

      <EditProductModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        product={selectedProduct}
        onSubmit={handleUpdateProduct}
      />
    </div>
  );
};

export default ProductManagement;
