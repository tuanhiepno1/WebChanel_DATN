import React from "react";
import { Modal, Input, Select, Form } from "antd";

const { Option } = Select;

const AddSubcategoryModal = ({ visible, onCancel, onSubmit, subcategory, setSubcategory }) => {
  return (
    <Modal
      open={visible}
      title="Thêm danh mục con"
      onCancel={onCancel}
      onOk={onSubmit}
      okText="Thêm"
      cancelText="Hủy"
      okButtonProps={{
        style: { backgroundColor: "#16C098", borderColor: "#16C098", color: "#fff" },
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

export default AddSubcategoryModal;
