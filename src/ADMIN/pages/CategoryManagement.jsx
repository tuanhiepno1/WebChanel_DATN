import React, { useEffect, useState } from "react";
import {
  Table,
  Input,
  Select,
  Tag,
  Image,
  Pagination,
  Typography,
  Button,
  Space,
  Modal,
  List,
  Switch,            // 👈 thêm
  message,           // 👈 thêm
} from "antd";
import { SearchOutlined, EyeOutlined, EditOutlined } from "@ant-design/icons";
import {
  fetchAdminCategories,
  updateAdminCategory,
  createAdminCategory,
  createAdminSubcategory,
  updateAdminSubcategory,
} from "@adminApi/categoryApi";
import EditCategoryModal from "@adminComponents/EditCategoryModal";
import AddCategoryModal from "@adminComponents/AddCategoryModal";
import AddSubcategoryModal from "@adminComponents/AddSubcategoryModal";
import EditSubcategoryModal from "@adminComponents/EditSubcategoryModal";

const { Option } = Select;
const { Title } = Typography;

const CategoryManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [filterStatus, setFilterStatus] = useState("");

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", status: "active" });

  const [addSubModalVisible, setAddSubModalVisible] = useState(false);
  const [editSubModalVisible, setEditSubModalVisible] = useState(false);
  const [subCategoryForm, setSubCategoryForm] = useState({
    id: null,
    name: "",
    status: "active",
  });

  // loading theo từng hàng khi toggle switch
  const [switchLoading, setSwitchLoading] = useState({}); // { [id_category]: boolean }

  useEffect(() => {
    reloadCategories();
  }, []);

  const reloadCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminCategories();
      const formatted = res.map((cat) => {
        const productCount =
          cat.subcategories?.reduce(
            (total, sub) => total + (sub.product_count || 0),
            0
          ) || 0;
        return {
          key: cat.id_category,
          image: cat.category_image || "https://via.placeholder.com/50",
          name: String(cat.category_name || "").toUpperCase(),
          quantity: productCount,
          status: cat.status, // 'active' | 'inactive'
          subcategories: cat.subcategories || [],
          raw: cat, // nếu cần thêm field khác sau này
        };
      });

      setData(formatted);

      // nếu đang mở modal chi tiết, sync lại bản ghi
      if (selectedCategory) {
        const updated = formatted.find((i) => i.key === selectedCategory.key);
        if (updated) setSelectedCategory(updated);
      }

      return formatted;
    } catch (err) {
      console.error("Lỗi khi tải danh mục:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (record) => {
    setSelectedCategory(record);
    setModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingCategory({
      id: record.key,
      name: record.name,
      status: record.status || "active",
    });
    setEditModalVisible(true);
  };

  /* ========= Toggle nhanh trạng thái (active <-> inactive) ========= */
  const handleQuickToggle = async (record, checked) => {
    const nextStatus = checked ? "active" : "inactive";
    const prevStatus = record.status;

    if (prevStatus === nextStatus) return;

    // Kiểm tra giới hạn tối đa 4 danh mục active
    if (nextStatus === "active") {
      const activeCount = data.filter((d) => d.status === "active").length;
      const isCurrentlyInactive = prevStatus === "inactive";
      if (isCurrentlyInactive && activeCount >= 4) {
        Modal.warning({
          title: "Không thể kích hoạt danh mục",
          content:
            "Chỉ được phép có tối đa 4 danh mục hoạt động. Vui lòng tắt hoạt động danh mục khác trước.",
        });
        return;
      }
    }

    setSwitchLoading((p) => ({ ...p, [record.key]: true }));
    try {
      await updateAdminCategory(record.key, { status: nextStatus }); // chỉ đổi status
      // cập nhật local state
      setData((prev) =>
        prev.map((it) => (it.key === record.key ? { ...it, status: nextStatus } : it))
      );
      // cập nhật selectedCategory (nếu đang mở modal chi tiết)
      setSelectedCategory((prev) =>
        prev && prev.key === record.key ? { ...prev, status: nextStatus } : prev
      );
      message.success(
        nextStatus === "active" ? "Đã chuyển sang Hoạt động" : "Đã chuyển sang Không hoạt động"
      );
    } catch (err) {
      console.error("Toggle status error:", err);
      message.error("Đổi trạng thái thất bại");
    } finally {
      setSwitchLoading((p) => ({ ...p, [record.key]: false }));
    }
  };

  const handleEditSubcategory = (subcategory) => {
    setSubCategoryForm({
      id: subcategory.id_subcategory,
      name: subcategory.category_name,
      status: subcategory.status,
    });
    setEditSubModalVisible(true);
  };

  const handleSubmitEditSubcategory = async () => {
    try {
      await updateAdminSubcategory(subCategoryForm.id, {
        category_name: subCategoryForm.name,
        id_category: selectedCategory.key,
        status: subCategoryForm.status,
      });

      setEditSubModalVisible(false);

      const updatedData = await reloadCategories();
      const updated = updatedData.find((item) => item.key === selectedCategory.key);
      if (updated) setSelectedCategory(updated);
    } catch (err) {
      console.error("Lỗi khi sửa danh mục con:", err);
    }
  };

  const handleAddSubcategory = () => {
    setSubCategoryForm({ id: null, name: "", status: "active" });
    setAddSubModalVisible(true);
  };

  const handleSubmitAddSubcategory = async () => {
    if (!selectedCategory?.key) return;
    try {
      await createAdminSubcategory({
        category_name: subCategoryForm.name,
        id_category: selectedCategory.key,
        status: subCategoryForm.status,
      });

      setAddSubModalVisible(false);

      const updatedData = await reloadCategories();
      const updated = updatedData.find((item) => item.key === selectedCategory.key);
      if (updated) setSelectedCategory(updated);
    } catch (err) {
      console.error("Lỗi khi thêm danh mục con:", err);
    }
  };

  const handleSubmitEditCategory = async () => {
    try {
      const isActivating = editingCategory.status === "active";

      const currentCategory = data.find((item) => item.key === editingCategory.id);
      const isCurrentlyInactive = currentCategory?.status === "inactive";

      const activeCount = data.filter((item) => item.status === "active").length;

      if (isActivating && isCurrentlyInactive && activeCount >= 4) {
        Modal.warning({
          title: "Không thể kích hoạt danh mục",
          content:
            "Chỉ được phép có tối đa 4 danh mục hoạt động. Vui lòng tắt hoạt động danh mục khác trước.",
        });
        return;
      }

      const payload = {};
      const nameEdited = editingCategory.name?.trim() || "";
      const currentName = currentCategory?.name?.trim() || "";
      if (nameEdited !== currentName) payload.category_name = nameEdited;
      if (editingCategory.status !== currentCategory.status)
        payload.status = editingCategory.status;
      if (editingCategory.category_image instanceof File)
        payload.category_image = editingCategory.category_image;

      if (Object.keys(payload).length === 0) {
        Modal.info({
          title: "Không có thay đổi",
          content: "Bạn chưa thay đổi thông tin nào để cập nhật.",
        });
        return;
      }

      await updateAdminCategory(editingCategory.id, payload);

      setEditModalVisible(false);
      setEditingCategory(null);
      await reloadCategories();
    } catch (err) {
      console.error("Lỗi khi cập nhật danh mục:", err);
    }
  };

  const handleSubmitAddCategory = async () => {
    try {
      const activeCount = data.filter((item) => item.status === "active").length;

      if (newCategory.status === "active" && activeCount >= 4) {
        Modal.warning({
          title: "Không thể thêm danh mục hoạt động",
          content:
            "Chỉ được phép có tối đa 4 danh mục hoạt động. Vui lòng tắt hoạt động danh mục khác trước.",
        });
        return;
      }

      await createAdminCategory(newCategory);
      setAddModalVisible(false);
      setNewCategory({ name: "", status: "active", category_image: null });
      await reloadCategories();
    } catch (err) {
      console.error("Lỗi khi thêm danh mục:", err);
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (src) => (
        <Image src={src} width={50} height={50} style={{ objectFit: "cover" }} />
      ),
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Số lượng sản phẩm",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 220,
      render: (status, record) => (
        <Space direction="vertical" size={4} style={{ alignItems: "center" }}>
          <Tag color={status === "active" ? "green" : "red"}>
            {status === "active" ? "Hoạt động" : "Không hoạt động"}
          </Tag>
          <Switch
            checked={status === "active"}
            loading={!!switchLoading[record.key]}
            onChange={(checked) => handleQuickToggle(record, checked)}
            checkedChildren="Bật"
            unCheckedChildren="Tắt"
          />
        </Space>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => handleViewDetail(record)}>
            Xem
          </Button>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            style={{ backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" }}
          >
            Sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3}>Quản lý danh mục sản phẩm</Title>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <Input placeholder="Tìm kiếm" prefix={<SearchOutlined />} style={{ width: 300 }} />
        <Select
          placeholder="Lọc theo trạng thái"
          style={{ width: 180 }}
          value={filterStatus || undefined}
          allowClear
          onChange={(value) => setFilterStatus(value)}
          options={[
            { value: "active", label: "Hoạt động" },
            { value: "inactive", label: "Không hoạt động" },
          ]}
        />
        <Button
          style={{ backgroundColor: "#16C098", borderColor: "#16C098", color: "#fff" }}
          onClick={() => setAddModalVisible(true)}
        >
          + Thêm danh mục
        </Button>
      </div>

      <Table
        dataSource={data.filter((item) => (filterStatus ? item.status === filterStatus : true))}
        columns={columns}
        pagination={{ pageSize: 6 }}
        rowKey="key"
        loading={loading}
        rowClassName={() => "equal-height-row"}
      />

      {/* Modal danh mục con */}
      <Modal
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        title={`Danh mục con của: ${selectedCategory?.name}`}
        footer={[
          <Button
            key="add"
            style={{ backgroundColor: "#16C098", borderColor: "#16C098", color: "#fff" }}
            onClick={handleAddSubcategory}
          >
            + Thêm danh mục con
          </Button>,
        ]}
      >
        {selectedCategory?.subcategories?.length ? (
          <List
            itemLayout="horizontal"
            dataSource={selectedCategory.subcategories}
            renderItem={(item) => (
              <List.Item
                actions={[
                  <Button
                    key="edit"
                    size="small"
                    onClick={() => handleEditSubcategory(item)}
                    style={{ backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" }}
                  >
                    Sửa
                  </Button>,
                ]}
              >
                <List.Item.Meta
                  title={item.category_name}
                  description={
                    <>
                      <p>Slug: {item.slug}</p>
                      <Tag color={item.status === "active" ? "green" : "red"}>
                        {item.status === "active" ? "Hoạt động" : "Không hoạt động"}
                      </Tag>
                    </>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <p>Không có danh mục con nào.</p>
        )}
      </Modal>

      {/* Modals Sửa/Thêm danh mục & danh mục con */}
      <EditCategoryModal
        visible={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onSubmit={handleSubmitEditCategory}
        category={editingCategory}
        setCategory={setEditingCategory}
        disabledActiveOption={
          data.reduce((count, item) => {
            if (item.key === editingCategory?.id && editingCategory?.status === "inactive") {
              return count;
            }
            return item.status === "active" ? count + 1 : count;
          }, 0) >= 4
        }
      />

      <AddCategoryModal
        visible={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        onSubmit={handleSubmitAddCategory}
        newCategory={newCategory}
        setNewCategory={setNewCategory}
        disabledActiveOption={
          data.reduce((count, item) => (item.status === "active" ? count + 1 : count), 0) >= 4
        }
      />

      <AddSubcategoryModal
        visible={addSubModalVisible}
        onCancel={() => setAddSubModalVisible(false)}
        onSubmit={handleSubmitAddSubcategory}
        subcategory={subCategoryForm}
        setSubcategory={setSubCategoryForm}
      />

      <EditSubcategoryModal
        visible={editSubModalVisible}
        onCancel={() => setEditSubModalVisible(false)}
        onSubmit={handleSubmitEditSubcategory}
        subcategory={subCategoryForm}
        setSubcategory={setSubCategoryForm}
      />
    </div>
  );
};

export default CategoryManagement;
