import React, { useState } from "react";
import { Typography, Divider, Slider, Button } from "antd";
import { RightOutlined, ReloadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

/* Helpers: parse & format tiền */
const toNumber = (val) => {
  if (typeof val === "number") return val;
  return Number(String(val ?? "").replace(/[^\d.-]/g, "")) || 0;
};
const formatCurrency = (n) =>
  Number(n || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });

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
    const id = prod.id ?? prod.id_product ?? prod.productId ?? prod._id;
    const slug =
      prod.category_slug ??
      localStorage.getItem("lastCategorySlug") ??
      "category";
    if (id) {
      navigate(`/category/${slug}/${id}`);
    }
  };

  return (
    <div
      style={{
        padding: 16,
        background: "#fff",
        borderRadius: 8,
        height: "100%",
      }}
    >
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
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f0f0")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <Text>{typeof cat === "string" ? cat : cat.category_name}</Text>
              <RightOutlined style={{ fontSize: 12 }} />
            </div>
          );
        })}
      </div>

      {/* Nút Bỏ lọc */}
      <Button
        block
        icon={<ReloadOutlined />}
        style={{ marginTop: 12 }}
        onClick={onResetFilters}
      >
        Bỏ lọc / Hiển thị tất cả
      </Button>

      {/* Sản phẩm nổi bật */}
      <Divider orientation="left">Sản phẩm nổi bật</Divider>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {featuredProducts.slice(0, 5).map((prod) => {
          const base = toNumber(prod.price); // prod.price có thể là "2.450.000₫"
          const discountPct = Number(prod?.discount) || 0; // "6.00" -> 6
          const hasDiscount = discountPct > 0;
          const sale = hasDiscount
            ? Math.max(0, Math.round((base * (100 - discountPct)) / 100))
            : base;
          const save = hasDiscount ? base - sale : 0;

          return (
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
                position: "relative",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#fafafa")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Badge -% nếu có */}
              {hasDiscount && (
                <div
                  style={{
                    position: "absolute",
                    top: 6,
                    left: 6,
                    background: "#ff4d4f",
                    color: "#fff",
                    padding: "2px 6px",
                    borderRadius: 6,
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  -{discountPct}%
                </div>
              )}

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
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='60' height='60'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='54%' font-size='10' fill='%23999' text-anchor='middle'>No Image</text></svg>";
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  strong
                  style={{
                    fontSize: 14,
                    display: "block",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {prod.name}
                </Text>

                {/* Giá / Giá sau giảm */}
                {hasDiscount ? (
                  <div style={{ lineHeight: 1.2 }}>
                    <Text type="danger" strong style={{ fontSize: 13, display: "block" }}>
                      {formatCurrency(sale)}
                    </Text>
                    <span style={{ fontSize: 12, color: "#999" }}>
                      <span style={{ textDecoration: "line-through", marginRight: 6 }}>
                        {formatCurrency(base)}
                      </span>
                      <span style={{ color: "#52c41a", fontWeight: 600 }}>
                        Tiết kiệm {formatCurrency(save)}
                      </span>
                    </span>
                  </div>
                ) : (
                  <Text type="danger" style={{ fontSize: 13, display: "block" }}>
                    {typeof prod.price === "number"
                      ? formatCurrency(prod.price)
                      : prod.price}
                  </Text>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenericSidebar;
