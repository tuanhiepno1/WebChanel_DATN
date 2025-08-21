import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateUser as updateUserApi } from "@api/userApi";
import { updateUserInfo } from "@features/authSlice";

const EditUserModal = ({ visible, onClose, user, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);

  useEffect(() => {
    if (visible && user) {
      // Prefill TẤT CẢ các field mà API yêu cầu, kể cả email (dù disabled)
      form.setFieldsValue({
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
      });
      setAvatarFile(null);
    }
  }, [visible, user, form]);

  const handleFinish = async (values) => {
    if (!user?.id_user) {
      message.error("Không xác định được người dùng để cập nhật.");
      return;
    }

    // Payload đúng theo API: username, email, phone, address (+ avatar nếu có)
    const payload = {
      username: values.username ?? user.username,
      email: values.email ?? user.email,        // email vẫn được gửi, là giá trị cũ
      phone: values.phone ?? user.phone,
      address: values.address ?? user.address,
      // avatar chỉ append khi có file mới
      ...(avatarFile ? { avatar: avatarFile } : {}),
    };

    try {
      const response = await updateUserApi(user.id_user, payload);

      // Chuẩn hoá URL ảnh đại diện nếu BE trả path tương đối
      const userWithFullImage = {
        ...response.user,
        image: response.user?.image?.startsWith("http")
          ? response.user.image
          : `${import.meta.env.VITE_ASSET_BASE_URL}${response.user?.image || ""}`,
      };
      dispatch(updateUserInfo(userWithFullImage));

      message.success("Cập nhật thông tin thành công");
      onClose();
      onSuccess?.();
    } catch (error) {
      const errorData = error?.response?.data;
      const errMsg =
        errorData?.message ||
        (errorData?.errors &&
          errorData.errors[Object.keys(errorData.errors)[0]]?.[0]) ||
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
        style: { backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" },
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

        {/* Email: hiển thị nhưng không cho sửa, vẫn có name để submit giá trị cũ */}
        <Form.Item label="Email" name="email"
          rules={[{ required: true, type: "email", message: "Email không hợp lệ" }]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Vui lòng nhập số điện thoại" },
            { pattern: /^[0-9]+$/, message: "Số điện thoại chỉ được chứa số" },
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

        {/* KHÔNG có form đổi mật khẩu ở đây */}
        <Form.Item label="Ảnh đại diện">
          <Upload
            beforeUpload={(file) => { setAvatarFile(file); return false; }}
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
