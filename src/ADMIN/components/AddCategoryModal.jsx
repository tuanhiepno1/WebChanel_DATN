import React from "react";
import { Modal, Input, Select, Form } from "antd";

const { Option } = Select;

const AddCategoryModal = ({
  visible,
  onCancel,
  onSubmit,
  newCategory,
  setNewCategory,
  disabledActiveOption,
}) => {
  return (
    <Modal
      open={visible}
      title="Thêm danh mục"
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Thêm"
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
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Select
            value={newCategory.status || "inactive"}
            onChange={(value) =>
              setNewCategory({ ...newCategory, status: value })
            }
          >
            <Option value="active" disabled={disabledActiveOption}>
              Hoạt động
            </Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Hình ảnh">
          <Input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewCategory({
                ...newCategory,
                category_image: e.target.files[0],
              })
            }
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddCategoryModal;
