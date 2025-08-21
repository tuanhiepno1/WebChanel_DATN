import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { changeUserPassword } from "@api/userApi";

const ChangePasswordModal = ({ visible, onCancel, userId }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleOk = () => form.submit();

  const onFinish = async (values) => {
    const { old_password, new_password, confirm_password } = values;
    if (new_password !== confirm_password) {
      message.warning("Mật khẩu xác nhận không khớp.");
      return;
    }
    try {
      setLoading(true);
      await changeUserPassword(userId, { old_password, new_password, confirm_password });
      message.success("Đổi mật khẩu thành công.");
      form.resetFields();
      onCancel();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Đổi mật khẩu thất bại.";
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={visible}
      onCancel={() => {
        form.resetFields();
        onCancel();
      }}
      onOk={handleOk}
      confirmLoading={loading}
      okText="Lưu"
      okButtonProps={{
        style: { backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" },
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="old_password"
          label="Mật khẩu hiện tại"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu hiện tại" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="new_password"
          label="Mật khẩu mới"
          rules={[
            { required: true, message: "Vui lòng nhập mật khẩu mới" },
            { min: 6, message: "Ít nhất 6 ký tự" },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm_password"
          label="Xác nhận mật khẩu mới"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Vui lòng nhập lại mật khẩu mới" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) return Promise.resolve();
                return Promise.reject(new Error("Mật khẩu xác nhận không khớp"));
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
