import React, { useState } from "react";
import { Typography, Divider, Slider, Rate, Button } from "antd";
import { RightOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

const GenericSidebar = ({
  title,
  categories,
  featuredProducts,
  onSubcategoryClick,
  onResetFilters,
}) => {
  const [priceRange, setPriceRange] = useState([500000, 2000000]);
  const navigate = useNavigate();

  // ---- Điều hướng tới trang chi tiết sản phẩm
  const goDetail = (prod) => {
    if (!prod) return;
    const id =
      prod.id ?? prod.id_product ?? prod.productId ?? prod._id;
    const slug =
      prod.category_slug ??
      localStorage.getItem("lastCategorySlug") ??
      "category";
    if (id) {
      navigate(`/category/${slug}/${id}`);
    }
  };

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8, height: "100%" }}>
      {/* Khoảng giá (demo, chưa áp dụng) */}
      <Divider orientation="left">Khoảng giá</Divider>
      <Slider
        range
        value={priceRange}
        onChange={(value) => setPriceRange(value)}
        min={0}
        max={10000000}
        step={100000}
        tooltip={{ formatter: (value) => `${value.toLocaleString()}₫` }}
      />
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <Text>
          Từ: <strong>{priceRange[0].toLocaleString()}₫</strong> đến{" "}
          <strong>{priceRange[1].toLocaleString()}₫</strong>
        </Text>
      </div>

      {/* Danh mục sản phẩm */}
      <Divider orientation="left">Bạn muốn tìm loại {title} ?</Divider>

      {/* Tất cả */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "6px 10px",
          borderRadius: 4,
          cursor: "pointer",
          background: "#fafafa",
          marginBottom: 6,
        }}
        onClick={() => onSubcategoryClick?.(null)}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#fafafa")}
      >
        <Text strong>Tất cả</Text>
        <RightOutlined style={{ fontSize: 12 }} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {categories.map((cat, index) => {
          const idSub = cat.id_subcategory || cat.id;

          return (
            <div
              key={idSub ?? index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 8px",
                borderRadius: 4,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onClick={() => onSubcategoryClick?.(idSub)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <Text>{typeof cat === "string" ? cat : cat.category_name}</Text>
              <RightOutlined style={{ fontSize: 12 }} />
            </div>
          );
        })}
      </div>

      {/* Nút Bỏ lọc */}
      <Button block icon={<ReloadOutlined />} style={{ marginTop: 12 }} onClick={onResetFilters}>
        Bỏ lọc / Hiển thị tất cả
      </Button>

      {/* Sản phẩm nổi bật */}
      <Divider orientation="left">Sản phẩm nổi bật</Divider>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {featuredProducts.slice(0, 5).map((prod) => (
          <div
            key={prod.id ?? prod.id_product ?? prod._id}
            role="button"
            tabIndex={0}
            onClick={() => goDetail(prod)}
            onKeyDown={(e) => e.key === "Enter" && goDetail(prod)}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              cursor: "pointer",
              padding: 6,
              borderRadius: 6,
              transition: "background .2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <img
              src={prod.image}
              alt={prod.name}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #f0f0f0",
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <Text strong style={{ fontSize: 14, display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {prod.name}
              </Text>
              <Text type="danger" style={{ fontSize: 13, display: "block" }}>
                {typeof prod.price === "number"
                  ? prod.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
                  : prod.price}
              </Text>
              <Rate disabled defaultValue={prod.rating || 4} style={{ fontSize: 12 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenericSidebar;
