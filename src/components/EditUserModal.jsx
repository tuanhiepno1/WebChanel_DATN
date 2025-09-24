import React, { useEffect, useState } from "react";
import { Modal, Form, Input, message, Upload, Button, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { updateUser as updateUserApi } from "@api/userApi";
import { updateUserInfo } from "@features/authSlice";

const toAbs = (path) => {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  const base =
    import.meta.env.VITE_ASSET_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "";
  const b = (base || "").replace(/\/+$/, "");
  const p = String(path).replace(/^\/+/, "");
  return b ? `${b}/${p}` : `/${p}`;
};

const EditUserModal = ({ visible, onClose, user, onSuccess }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && user) {
      form.setFieldsValue({
        username: user?.username || "",
        email: user?.email || "", // chỉ hiển thị
      });
      setAvatarFile(null);
    }
  }, [visible, user, form]);

  const handleFinish = async (values) => {
    if (!user?.id_user) {
      message.error("Không xác định được người dùng để cập nhật.");
      return;
    }

    try {
      setSubmitting(true);

      // ✅ Luôn dùng FormData để phù hợp route POST multipart
      const fd = new FormData();
      fd.append("username", values.username.trim());
      if (avatarFile) fd.append("image", avatarFile); // key phải trùng cột "image"

      const resp = await updateUserApi(user.id_user, fd);

      // Chuẩn hoá dữ liệu trả về
      const returnedUser = resp?.data || resp?.user || {};
      const merged = {
        ...user,
        ...returnedUser,
        image: toAbs(returnedUser?.image ?? user?.image),
      };

      dispatch(updateUserInfo(merged));
      message.success("Cập nhật thông tin thành công");
      onClose?.();
      onSuccess?.();
    } catch (err) {
      const errorData = err?.response?.data;
      const msg =
        errorData?.message ||
        (errorData?.errors &&
          errorData.errors[Object.keys(errorData.errors)[0]]?.[0]) ||
        "Cập nhật thất bại";
      message.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Sửa thông tin người dùng"
      open={visible}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText="Lưu"
      confirmLoading={submitting}
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

        {/* Email: hiển thị, không cho sửa */}
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>

        <Form.Item label="Ảnh đại diện">
          <Upload
            beforeUpload={(file) => {
              setAvatarFile(file);
              return false; // chặn auto upload
            }}
            onRemove={() => setAvatarFile(null)}
            maxCount={1}
            accept="image/*"
            listType="picture"
          >
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
          <div style={{ marginTop: 8 }}>
            <Avatar src={toAbs(user?.image)} size={64} />
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditUserModal;
