import React, { useState } from "react";
import { Modal, Form, Input, Button, message } from "antd";
import {
  checkEmailAndSendCode,
  checkCode,
  resetPassword,
} from "@api/userApi";

const ChangePasswordModal = ({ visible, onCancel, email }) => {
  const [form] = Form.useForm();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleSendCode = async () => {
    try {
      setLoading(true);
      await checkEmailAndSendCode(email);
      message.success("Mã xác nhận đã được gửi đến email.");
      setStep(2);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckCode = async () => {
    try {
      const values = await form.validateFields(["code"]);
      setLoading(true);
      await checkCode({ email, code: values.code });
      message.success("Mã xác nhận đúng.");
      setStep(3);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const values = await form.validateFields(["password", "confirm_password"]);
      if (values.password !== values.confirm_password) {
        message.warning("Mật khẩu xác nhận không khớp.");
        return;
      }
      setLoading(true);
      await resetPassword({ email, password: values.password, confirm_password: values.confirm_password });
      message.success("Đổi mật khẩu thành công.");
      form.resetFields();
      setStep(1);
      onCancel();
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Đổi mật khẩu"
      open={visible}
      onCancel={() => {
        onCancel();
        setStep(1);
        form.resetFields();
      }}
      footer={null}
    >
      <Form form={form} layout="vertical">
        {step === 1 && (
          <>
            <Form.Item label="Email">
              <Input value={email} disabled />
            </Form.Item>
            <Button
              type="primary"
              onClick={handleSendCode}
              loading={loading}
              style={{ width: "100%", backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" }}
            >
              Gửi mã xác nhận
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Form.Item
              name="code"
              label="Mã xác nhận"
              rules={[{ required: true, message: "Vui lòng nhập mã xác nhận" }]}
            >
              <Input placeholder="Nhập mã xác nhận gửi đến email" />
            </Form.Item>
            <Button
              type="primary"
              onClick={handleCheckCode}
              loading={loading}
              style={{ width: "100%", backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" }}
            >
              Xác nhận mã
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Form.Item
              name="password"
              label="Mật khẩu mới"
              rules={[{ required: true, min: 6, message: "Ít nhất 6 ký tự" }]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới" />
            </Form.Item>
            <Form.Item
              name="confirm_password"
              label="Xác nhận mật khẩu"
              rules={[{ required: true, min: 6, message: "Ít nhất 6 ký tự" }]}
            >
              <Input.Password placeholder="Nhập lại mật khẩu mới" />
            </Form.Item>
            <Button
              type="primary"
              onClick={handleResetPassword}
              loading={loading}
              style={{ width: "100%", backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" }}
            >
              Đặt lại mật khẩu
            </Button>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
