// NewProducts.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Card, Button, Tag, Skeleton, Empty, message } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { fetchNewProducts } from "@api/productApi"; 
import fallbackImg from "@assets/images/Cart.png";


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
  <div style={{ ...arrowBaseStyle, left: 10 }} onClick={onClick}>
    <LeftOutlined />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div style={{ ...arrowBaseStyle, right: 10 }} onClick={onClick}>
    <RightOutlined />
  </div>
);

// ===== Normalize API item -> UI model =====
const normalizeProduct = (item) => {
  const id = item.id_product ?? item.id ?? item._id ?? item.productId;
  const name = item.name ?? item.productName ?? "Sản phẩm";
  const price =
    item.price != null
      ? Number(item.price)
      : item.salePrice != null
      ? Number(item.salePrice)
      : null;

  const image =
    item.image ??
    item.thumbnail ??
    item.imageUrl ??
    (Array.isArray(item.images) && item.images[0]) ??
    fallbackImg;

  return {
    id,
    name,
    price,
    image,
    discount: "New",
    slug: item.slug, // nếu có
    category_slug: item.category_slug,
    category_name: item.category_name,
    category: item.category,
  };
};

const currencyVN = (vnd) =>
  typeof vnd === "number"
    ? vnd.toLocaleString("vi-VN", { style: "currency", currency: "VND" })
    : "—";

// ===== Card =====
const ProductCard = ({ product, onViewDetail }) => (
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
        src={product.image}
        style={{
          padding: 24,
          height: 250,
          objectFit: "contain",
          transition: "transform 0.3s",
        }}
        onError={(e) => {
          e.currentTarget.src = fallbackImg;
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={() => onViewDetail(product)} // click ảnh mở chi tiết (tuỳ chọn)
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
  >
    <Tag color="green" style={{ position: "absolute", top: 10, left: 10 }}>
      {product.discount}
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
      title={product.name}
    >
      {product.name}
    </h4>

    <p style={{ fontWeight: "bold", color: "#D0021B", fontSize: 16, marginBottom: 16 }}>
      {currencyVN(product.price)}
    </p>

    <Button
      type="primary"
      style={{ background: "#D6B160", border: "none", transition: "all 0.3s" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "#b4944a";
        e.currentTarget.style.transform = "scale(1.05)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "#D6B160";
        e.currentTarget.style.transform = "scale(1)";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onViewDetail(product);
      }}
    >
      XEM CHI TIẾT
    </Button>
  </Card>
);

// ===== Main =====
const NewProducts = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [list, setList] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetchNewProducts();
        const normalized = Array.isArray(res) ? res.map(normalizeProduct) : [];
        if (mounted) setList(normalized);
      } catch (e) {
        setError("Không thể tải danh sách sản phẩm mới.");
        message.error("Tải sản phẩm mới thất bại!");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const settings = useMemo(
    () => ({
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
    }),
    []
  );

  const onViewDetail = (product) => {
    const id = getProductId(product);
    const slug = getCategorySlug(product);
    if (!id) return;
    navigate(`/category/${slug}/${id}`);
  };

  return (
    <div style={{ padding: "40px 0", position: "relative" }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>SẢN PHẨM MỚI</h2>
      <div style={{ padding: "0 20px", position: "relative" }}>
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} style={{ borderRadius: 10 }}>
                <Skeleton.Image active style={{ width: "100%", height: 250 }} />
                <Skeleton active paragraph={{ rows: 2 }} style={{ marginTop: 12 }} />
              </Card>
            ))}
          </div>
        ) : error ? (
          <Empty description={error} />
        ) : list.length === 0 ? (
          <Empty description="Chưa có sản phẩm mới." />
        ) : (
          <Slider {...settings}>
            {list.map((product) => (
              <div key={product.id || product.id_product}>
                <ProductCard product={product} onViewDetail={onViewDetail} />
              </div>
            ))}
          </Slider>
        )}
      </div>
    </div>
  );
};

export default NewProducts;
