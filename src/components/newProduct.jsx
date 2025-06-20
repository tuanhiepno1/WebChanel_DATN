import React from "react";
import { Card, Button, Tag } from "antd";
import Slider from "react-slick";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import disc1 from "@assets/images/disc1.png";
import disc2 from "@assets/images/disc2.png";
import disc3 from "@assets/images/disc3.png";
import disc4 from "@assets/images/disc4.png";
import disc5 from "@assets/images/disc5.png";
import disc6 from "@assets/images/disc6.png";
import disc7 from "@assets/images/disc7.png";
import disc8 from "@assets/images/disc8.png";

const products = [
  {
    id: 1,
    name: "BLEU DE CHANEL",
    discount: "New",
    price: "3.450.000 VNĐ",
    image: disc1,
  },
  {
    id: 2,
    name: "N°5",
    discount: "New",
    price: "3.580.000 VNĐ",
    image: disc2,
  },
  {
    id: 3,
    name: "COCO",
    discount: "New",
    price: "3.440.000 VNĐ",
    image: disc3,
  },
  {
    id: 4,
    name: "N°19",
    discount: "New",
    price: "3.330.000 VNĐ",
    image: disc4,
  },
  {
    id: 5,
    name: "CHANCE EAU TENDRE",
    discount: "New",
    price: "3.650.000 VNĐ",
    image: disc5,
  },
  {
    id: 6,
    name: "ROUGE ALLURE",
    discount: "New",
    price: "1.250.000 VNĐ",
    image: disc6,
  },
  {
    id: 7,
    name: "SUBLIMAGE L’ESSENCE",
    discount: "New",
    price: "5.850.000 VNĐ",
    image: disc7,
  },
  {
    id: 8,
    name: "HYDRA BEAUTY",
    discount: "New",
    price: "2.980.000 VNĐ",
    image: disc8,
  },
];

const ProductCard = ({ product }) => (
  <Card
    hoverable
    style={{
      width: "97%",
      backgroundColor: "white",
      borderRadius: 10,
      position: "relative",
      margin: "12px 12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s, box-shadow 0.3s",
    }}
    cover={
      <img
        alt={product.name}
        src={product.image}
        style={{
          padding: 24,
          height: 250,
          objectFit: "contain",
          transition: "transform 0.3s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
      />
    }
    styles={{ textAlign: "center" }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "scale(1.03)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.2)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
    }}
  >
    <Tag color="green" style={{ position: "absolute", top: 10, left: 10 }}>
      {product.discount}
    </Tag>
    <h4>{product.name}</h4>
    <p style={{ fontWeight: "bold" }}>{product.price}</p>
    <Button type="primary" style={{ background: "#D6B160", border: "none" }}>
      XEM CHI TIẾT
    </Button>
  </Card>
);

// Custom arrow style
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
};

// Arrow components
const NextArrow = ({ onClick }) => (
  <div
    style={{ ...arrowBaseStyle, position: "absolute", right: -20, top: "45%" }}
    onClick={onClick}
  >
    <RightOutlined />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    style={{ ...arrowBaseStyle, position: "absolute", left: -20, top: "45%" }}
    onClick={onClick}
  >
    <LeftOutlined />
  </div>
);

const NewProducts = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 600,
    cssEase: "ease-in-out",
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3 },
      },
      {
        breakpoint: 900,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div style={{ padding: "40px 0", position: "relative" }}>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>
        SẢN PHẨM MỚI
      </h2>
      <div style={{ padding: "0", position: "relative" }}>
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default NewProducts;
