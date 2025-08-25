import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Tag,
  Input,
  Select,
  Button,
  Tooltip,
  Space,
  message,
  Typography,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchAdminArticles } from "@adminApi/newsApi";

import AddNewsModal from "@adminComponents/AddNewsModal";
import EditNewsModal from "@adminComponents/EditNewsModal";
import DeleteNewsModal from "@adminComponents/DeleteNewsModal";

const { Paragraph } = Typography;

const statusTag = (s) => {
  if (s === "published") return <Tag color="green">Published</Tag>;
  if (s === "draft") return <Tag color="orange">Draft</Tag>;
  return <Tag>—</Tag>;
};

const ellipsisText = (text = "", len = 150) => {
  const s = String(text).replace(/\s+/g, " ").trim();
  return s.length > len ? s.slice(0, len - 1) + "…" : s;
};

const NewsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all"); // all | published | draft

  // modal states
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminArticles();
      setArticles(Array.isArray(res) ? res : []);
    } catch (e) {
      message.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const dataSource = useMemo(() => {
    return articles
      .filter((a) => {
        const matchQ = q
          ? (a.title || "").toLowerCase().includes(q.toLowerCase())
          : true;
        const matchStatus = status === "all" ? true : a.status === status;
        return matchQ && matchStatus;
      })
      .sort((a, b) => (b.id_articles || 0) - (a.id_articles || 0));
  }, [articles, q, status]);

  const columns = [
    {
      title: "STT",
      dataIndex: "id_articles",
      width: 90,
      align: "center",
      sorter: (a, b) => (a.id_articles || 0) - (b.id_articles || 0),
    },
    {
      title: "Bài viết",
      dataIndex: "title",
      render: (_, row) => (
        <Space>
          <img
            src={row.image}
            alt={row.title}
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
          <div style={{ minWidth: 220 }}>
            <div style={{ fontWeight: 600 }}>{row.title}</div>
            <div>{statusTag(row.status)}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: 360,
      align: "center",
      render: (text) => (
        <Paragraph
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 3, expandable: false }}
        >
          {ellipsisText(text, 260)}
        </Paragraph>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      width: 180,
      align: "center",
      sorter: (a, b) =>
        dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Cập nhật",
      dataIndex: "updated_at",
      width: 180,
      align: "center",
      sorter: (a, b) =>
        dayjs(a.updated_at).valueOf() - dayjs(b.updated_at).valueOf(),
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "—"),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 140,
      align: "center",
      render: (_, row) => (
        <Space>
          <Tooltip title="Sửa">
            <Button
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setCurrent(row);
                setEditOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                setCurrent(row);
                setDelOpen(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          gap: 12,
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý Bài viết</h2>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Input
            allowClear
            style={{ width: 260 }}
            placeholder="Tìm theo tiêu đề"
            prefix={<SearchOutlined />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            style={{ width: 180 }}
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "published", label: "Published" },
              { value: "draft", label: "Draft" },
            ]}
          />
          <Tooltip title="Làm mới dữ liệu">
            <Button icon={<ReloadOutlined />} onClick={load} loading={loading}>
              Làm mới
            </Button>
          </Tooltip>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setAddOpen(true)}
          >
            Thêm bài viết
          </Button>
        </div>
      </div>

      <Table
        rowKey={(r) => r.id_articles}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10}}
        scroll={{ x: 1000 }}
      />

      {/* Modals */}
      <AddNewsModal
        open={addOpen}
        onCancel={() => setAddOpen(false)}
        onSuccess={() => {
          setAddOpen(false);
          load();
        }}
      />
      <EditNewsModal
        key={current?.id_articles || "edit"}
        open={editOpen}
        article={current}
        onCancel={() => {
          setEditOpen(false);
          setCurrent(null);
        }}
        onSuccess={() => {
          setEditOpen(false);
          setCurrent(null);
          load();
        }}
      />

      <DeleteNewsModal
        open={delOpen}
        article={current}
        onCancel={() => {
          setDelOpen(false);
          setCurrent(null);
        }}
        onSuccess={() => {
          setDelOpen(false);
          setCurrent(null);
          load();
        }}
      />
    </div>
  );
};

export default NewsManagement;
