import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { updateUser as updateUserApi } from "@api/userApi";
import { updateUserInfo } from "@features/authSlice";

const EditUserModal = ({ visible, onClose, user, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (visible) {
      form.setFieldsValue({
        username: user?.username,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
        newPassword: "",
      });
    }
  }, [visible, user, form]);

  const handleFinish = async (values) => {
    if (!user?.id_user) {
      message.error("Không xác định được người dùng để cập nhật.");
      return;
    }

    try {
      const updatedPayload = {
        username: values.username,
        email: values.email,
        phone: Number(values.phone),
        address: values.address,
      };

      if (values.newPassword) {
        updatedPayload.password = values.newPassword;
      }

      const response = await updateUserApi(user.id_user, updatedPayload);

      dispatch(updateUserInfo(response.user));
      message.success("Cập nhật thông tin thành công");

      try {
        onClose(); // tách riêng
        onSuccess?.(); // tách riêng
      } catch (callbackError) {
        console.error("Lỗi callback sau cập nhật:", callbackError);
      }
    } catch (error) {
      const errorData = error.response?.data;
      const errMsg =
        errorData?.message ||
        errorData?.errors?.[Object.keys(errorData.errors || {})[0]]?.[0] ||
        "Cập nhật thất bại";
      message.error(errMsg);
    }
  };

  return (
    <Modal
      title="Sửa thông tin người dùng"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu"
      okButtonProps={{
        style: {
          backgroundColor: "#DBB671",
          borderColor: "#DBB671",
          color: "#000",
        },
      }}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item
          label="Tên người dùng"
          name="username"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[{ min: 6, message: "Mật khẩu mới phải ít nhất 6 ký tự" }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            {
              pattern: /^[0-9]+$/,
              message: "Số điện thoại chỉ được chứa số",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address"
          rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
