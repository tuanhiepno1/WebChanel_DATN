// DiscountProducts.jsx
import React, { useEffect, useState } from "react";
import { Card, Button, Tag } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { fetchFeaturedProducts } from "@api/productApi";

const slugify = (str) =>
  (str || "unknown")
    .toString()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const getProductId = (p) => p?.id ?? p?.id_product ?? p?._id ?? p?.productId;
const getCategorySlug = (p) =>
  p?.category_slug || slugify(p?.category_name || p?.category || "san-pham");

// ===== Arrows =====
const arrowBaseStyle = {
  background: "black",
  color: "white",
  borderRadius: "50%",
  width: 40,
  height: 40,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: 20,
  zIndex: 2,
  cursor: "pointer",
  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
  position: "absolute",
  top: "45%",
};

const PrevArrow = ({ onClick }) => (
  <div onClick={onClick} style={{ ...arrowBaseStyle, left: 10 }}>
    <LeftOutlined />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div onClick={onClick} style={{ ...arrowBaseStyle, right: 10 }}>
    <RightOutlined />
  </div>
);

// ===== Card =====
const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    const id = getProductId(product);
    const slug = getCategorySlug(product);
    if (!id) return;
    navigate(`/category/${slug}/${id}`);
  };

  return (
    <Card
      hoverable
      style={{
        width: "97%",
        borderRadius: 10,
        position: "relative",
        margin: "12px auto",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s, box-shadow 0.3s",
        textAlign: "center",
      }}
      styles={{
        body: {
          padding: 16,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        },
      }}
      cover={
        <img
          alt={product.name}
          src={
            product.image?.startsWith?.("http")
              ? product.image
              : `http://localhost:8000/storage/${product.image}`
          }
          style={{
            padding: 24,
            height: 250,
            objectFit: "contain",
            transition: "transform 0.3s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          onClick={handleViewDetail} // click ảnh mở chi tiết (tuỳ chọn)
          role="button"
        />
      }
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.02)";
        e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
      }}
      onClick={handleViewDetail} // click card mở chi tiết (tuỳ chọn)
    >
      <Tag color="red" style={{ position: "absolute", top: 10, left: 10 }}>
        {product.discount || "HOT"}
      </Tag>

      <h4
        style={{
          height: 48,
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          marginBottom: 8,
        }}
      >
        {product.name}
      </h4>

      <p
        style={{
          fontWeight: "bold",
          color: "#D0021B",
          fontSize: 16,
          marginBottom: 16,
        }}
      >
        {Number(product.price).toLocaleString("vi-VN")}₫
      </p>

      <Button
        type="primary"
        style={{
          background: "#D6B160",
          border: "none",
          transition: "all 0.3s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "#b4944a";
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "#D6B160";
          e.currentTarget.style.transform = "scale(1)";
        }}
        onClick={(e) => {
          e.stopPropagation(); // tránh click trúng Card
          handleViewDetail();
        }}
      >
        XEM CHI TIẾT
      </Button>
    </Card>
  );
};

// ===== Main =====
const DiscountProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchFeaturedProducts();
      setProducts(Array.isArray(data) ? data : []);
    };
    load();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 900, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div style={{ padding: "40px 0", position: "relative" }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>SẢN PHẨM HOT</h2>
      <div style={{ padding: "0 20px", position: "relative" }}>
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={product.id || product.id_product || `product-${index}`}>
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default DiscountProducts;
