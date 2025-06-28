import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Layout, Row, Col, Skeleton } from "antd";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";
import GenericSidebar from "@components/sideBarShop";
import { ProductGrid } from "@components/proDucts";
import {
  fetchProductsByCategorySlug,
  fetchProductsBySubcategory,
  mapProducts,
} from "@api/productApi";
import { motion } from "framer-motion";

const { Content } = Layout;

const CategoryPage = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  localStorage.setItem("lastCategorySlug", slug);
  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetchProductsByCategorySlug(slug);
      const safeProducts = Array.isArray(res?.products)
        ? res.products.map((p) => ({ ...p, category_slug: slug }))
        : [];

      const rawCategory = res?.category || {};
      const activeSubcategories = rawCategory.subcategories?.filter(
        (sub) => sub.status === "active"
      ) || [];

      const safeCategory = {
        ...rawCategory,
        subcategories: activeSubcategories,
      };

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


  const handleFilterBySubcategory = async (id_subcategory) => {
    setLoading(true);
    try {
      const subProducts = await fetchProductsBySubcategory(id_subcategory);
      const mapped = mapProducts(subProducts).map((p) => ({
        ...p,
        category_slug: slug,
      }));
      setProducts(mapped);
    } catch (error) {
      console.error("Lỗi lọc sản phẩm theo danh mục con:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <HeaderComponent />
      <Content style={{ padding: "0 24px", minHeight: "100vh", margin: "20px 0" }}>

        <Row gutter={[20, 20]} wrap>
          {/* Sidebar trái */}
          <Col
            xs={24}
            md={6}
            style={{
              width: "100%",
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
                  onSubcategoryClick={handleFilterBySubcategory}
                />
              </motion.div>
            )}
          </Col>

          {/* Nội dung bên phải */}
          <Col xs={24} md={18}>
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
