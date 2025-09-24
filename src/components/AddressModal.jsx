import React, { useEffect } from "react";
import { Modal, Form, Input, Checkbox } from "antd";

const AddressModal = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (!open) return;
    form.resetFields();

    const currentStatus = (initialValues?.status || "").toLowerCase(); // "default" | "non-default" | "deleted" | ""
    form.setFieldsValue({
      recipient_name: initialValues?.recipient_name || "",
      phone: initialValues?.phone || "",
      address_line: initialValues?.address_line || "",
      // chỉ coi là default nếu đúng "default"
      isDefault: currentStatus === "default",
    });
  }, [open, initialValues, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      const isDefault = !!values.isDefault;
      const payload = {
        recipient_name: values.recipient_name.trim(),
        phone: values.phone.trim(),
        address_line: values.address_line.trim(),
        // ✅ SỬA TẠI ĐÂY: không tick => "non-default"
        status: isDefault ? "default" : "non-default",
      };
      onSubmit?.(payload);
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title={initialValues ? "Sửa địa chỉ" : "Thêm địa chỉ"}
      okText={initialValues ? "Cập nhật" : "Thêm"}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên người nhận"
          name="recipient_name"
          rules={[{ required: true, message: "Nhập tên người nhận" }]}
        >
          <Input placeholder="Nguyễn Văn A" />
        </Form.Item>

        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[
            { required: true, message: "Nhập số điện thoại" },
            { pattern: /^0\d{9,10}$/, message: "SĐT không hợp lệ" },
          ]}
        >
          <Input placeholder="0987xxxxxx" />
        </Form.Item>

        <Form.Item
          label="Địa chỉ"
          name="address_line"
          rules={[{ required: true, message: "Nhập địa chỉ" }]}
        >
          <Input.TextArea
            placeholder="123 Đường ABC, Quận 1, TP.HCM"
            autoSize
          />
        </Form.Item>

        <Form.Item name="isDefault" valuePropName="checked">
          <Checkbox>Đặt làm mặc định</Checkbox>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddressModal;
