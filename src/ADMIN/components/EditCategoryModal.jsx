import React from "react";
import { Modal, Input, Select, Form } from "antd";

const { Option } = Select;

const EditCategoryModal = ({
  visible,
  onCancel,
  onSubmit,
  category,
  setCategory,
  disabledActiveOption, // ✅ thêm prop
}) => {
  if (!category) return null;

  const isEditingToActive = category.status === "active";

  return (
    <Modal
      open={visible}
      title="Chỉnh sửa danh mục"
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Cập nhật"
      cancelText="Hủy"
      okButtonProps={{
        style: {
          backgroundColor: "#DBB671",
          borderColor: "#DBB671",
          color: "#000",
        },
      }}
    >
      <Form layout="vertical">
        <Form.Item label="Tên danh mục">
          <Input
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Select
            value={category.status || "inactive"} // fallback an toàn
            onChange={(value) => setCategory({ ...category, status: value })}
          >
            <Option value="inactive">Không hoạt động</Option>
            {(!disabledActiveOption || isEditingToActive) && (
              <Option value="active">Hoạt động</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item label="Ảnh danh mục">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setCategory((prev) => ({
                ...prev,
                category_image: file,
              }));
            }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCategoryModal;
