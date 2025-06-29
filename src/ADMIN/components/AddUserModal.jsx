import React from "react";
import { Modal, Input, Select, Upload, Button, Form, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddUserModal = ({ visible, onCancel, onSubmit, user, setUser }) => {
  const handleChange = (key, value) => {
    setUser({ ...user, [key]: value });
  };

  return (
    <Modal
      title="Thêm người dùng"
      open={visible}
      onCancel={onCancel}
      onOk={() => onSubmit()}
      okText="Thêm"
      cancelText="Huỷ"
      okButtonProps={{
        style: {
          backgroundColor: "#DBB671",
          borderColor: "#DBB671",
          color: "#000",
        },
      }}
    >
      <Form layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Tên người dùng"
              required
              rules={[
                { required: true, message: "Vui lòng nhập tên người dùng!" },
              ]}
            >
              <Input
                value={user.username}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Email"
              required
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Vui lòng nhập email hợp lệ!",
                },
              ]}
            >
              <Input
                value={user.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Mật khẩu"
              required
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                value={user.password}
                onChange={(e) => handleChange("password", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Số điện thoại"
              required
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input
                value={user.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Địa chỉ"
              required
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input
                value={user.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Trạng thái" required>
              <Select
                value={user.status}
                onChange={(value) => handleChange("status", value)}
              >
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="Vai trò" required>
              <Select
                value={user.role}
                onChange={(value) => handleChange("role", value)}
              >
                <Option value={1}>Admin</Option>
                <Option value={0}>User</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="Ảnh đại diện">
              <Upload
                beforeUpload={(file) => {
                  handleChange("avatar", file);
                  return false;
                }}
                showUploadList={{ showRemoveIcon: true }}
                onRemove={() => handleChange("avatar", null)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddUserModal;
