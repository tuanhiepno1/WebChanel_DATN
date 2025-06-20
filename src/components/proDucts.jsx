import React, { useState } from "react";
import { Card, Row, Col, Pagination, Rate, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "@redux/cartSlice";
import { ShoppingCartOutlined } from "@ant-design/icons";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
  e.stopPropagation();

  // Làm sạch price nếu là string
  const cleanedPrice = typeof product.price === "string"
    ? product.price.replace(/[^\d]/g, "") // chỉ giữ lại số
    : product.price;

  const fixedPrice = Number(cleanedPrice) || 0;

  dispatch(
    addToCart({
      ...product,
      price: fixedPrice,
    })
  );

  navigate("/gio-hang");
};


  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "0 ₫";

    // Xử lý chuỗi có ký hiệu tiền tệ hoặc dấu phẩy
    const cleaned = String(value).replace(/[^\d]/g, ""); // chỉ giữ lại chữ số
    const number = Number(cleaned);

    if (isNaN(number)) {
      console.warn("❌ Không thể convert giá trị:", value);
      return "0 ₫";
    }

    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(number);
  };

  return (
    <Card
      hoverable={!!product?.id}
      onClick={() =>
        product?.id &&
        product?.category_slug &&
        navigate(`/category/${product.category_slug}/${product.id}`)
      }
      style={{
        width: "100%",
        borderRadius: 10,
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.3s ease",
        cursor: product?.id ? "pointer" : "default",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        backgroundColor: product?.id ? "#fff" : "transparent",
      }}
      styles={{
        padding: 20,
        display: "flex",
        flexDirection: "column",
        flex: 1,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
      }}
    >
      {/* Ảnh sản phẩm */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4 / 3",
          overflow: "hidden",
          backgroundColor: "#fff",
          borderRadius: 10,
          flexShrink: 0,
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
            objectFit: "contain",
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

      {/* Nội dung */}
      <div
        style={{
          marginTop: 12,
          textAlign: "center",
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h4 style={{ fontSize: 18, minHeight: 42, marginBottom: 8 }}>
            {product.name}
          </h4>
          <Rate
            disabled
            defaultValue={product.rating || 4}
            style={{ fontSize: 16, marginBottom: 8 }}
          />
        </div>
        <span
          style={{
            fontWeight: "bold",
            fontSize: 18,
            color: "#ff4d4f",
            marginTop: 8,
          }}
        >
          {formatCurrency(product.price)}
        </span>
      </div>
    </Card>
  );
};

export const ProductGrid = ({ products }) => {
  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tính số slot trống để bổ sung
  const remainder = currentProducts.length % 3;
  const emptySlots = remainder === 0 ? 0 : 3 - remainder;

  return (
    <>
      <Row gutter={[24, 24]} align="stretch">
        {currentProducts.map((product) => (
          <Col
            key={product.id}
            xs={24}
            sm={12}
            md={8}
            style={{ display: "flex" }}
          >
            <div style={{ flex: 1 }}>
              <ProductCard product={product} />
            </div>
          </Col>
        ))}

        {/* Cột rỗng để giữ layout nếu thiếu sản phẩm trên hàng cuối */}
        {Array.from({ length: emptySlots }).map((_, index) => (
          <Col
            key={`empty-${index}`}
            xs={24}
            sm={12}
            md={8}
            style={{ display: "flex" }}
          >
            <div style={{ flex: 1, visibility: "hidden" }}>
              <ProductCard product={{}} />
            </div>
          </Col>
        ))}
      </Row>

      <Row justify="center" style={{ marginTop: 32, marginBottom: 32 }}>
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={products.length}
          onChange={handlePageChange}
        />
      </Row>
    </>
  );
};
