import { useEffect, useMemo, useState } from "react";
import { Table, Rate, Space, message, Select, Button, Tooltip } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchAdminReviews } from "@adminApi/reviewApi";

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [scoreFilter, setScoreFilter] = useState("all");

  const getReviews = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminReviews();
      setReviews(Array.isArray(res) ? res : []);
    } catch (err) {
      message.error("Không thể tải danh sách reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReviews();
  }, []);

  const dataSource = useMemo(() => {
    if (scoreFilter === "high")
      return reviews.filter((r) => Number(r.rating) >= 4);
    if (scoreFilter === "low")
      return reviews.filter((r) => Number(r.rating) <= 3);
    return reviews;
  }, [reviews, scoreFilter]);

  const columns = [
    {
      title: "Reviews",
      dataIndex: "id_review",
      width: 100,
      sorter: (a, b) => a.id_review - b.id_review,
      align: "center",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product_name",
      render: (_, row) => (
        <Space>
          <img
            src={row.image}
            alt={row.product_name}
            style={{
              width: 48,
              height: 48,
              objectFit: "cover",
              borderRadius: 8,
              border: "1px solid #f0f0f0",
            }}
            onError={(e) => {
              e.currentTarget.src =
                "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='48' height='48'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='52%' font-size='10' fill='%23999' text-anchor='middle'>No Image</text></svg>";
            }}
          />
          <span style={{ fontWeight: 500 }}>{row.product_name}</span>
        </Space>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "username",
      align: "center",
      render: (text) => <span>{text}</span>,
    },
    {
      title: "Điểm",
      dataIndex: "rating",
      width: 200,
      align: "center",
      sorter: (a, b) => Number(a.rating) - Number(b.rating),
      render: (rate) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Rate disabled value={Number(rate)} />
        </div>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      width: 260,
      render: (text) => (
        <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
          {text}
        </div>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_date",
      width: 190,
      align: "center",
      sorter: (a, b) =>
        dayjs(a.created_date).valueOf() - dayjs(b.created_date).valueOf(),
      defaultSortOrder: "descend",
      render: (d) => (d ? dayjs(d).format("DD/MM/YYYY HH:mm") : ""),
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
        <h2 style={{ margin: 0 }}>Quản lý đánh giá</h2>

        <div style={{ display: "flex", gap: 12 }}>
          <Select
            value={scoreFilter}
            onChange={setScoreFilter}
            style={{ width: 220 }}
            options={[
              { value: "all", label: "Tất cả đánh giá" },
              { value: "high", label: "Đánh giá cao (4–5 sao)" },
              { value: "low", label: "Đánh giá thấp (1–3 sao)" },
            ]}
          />
          <Tooltip title="Làm mới dữ liệu">
            <Button
              icon={<ReloadOutlined />}
              onClick={getReviews}
              loading={loading}
              style={{
                borderRadius: 4,
                backgroundColor: "#1677ff",
                color: "#fff",
                border: "none",
              }}
            >
              Làm mới
            </Button>
          </Tooltip>
        </div>
      </div>

      <Table
        rowKey={(r) => r.id_review}
        loading={loading}
        columns={columns}
        dataSource={dataSource}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ReviewManagement;
