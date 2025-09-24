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
  Switch,
  Grid,
} from "antd";
import {
  ReloadOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchAdminArticles, updateAdminArticle } from "@adminApi/newsApi";

import AddNewsModal from "@adminComponents/AddNewsModal";
import EditNewsModal from "@adminComponents/EditNewsModal";
import DeleteNewsModal from "@adminComponents/DeleteNewsModal";

const { Paragraph } = Typography;
const { useBreakpoint } = Grid;

const STATUS_LABEL = {
  draft: "Bản nháp",
  published: "Đã xuất bản",
  deleted: "Đã xóa",
};
const STATUS_COLOR = {
  draft: "orange",
  published: "green",
  deleted: "red",
};
const renderStatusTag = (s) => (
  <Tag color={STATUS_COLOR[s] || "default"}>{STATUS_LABEL[s] || s}</Tag>
);

const ellipsisText = (text = "", len = 150) => {
  const s = String(text).replace(/\s+/g, " ").trim();
  return s.length > len ? s.slice(0, len - 1) + "…" : s;
};

const NewsManagement = () => {
  const [loading, setLoading] = useState(false);
  const [articles, setArticles] = useState([]);

  // filters
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");

  // modals
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const [current, setCurrent] = useState(null);

  // loading theo hàng khi bật/tắt switch
  const [switchLoading, setSwitchLoading] = useState({});

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminArticles();
      setArticles(Array.isArray(res) ? res : []);
    } catch {
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

  const handleQuickToggle = async (row, checked) => {
    if (row.status === "deleted") {
      message.warning("Bài viết đã xóa, không thể đổi trạng thái.");
      return;
    }
    const nextStatus = checked ? "published" : "draft";
    if (row.status === nextStatus) return;

    setSwitchLoading((prev) => ({ ...prev, [row.id_articles]: true }));
    try {
      await updateAdminArticle(row.id_articles, { status: nextStatus });
      setArticles((prev) =>
        prev.map((it) =>
          it.id_articles === row.id_articles ? { ...it, status: nextStatus } : it
        )
      );
      message.success(`Đã chuyển sang "${STATUS_LABEL[nextStatus]}"`);
    } catch {
      message.error("Đổi trạng thái thất bại");
    } finally {
      setSwitchLoading((prev) => ({ ...prev, [row.id_articles]: false }));
    }
  };

  const screens = useBreakpoint();

  const columns = useMemo(() => {
    return [
      {
        title: "STT",
        dataIndex: "id_articles",
        width: 70,
        align: "center",
        sorter: (a, b) => (a.id_articles || 0) - (b.id_articles || 0),
        responsive: ["md"],
      },
      {
        title: "Bài viết",
        dataIndex: "title",
        // KHÔNG đặt width cứng để bảng tự co giãn
        render: (_, row) => (
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <img
              src={row.image}
              alt={row.title}
              style={{
                width: 56,
                height: 56,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #f0f0f0",
                flex: "0 0 auto",
              }}
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='56' height='56'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='54%' font-size='9' fill='%23999' text-anchor='middle'>No Image</text></svg>";
              }}
            />
            <div style={{ minWidth: 0, flex: 1 }}>
              {/* Cho tiêu đề xuống dòng tối đa 2 dòng để tiết kiệm chiều ngang */}
              <div
                title={row.title}
                style={{
                  fontWeight: 600,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  wordBreak: "break-word",
                }}
              >
                {row.title}
              </div>
              <div style={{ marginTop: 4 }}>{renderStatusTag(row.status)}</div>
            </div>
          </div>
        ),
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        align: "left",
        responsive: ["lg"], // ẩn trên màn hình nhỏ
        render: (text) => (
          <Paragraph style={{ marginBottom: 0 }} ellipsis={{ rows: 3 }}>
            {ellipsisText(text, 320)}
          </Paragraph>
        ),
      },
      {
        title: "Ngày tạo",
        dataIndex: "created_at",
        width: 150,
        align: "center",
        responsive: ["md"],
        sorter: (a, b) =>
          dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf(),
        render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "—"),
      },
      {
        title: "Cập nhật",
        dataIndex: "updated_at",
        width: 150,
        align: "center",
        responsive: ["lg"],
        sorter: (a, b) =>
          dayjs(a.updated_at).valueOf() - dayjs(b.updated_at).valueOf(),
        render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : "—"),
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        width: 180,
        align: "center",
        responsive: ["sm"],
        render: (_, row) => (
          <Space direction="vertical" size={4} style={{ alignItems: "center" }}>
            {renderStatusTag(row.status)}
            <Switch
              checked={row.status === "published"}
              disabled={row.status === "deleted"}
              loading={!!switchLoading[row.id_articles]}
              onChange={(checked) => handleQuickToggle(row, checked)}
              checkedChildren="Xuất bản"
              unCheckedChildren="Nháp"
            />
          </Space>
        ),
        filters: [
          { text: STATUS_LABEL.published, value: "published" },
          { text: STATUS_LABEL.draft, value: "draft" },
          { text: STATUS_LABEL.deleted, value: "deleted" },
        ],
        onFilter: (val, rec) => rec.status === val,
      },
      {
        title: "Thao tác",
        key: "actions",
        width: 120,
        align: "center",
        fixed: screens.md ? "right" : undefined,
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
  }, [screens, switchLoading]);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          marginBottom: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý Bài viết</h2>

        <Space wrap size="small">
          <Input
            allowClear
            style={{ width: 260, maxWidth: "100%" }}
            placeholder="Tìm theo tiêu đề"
            prefix={<SearchOutlined />}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <Select
            style={{ minWidth: 180 }}
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "Tất cả trạng thái" },
              { value: "published", label: STATUS_LABEL.published },
              { value: "draft", label: STATUS_LABEL.draft },
              { value: "deleted", label: STATUS_LABEL.deleted },
            ]}
          />
          <Tooltip title="Làm mới dữ liệu">
            <Button
              icon={<ReloadOutlined />}
              style={{
                borderRadius: 4,
                backgroundColor: "#1677ff",
                color: "#fff",
                border: "none",
              }}
              onClick={load}
              loading={loading}
            >
              Làm mới
            </Button>
          </Tooltip>
          <Button
            type="primary"
            style={{
              backgroundColor: "#16C098",
              borderColor: "#16C098",
              color: "#fff",
            }}
            icon={<PlusOutlined />}
            onClick={() => setAddOpen(true)}
          >
            Thêm bài viết
          </Button>
        </Space>
      </div>

      <Table
        rowKey={(r) => r.id_articles}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        tableLayout="auto"    // để cột tự co giãn, tránh tràn ngang
        sticky
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
