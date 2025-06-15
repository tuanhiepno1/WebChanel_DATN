import React, { useState, useEffect } from "react";
import { Layout, Row, Col, Spin, Alert } from "antd";
import GenericSidebar from "@components/sideBarShop";
import { ProductGrid } from "@components/proDucts";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";
import DiscountProducts from "@components/discountProduct";

import { fetchPerfumes } from "@api/productApi";  // import api đúng đường dẫn

const { Content } = Layout;

const PerfumeShop = () => {
  const [perfumes, setPerfumes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const [perfumeData, categoryData] = await Promise.all([
          fetchPerfumes(),
          fetchPerfumeCategories(),
        ]);
        setPerfumes(perfumeData);
        setCategories(categoryData);
      } catch (err) {
        setError("Lấy dữ liệu thất bại. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  
  const startIdx = (currentPage - 1) * pageSize;
  const currentProducts = perfumes.slice(startIdx, startIdx + pageSize);

  if (loading) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <HeaderComponent />
        <Content style={{ padding: "50px", textAlign: "center" }}>
          <Spin size="large" />
        </Content>
        <FooterComponent />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <HeaderComponent />
        <Content style={{ padding: "50px" }}>
          <Alert message="Lỗi" description={error} type="error" showIcon />
        </Content>
        <FooterComponent />
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <HeaderComponent />
      <Content
        style={{ padding: "0 24px", marginTop: "24px", flex: "1 0 auto" }}
      >
        <div style={{ minHeight: "calc(100vh - 64px - 70px)" }}>
          <Row gutter={24}>
            <Col xs={24} md={6}>
              <GenericSidebar
                title="Nước Hoa"
                categories={categories}
                featuredProducts={perfumes.slice(0, 5)}
              />
            </Col>
            <Col xs={24} md={18}>
              <ProductGrid
                products={currentProducts}
                currentPage={currentPage}
                pageSize={pageSize}
                total={perfumes.length}
                onPageChange={setCurrentPage}
              />
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 0 }}>
          <DiscountProducts />
        </div>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default PerfumeShop;
