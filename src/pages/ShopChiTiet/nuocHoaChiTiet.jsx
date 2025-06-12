import React from "react";
import { useParams } from "react-router-dom";
import nuocHoa from "@data/nuocHoa";
import ProductDetailLayout from "@components/productDetail";

const NuocHoaDetail = () => {
  const { id } = useParams();
  const productId = Number(id);

  const product = nuocHoa.find((p) => p.id === productId);

  
  const extraInfo = product
    ? [
        { label: "Giới tính", value: product.gender },
        { label: "Dung tích", value: product.volume },
        { label: "Loại", value: product.type },
        { label: "Nốt hương", value: product.note },
      ]
    : [];

  return <ProductDetailLayout product={product} extraInfo={extraInfo} />;
};

export default NuocHoaDetail;
