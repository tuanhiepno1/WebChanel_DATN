import React, { useState } from "react";
import { Modal, Space, Typography, Button, Tag, message } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { deleteAdminArticle } from "@adminApi/newsApi";

const { Paragraph } = Typography;

const statusTag = (s) => {
  if (s === "published") return <Tag color="green">Published</Tag>;
  if (s === "draft") return <Tag color="orange">Draft</Tag>;
  return <Tag>—</Tag>;
};

const DeleteNewsModal = ({ open, article, onCancel, onSuccess }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!article?.id_articles) return;
    try {
      setLoading(true);
      await deleteAdminArticle(article.id_articles);
      message.success("Xóa bài viết thành công");
      onSuccess?.();
    } catch (e) {
      message.error("Xóa bài viết thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: "#faad14" }} />
          Xóa bài viết
        </Space>
      }
      onCancel={onCancel}
      onOk={handleDelete}
      okButtonProps={{ danger: true, loading }}
      okText="Xóa"
      cancelText="Hủy"
      destroyOnClose
      maskClosable={false}
    >
      <Space align="start">
        <img
          src={article?.image}
          alt={article?.title}
          style={{
            width: 64,
            height: 64,
            objectFit: "cover",
            borderRadius: 8,
            border: "1px solid #f0f0f0",
          }}
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='54%' font-size='10' fill='%23999' text-anchor='middle'>No Image</text></svg>";
          }}
        />
        <div>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>
            {article?.title || "(Không có tiêu đề)"}
          </div>
          <div>{statusTag(article?.status)}</div>
        </div>
      </Space>
      <Paragraph style={{ marginTop: 16 }}>
        Bạn có chắc muốn xóa bài viết này? Hành động không thể hoàn tác.
      </Paragraph>
    </Modal>
  );
};

export default DeleteNewsModal;
