import React, { useState } from "react";
import { Typography, Divider, Slider, Rate } from "antd";
import { RightOutlined } from "@ant-design/icons";

const { Text } = Typography;

const GenericSidebar = ({ title, categories, featuredProducts }) => {
  const [priceRange, setPriceRange] = useState([500000, 2000000]);

  return (
    <div style={{ padding: 16, background: "#fff", borderRadius: 8 }}>
      {/* Thanh chọn khoảng giá */}
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
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {categories.map((cat, index) => (
          <div
            key={typeof cat === "string" ? cat : cat.id ?? index}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "4px 8px",
              borderRadius: 4,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            <Text>{typeof cat === "string" ? cat : cat.name}</Text>
            <RightOutlined style={{ fontSize: 12 }} />
          </div>
        ))}
      </div>

      {/* Sản phẩm nổi bật */}
      <Divider orientation="left">Sản phẩm nổi bật</Divider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          cursor: "pointer",
        }}
      >
        {featuredProducts.slice(0, 5).map((prod) => (
          <div
            key={prod.id}
            style={{ display: "flex", gap: 12, alignItems: "center" }}
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
              }}
            />
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontSize: 14 }}>
                {prod.name}
              </Text>
              <br />
              <Text type="danger" style={{ fontSize: 13 }}>
                {prod.price}
              </Text>
              <br />
              <Rate
                disabled
                defaultValue={prod.rating || 4}
                style={{ fontSize: 12 }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenericSidebar;
