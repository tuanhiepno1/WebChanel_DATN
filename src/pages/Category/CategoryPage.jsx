import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Row, Col, Skeleton } from "antd";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";
import GenericSidebar from "@components/sideBarShop";
import { ProductGrid } from "@components/proDucts";
import { fetchProductsByCategorySlug } from "@api/productApi";
import { motion } from "framer-motion";

const { Content } = Layout;

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchProductsByCategorySlug(slug);
        const safeProducts = Array.isArray(res?.products) ? res.products : [];
        const safeCategory = res?.category || {};
        setProducts(safeProducts);
        setCategory(safeCategory);
      } catch (err) {
        console.error("Lỗi khi load danh mục:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [slug]);

  return (
    <Layout>
      <HeaderComponent />
      <Content
        style={{ maxWidth: "1200px", margin: "20px auto", minHeight: "100vh" }}
      >
        <Row gutter={[20, 20]} wrap={false}>
          <Col
            xs={24}
            md={6}
            style={{
              flex: "0 0 300px",
              maxWidth: 300,
              minWidth: 300,
            }}
          >
            {loading ? (
              <Skeleton active title={{ width: 150 }} paragraph={{ rows: 6 }} />
            ) : (
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <GenericSidebar
                  title={category?.category_name || "Danh mục"}
                  categories={category?.subcategories || []}
                  featuredProducts={products.slice(0, 5)}
                />
              </motion.div>
            )}
          </Col>

          <Col
            xs={24}
            md={18}
            style={{
              minHeight: "80vh",
            }}
          >
            {loading ? (
              <Row gutter={[16, 16]}>
                {Array.from({ length: 6 }).map((_, index) => (
                  <Col key={index} xs={12} md={8}>
                    <Skeleton.Image style={{ width: "100%", height: 200 }} />
                    <Skeleton active paragraph={{ rows: 2 }} />
                  </Col>
                ))}
              </Row>
            ) : (
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ProductGrid products={products} />
              </motion.div>
            )}
          </Col>
        </Row>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default CategoryPage;
