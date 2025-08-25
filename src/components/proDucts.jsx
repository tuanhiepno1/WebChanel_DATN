import React, { useState } from "react";
import { Card, Row, Col, Pagination, Tooltip, message } from "antd"; 
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";             
import { addToCart, fetchCart } from "@redux/cartSlice";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { addToCartAPI } from "@api/cartApi"; 

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user); 

  const handleAddToCart = async (e) => {
    e.stopPropagation();

    const cleanedPrice =
      typeof product.price === "string" ? product.price.replace(/[^\d]/g, "") : product.price;
    const fixedPrice = Number(cleanedPrice) || 0;

    if (!user?.id) {
      dispatch(addToCart({ ...product, price: fixedPrice, quantity: 1 }));
      message.success("Đã thêm sản phẩm vào giỏ hàng!");
      return;
    }

    try {
      await addToCartAPI(user.id, {
        id_product: product.id,
        quantity: 1,
      });
      await dispatch(fetchCart(user.id));
      message.success("Đã thêm sản phẩm vào giỏ hàng!");
    } catch (err) {
      console.error(err);
      message.error("Thêm vào giỏ thất bại. Vui lòng thử lại.");
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") return "0 ₫";
    const cleaned = String(value).replace(/[^\d]/g, "");
    const number = Number(cleaned);
    if (isNaN(number)) return "0 ₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(number);
  };

  /* == THÊM: tính giá sau giảm theo discount BE trả về (ví dụ "6.00") == */
  const basePriceNum =
    typeof product.price === "string"
      ? Number(product.price.replace(/[^\d]/g, "")) || 0
      : Number(product.price) || 0;

  // discount %: "6.00" -> 6
  const discountPct = Number(product?.discount) || 0;
  const hasDiscount = discountPct > 0;

  // Giá sau giảm (làm tròn số nguyên VND)
  const salePriceNum = hasDiscount
    ? Math.max(0, Math.round((basePriceNum * (100 - discountPct)) / 100))
    : basePriceNum;

  const savedNum = hasDiscount ? basePriceNum - salePriceNum : 0;
  /* =============================================================== */

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
        {/* Badge phần trăm giảm nếu có */}
        {hasDiscount && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              zIndex: 2,
              background: "#ff4d4f",
              color: "#fff",
              padding: "4px 8px",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 12,
            }}
          >
            -{discountPct}%
          </div>
        )}

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
          onError={(e) => {
            e.currentTarget.src =
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f5f5f5'/><text x='50%' y='50%' fill='%23999' font-size='14' text-anchor='middle' dominant-baseline='middle'>No Image</text></svg>";
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
        </div>

        {/* HIỂN THỊ GIẢM GIÁ (chỉ thêm đoạn này, giữ nguyên các phần khác) */}
        {hasDiscount ? (
          <div style={{ display: "grid", gap: 4 }}>
            <span
              style={{
                fontWeight: "bold",
                fontSize: 18,
                color: "#ff4d4f", // giá sale màu đỏ
                marginTop: 8,
              }}
            >
              {formatCurrency(salePriceNum)}
            </span>
            <div style={{ fontSize: 13, color: "#999" }}>
              <span style={{ textDecoration: "line-through", marginRight: 8 }}>
                {formatCurrency(basePriceNum)}
              </span>
              <span style={{ fontWeight: 600, color: "#52c41a" }}>
                Tiết kiệm {formatCurrency(savedNum)} ({discountPct}%)
              </span>
            </div>
          </div>
        ) : (
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
        )}
      </div>
    </Card>
  );
};

/* ProductGrid giữ nguyên */
export const ProductGrid = ({ products }) => {
  const pageSize = 9;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * pageSize;
  const currentProducts = products.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const remainder = currentProducts.length % 3;
  const emptySlots = remainder === 0 ? 0 : 3 - remainder;

  return (
    <>
      <Row gutter={[24, 24]} align="stretch">
        {currentProducts.map((product) => (
          <Col key={product.id} xs={24} sm={12} md={8} style={{ display: "flex" }}>
            <div style={{ flex: 1 }}>
              <ProductCard product={product} />
            </div>
          </Col>
        ))}

        {Array.from({ length: emptySlots }).map((_, index) => (
          <Col key={`empty-${index}`} xs={24} sm={12} md={8} style={{ display: "flex" }}>
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
