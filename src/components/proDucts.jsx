import React from "react";
import { Card, Row, Col, Pagination, Rate, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@redux/cartSlice";
import { ShoppingCartOutlined } from "@ant-design/icons";

// Bỏ import perfumes tĩnh ở đây

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart(product));
    navigate("/gio-hang");
  };

  return (
    <Card
      hoverable
      onClick={() => navigate(`/nuoc-hoa/${product.id}`)}
      style={{
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
        position: "relative",
        transition: "transform 0.3s ease",
        cursor: "pointer",
      }}
      styles={{ body: { padding: 16 } }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "100%",
          overflow: "hidden",
          borderRadius: 10,
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        />
        <Tooltip title="Thêm vào giỏ hàng">
          <ShoppingCartOutlined
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              fontSize: 22,
              color: "#1890ff",
              background: "white",
              borderRadius: "50%",
              padding: 6,
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              cursor: "pointer",
              zIndex: 2,
            }}
            onClick={handleAddToCart}
          />
        </Tooltip>
      </div>

      <div style={{ marginTop: 12, textAlign: "center" }}>
        <h4 style={{ marginBottom: 8 }}>{product.name}</h4>
        <Rate
          disabled
          defaultValue={product.rating}
          style={{ fontSize: 14, marginBottom: 8 }}
        />
        <p
          style={{
            fontWeight: "bold",
            fontSize: 16,
            color: "#ff4d4f",
            marginTop: 8,
          }}
        >
          {product.price}
        </p>
      </div>
    </Card>
  );
};

export const ProductGrid = ({
  products,
  currentPage,
  pageSize,
  onPageChange,
  total,
}) => {
  return (
    <>
      <Row gutter={[16, 16]} style={{ minHeight: "600px" }}>
        {products.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>

      <Row justify="center" style={{ marginTop: 32, marginBottom: 32 }}>
        <Col>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={total}
            onChange={onPageChange}
          />
        </Col>
      </Row>
    </>
  );
};
