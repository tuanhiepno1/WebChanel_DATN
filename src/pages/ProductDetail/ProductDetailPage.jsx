import React, { useEffect, useState } from "react";
import { Skeleton, message } from "antd";
import ProductDetailLayout from "@components/productDetail";
import { fetchProductById, mapProductDetail } from "@api/productApi";
import { useParams } from "react-router-dom"; // ✅ Di chuyển vào đây

const ProductDetailPage = () => {
  const { id, slug } = useParams(); // ✅ Trực tiếp đọc từ URL
  console.log("Params:", { id, slug });
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("🟡 useEffect chạy với id:", id);
    setProduct(null); // Reset khi id đổi
    const loadProduct = async () => {
      setLoading(true);
      try {
        const raw = await fetchProductById(id);
        console.log("✅ Load xong:", raw);
        const mapped = mapProductDetail(raw);
        if (!mapped) throw new Error("Dữ liệu sản phẩm không hợp lệ");
        setProduct(mapped);
        console.log("✅ Product loaded:", mapped);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết sản phẩm:", err);
        message.error("Không thể tải chi tiết sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    if (slug && id) loadProduct();
  }, [ slug , id]);

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

  return <ProductDetailLayout key={id} product={product} extraInfo={extraInfo} />;
};

export default ProductDetailPage;
