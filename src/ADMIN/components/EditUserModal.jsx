import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Upload,
  Button,
  Row,
  Col,
  Avatar,
  Select,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

const EditUserModal = ({ visible, onCancel, onSubmit, user }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role?.toString(),
        status: user.status || "active", // default là active nếu không có
      });
    }
  }, [user, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("address", values.address);
      formData.append("role", values.role);
      formData.append("status", values.status);

      if (values.avatar && values.avatar[0]?.originFileObj) {
        formData.append("avatar", values.avatar[0].originFileObj);
      }

      await onSubmit(formData);
      form.resetFields();
    } catch (err) {
      console.error("Lỗi validate form:", err);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      title="Sửa thông tin người dùng"
      okText="Lưu"
      cancelText="Hủy"
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="Tên người dùng"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="Phân quyền"
              rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
            >
              <Select>
                <Select.Option value="1">Admin</Select.Option>
                <Select.Option value="0">User</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                <Select.Option value="active">Hoạt động</Select.Option>
                <Select.Option value="inactive">Không hoạt động</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="avatar"
          label="Ảnh đại diện"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
        >
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>

        {user?.image && (
          <div style={{ marginTop: 8 }}>
            <span>Ảnh hiện tại:</span>
            <br />
            <Avatar
              size={64}
              src={`${import.meta.env.VITE_ASSET_BASE_URL}${user.image}`}
            />
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default EditUserModal;
