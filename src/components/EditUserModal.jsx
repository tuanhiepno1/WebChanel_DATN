import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateUser as updateUserApi } from "@api/userApi";
import { updateUserInfo } from "@features/authSlice";
import { image } from "framer-motion/client";

const EditUserModal = ({ visible, onClose, user, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user?.username,
        email: user?.email,
        phone: user?.phone,
        address: user?.address,
        newPassword: "",
      });
      setAvatarFile(null); // reset file khi mở modal
    }
  }, [visible, user, form]);

  const handleFinish = async (values) => {
    if (!user?.id_user) {
      message.error("Không xác định được người dùng để cập nhật.");
      return;
    }

    const updatedPayload = {
      username: values.username,
      email: values.email,
      phone: values.phone,
      address: values.address,
      avatar: avatarFile,
    };

    if (values.newPassword) {
      updatedPayload.password = values.newPassword;
    }

    try {
      const response = await updateUserApi(user.id_user, updatedPayload);
      dispatch(updateUserInfo(response.user));
      
      const userWithFullImage = {
        ...response.user,
        image: response.user.image?.startsWith("http")
          ? response.user.image
          : `${import.meta.env.VITE_ASSET_BASE_URL}${response.user.image}`,
      };
      dispatch(updateUserInfo(userWithFullImage));

      message.success("Cập nhật thông tin thành công");
      onClose();
      onSuccess?.();
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

        <Form.Item label="Ảnh đại diện">
          <Upload
            beforeUpload={(file) => {
              setAvatarFile(file);
              return false;
            }}
            maxCount={1}
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
