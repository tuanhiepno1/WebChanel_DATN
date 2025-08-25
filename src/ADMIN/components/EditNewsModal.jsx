// EditNewsModal.jsx
import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { updateAdminArticle } from "@adminApi/newsApi";

const normFile = (e) => (Array.isArray(e) ? e : e?.fileList || []);

const EditNewsModal = ({ open, article, onCancel, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (!article) {
      form.resetFields();
      return;
    }
    form.setFieldsValue({
      title: article.title || "",
      content: article.content || "",
      status: article.status || "draft",
      image: article.image
        ? [
            {
              uid: "-1",
              name: "current.jpg",
              status: "done",
              url: article.image,
            },
          ]
        : [],
    });
  }, [open, article, form]);

  const handleOk = async () => {
    if (!article?.id_articles) return;
    try {
      const values = await form.validateFields();
      const file = values.image?.[0]?.originFileObj || null;

      setSubmitting(true);
      await updateAdminArticle(article.id_articles, {
        title: values.title,
        content: values.content,
        status: values.status,
        image: file || undefined, // chỉ gửi nếu có file mới
      });
      message.success("Cập nhật bài viết thành công");
      onSuccess?.();
    } catch (e) {
      if (!e?.errorFields) message.error("Cập nhật bài viết thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      title="Sửa bài viết"
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      okText="Lưu"
      confirmLoading={submitting}
      destroyOnClose
      forceRender   // đảm bảo Form mount sớm để setFieldsValue luôn ổn định
      maskClosable={false}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="Tiêu đề"
          name="title"
          rules={[{ required: true, message: "Nhập tiêu đề" }]}
        >
          <Input placeholder="Nhập tiêu đề bài viết" />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Nhập nội dung" }]}
        >
          <Input.TextArea rows={5} placeholder="Nhập nội dung..." />
        </Form.Item>

        <Form.Item
          label="Trạng thái"
          name="status"
          rules={[{ required: true, message: "Chọn trạng thái" }]}
        >
          <Select
            options={[
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="Ảnh bài viết (tùy chọn đổi)"
          name="image"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra="Để trống nếu không đổi ảnh"
        >
          <Upload beforeUpload={() => false} listType="picture" maxCount={1} accept="image/*">
            <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditNewsModal;
