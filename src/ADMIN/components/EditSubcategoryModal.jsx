import React from "react";
import { Modal, Input, Select, Form } from "antd";

const { Option } = Select;

const EditSubcategoryModal = ({ visible, onCancel, onSubmit, subcategory, setSubcategory }) => {
  if (!subcategory) return null;

  return (
    <Modal
      open={visible}
      title="Chỉnh sửa danh mục con"
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Lưu"
      cancelText="Hủy"
      okButtonProps={{
        style: { backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" },
      }}
    >
      <Form layout="vertical">
        <Form.Item label="Tên danh mục con">
          <Input
            value={subcategory.name}
            onChange={(e) => setSubcategory({ ...subcategory, name: e.target.value })}
          />
        </Form.Item>

        <Form.Item label="Trạng thái">
          <Select
            value={subcategory.status}
            onChange={(value) => setSubcategory({ ...subcategory, status: value })}
          >
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditSubcategoryModal;
