import React, { useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, InputNumber, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { createAdminArticle } from "@adminApi/newsApi";

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList || []);

const AddNewsModal = ({ open, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const file = values.image?.[0]?.originFileObj;
      if (!file) {
        message.warning("Vui lòng chọn ảnh bài viết");
        return;
      }
      setSubmitting(true);
      await createAdminArticle(
        {
          id_user: values.id_user,
          title: values.title,
          content: values.content,
          status: values.status,
          image: file,
        },
        undefined
      );
      message.success("Tạo bài viết thành công");
      form.resetFields();
      onSuccess?.();
    } catch (e) {
      if (!e?.errorFields) message.error("Tạo bài viết thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Thêm bài viết"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Tạo"
      confirmLoading={submitting}
      destroyOnClose
      maskClosable={false}
    >
      <Form form={form} layout="vertical" preserve={false} initialValues={{ status: "draft" }}>
        <Form.Item label="ID User" name="id_user" rules={[{ required: true, message: "Nhập ID user" }]}>
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item label="Tiêu đề" name="title" rules={[{ required: true, message: "Nhập tiêu đề" }]}>
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item label="Nội dung" name="content" rules={[{ required: true, message: "Nhập nội dung" }]}>
          <Input.TextArea rows={5} placeholder="Nhập nội dung..." />
        </Form.Item>

        <Form.Item label="Trạng thái" name="status" rules={[{ required: true, message: "Chọn trạng thái" }]}>
          <Select
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh bài viết"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[{ required: true, message: "Chọn ảnh" }]}
          extra="Chỉ chọn 1 ảnh"
        >
          <Upload beforeUpload={() => false} listType="picture" maxCount={1} accept="image/*">
            <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddNewsModal;
