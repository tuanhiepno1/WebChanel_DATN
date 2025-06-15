import React, { useEffect, useState } from "react";
import { Card, Button, Tag } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { fetchFeaturedProducts } from "@api/productApi";

// Arrow Components
const PrevArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      left: -25,
      zIndex: 2,
      top: "40%",
      position: "absolute",
      cursor: "pointer",
    }}
  >
    <LeftOutlined style={{ fontSize: 24 }} />
  </div>
);

const NextArrow = ({ onClick }) => (
  <div
    onClick={onClick}
    style={{
      right: -25,
      zIndex: 2,
      top: "40%",
      position: "absolute",
      cursor: "pointer",
    }}
  >
    <RightOutlined style={{ fontSize: 24 }} />
  </div>
);

const ProductCard = ({ product }) => (
  console.log("product.image:", product.image),
  <Card
    hoverable
    style={{
      width: "97%",
      borderRadius: 10,
      position: "relative",
      margin: "12px 12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s, box-shadow 0.3s",
    }}
    cover={
      <img
        alt={product.name}
        src={
          product.image.startsWith("http")
            ? product.image
            : `http://localhost:8000/storage/${product.image}`
        }
        style={{
          padding: 24,
          height: 250,
          objectFit: "contain",
        }}
      />
    }
    bodyStyle={{ textAlign: "center" }}
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
      }}
    >
      {product.name}
    </h4>
    <p style={{ fontWeight: "bold", color: "#D0021B" }}>
      {Number(product.price).toLocaleString("vi-VN")}₫
    </p>
    <Button type="primary" style={{ background: "#D6B160", border: "none" }}>
      XEM CHI TIẾT
    </Button>
  </Card>
);

const DiscountProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchFeaturedProducts();
      setProducts(data);
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
      <Slider {...settings}>
        {products.map((product) => (
          <div key={product.id}>
            <ProductCard product={product} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default DiscountProducts;
