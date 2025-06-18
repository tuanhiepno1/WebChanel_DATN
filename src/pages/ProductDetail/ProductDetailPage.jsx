import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Skeleton, message } from "antd";
import ProductDetailLayout from "@components/productDetail";
import { fetchProductById, mapProductDetail } from "@api/productApi";

const ProductDetailPage = () => {
  const { slug, id } = useParams(); // 🟡 Thêm slug
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      setLoading(true);
      try {
        const raw = await fetchProductById(id); // Gọi theo id thôi
        const mapped = mapProductDetail(raw);
        setProduct(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", err);
        message.error("Không thể tải chi tiết sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (id) loadProduct();
  }, [id]);

  const extraInfo = product
    ? [
        product.gender && { label: "Giới tính", value: product.gender },
        product.volume && { label: "Dung tích", value: product.volume },
        product.type && { label: "Loại", value: product.type },
        product.note && { label: "Nốt hương", value: product.note },
      ].filter(Boolean)
    : [];

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return <ProductDetailLayout product={product} extraInfo={extraInfo} />;
};

export default ProductDetailPage;
