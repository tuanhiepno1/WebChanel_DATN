import React, { useEffect, useState } from "react";
import { Skeleton, message } from "antd";
import ProductDetailLayout from "@components/productDetail";
import { fetchProductById, mapProductDetail } from "@api/productApi";
import { useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { id, slug } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setProduct(null);
    const loadProduct = async () => {
      setLoading(true);
      try {
        const raw = await fetchProductById(id);

        const mapped = mapProductDetail(raw);
        if (!mapped) throw new Error("Dữ liệu sản phẩm không hợp lệ");
        setProduct(mapped);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", err);
        message.error("Không thể tải chi tiết sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (slug && id) loadProduct();
  }, [slug, id]);

  const extraInfo = product
    ? [
        { label: "Giới tính", value: product.gender },
        { label: "Dung tích", value: product.volume },
        { label: "Loại", value: product.type },
        { label: "Nốt hương", value: product.note },
      ].filter((item) => item.value)
    : [];

  if (loading) {
    return (
      <div style={{ padding: 40 }}>
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <ProductDetailLayout key={id} product={product} extraInfo={extraInfo} />
  );
};

export default ProductDetailPage;
