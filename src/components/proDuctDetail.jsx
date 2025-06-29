import React from "react";
import { Row, Col, Rate, Button, Divider } from "antd";
import {
  ShoppingCartOutlined,
  PayCircleOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import Header from "@components/header";
import Footer from "@components/footer";
import DiscountProducts from "@components/discountProduct";
import { useDispatch } from "react-redux";
import { addToCart } from "@redux/cartSlice";
import { useNavigate } from "react-router-dom";

const ProductDetailLayout = ({ product, extraInfo = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!product) return <p style={{ padding: 20 }}>Sản phẩm không tồn tại.</p>;

  const handleAddToCart = () => {
    const {
      id,
      name,
      image,
      price,
      rating,
      category_slug,
      type,
      volume,
      slug,
    } = product;

    dispatch(
      addToCart({
        id,
        name,
        image,
        price,
        rating,
        category_slug,
        type,
        volume,
        slug,
      })
    );
    navigate("/gio-hang");
  };

  return (
    <>
      <Header />
      <div
        style={{
          padding: "32px 64px",
          minHeight: "calc(100vh - 200px)",
          backgroundColor: "#f5f5f5",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto 24px" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              marginBottom: 16,
              backgroundColor: "#DBB671",
              borderColor: "#DBB671",
              color: "#000",
            }}
          >
            Quay lại
          </Button>
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Row gutter={32} style={{ maxWidth: 1200, width: "100%" }}>
            <Col xs={24} md={10}>
              <div
                style={{
                  width: "100%",
                  height: 500,
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 10,
                  }}
                />
              </div>
            </Col>

            <Col xs={24} md={14}>
              <h1>{product.name}</h1>
              <div
                style={{
                  height: 2,
                  backgroundColor: "black",
                  width: 160,
                  marginBottom: 16,
                }}
              ></div>

              <Rate
                disabled
                defaultValue={product.rating}
                style={{ fontSize: 18, marginBottom: 8 }}
              />

              {extraInfo.map((item) => (
                <p key={item.label} style={{ fontSize: 16 }}>
                  <strong>{item.label}:</strong> {item.value}
                </p>
              ))}

              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  style={{
                    backgroundColor: "#aaa",
                    color: "#fff",
                    border: "none",
                    height: 48,
                    fontWeight: 500,
                    width: 500,
                  }}
                >
                  THÊM VÀO GIỎ HÀNG
                </Button>

                <Button
                  icon={<PayCircleOutlined />}
                  style={{
                    backgroundColor: "#DBB671",
                    color: "#000",
                    border: "1px solid #DBB671",
                    height: 48,
                    fontWeight: 500,
                    width: 500,
                  }}
                >
                  MUA NGAY
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              maxWidth: 1200,
              minHeight: 300,
              paddingBottom: 16,
              overflowWrap: "break-word",
            }}
          >
            <h2>Mô tả sản phẩm</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6 }}>
              {product.description}
            </p>
          </div>
        </div>

        <Divider />

        <div
          style={{
            marginTop: 24,
            paddingBottom: 32,
            backgroundColor: "#f5f5f5",
          }}
        >
          <DiscountProducts />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailLayout;
