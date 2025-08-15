import { Layout, Carousel, Row, Col } from "antd";
import {
  CarOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";
import DiscountProducts from "@components/discountProduct";
import NewProducts from "@components/newProduct";
import MainLayout from "@pages/MainLayout";
import slide1 from "@assets/images/slide1.png";
import slide2 from "@assets/images/slide2.jpg";
import slide3 from "@assets/images/slide3.png";
import slide4 from "@assets/images/slide4.png";
import cate1 from "@assets/images/cate1.png";
import cate2 from "@assets/images/cate2.jpg";
import cate3 from "@assets/images/cate3.jpg";
import cate4 from "@assets/images/cate4.jpg";
import news1 from "@assets/images/news1.png";
import news2 from "@assets/images/news2.png";
import boSuuTap from "@assets/images/bosuutap6.png";

const { Content } = Layout;

const categories = [
  { name: "NƯỚC HOA", image: cate1 },
  { name: "MẮT KÍNH", image: cate2 },
  { name: "ĐỒNG HỒ", image: cate3 },
  { name: "TRANG ĐIỂM", image: cate4 },
];

const Home = () => {
  return (
    <Layout style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HeaderComponent />
      <Content style={{ flex: 1 }}>
        <MainLayout>
          {/* Carousel */}
          <Carousel autoplay dotPosition="bottom">
            {[slide1, slide2, slide3, slide4].map((src, index) => (
              <div key={index}>
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  style={{
                    width: "100%",
                    height: "50vw",
                    maxHeight: "600px",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </Carousel>

          {/* Services */}
          <Row gutter={16} justify="center" style={{ margin: "32px 0" }}>
            {[
              { icon: <CreditCardOutlined />, text: "Trả góp không lãi suất" },
              { icon: <CarOutlined />, text: "Miễn phí vận chuyển" },
              { icon: <SafetyOutlined />, text: "Miễn phí lần đầu" },
              { icon: <ToolOutlined />, text: "Chính sách bảo hành" },
            ].map((item, idx) => (
              <Col xs={24} sm={12} md={6} key={idx}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 10,
                    border: "1px solid black",
                    padding: "16px",
                    backgroundColor: "#fff",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
                    height: "100%",
                  }}
                >
                  <span style={{ fontSize: 24, color: "#000", marginRight: 10 }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: 16, fontWeight: 500 }}>{item.text}</span>
                </div>
              </Col>
            ))}
          </Row>

          {/* Categories */}
          <Row gutter={[16, 16]} justify="center">
            {categories.map((category, index) => (
              <Col xs={24} sm={12} md={12} lg={12} key={index}>
                <div
                  style={{
                    position: "relative",
                    height: 345,
                    borderRadius: 12,
                    backgroundImage: `url(${category.image})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: "rgba(0, 0, 0, 0.4)",
                      zIndex: 1,
                    }}
                  />
                  <span
                    style={{
                      color: "#fff",
                      fontSize: 24,
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      zIndex: 2,
                    }}
                  >
                    {category.name}
                  </span>
                </div>
              </Col>
            ))}
          </Row>

          {/* Discount Products */}
          <div style={{ margin: "32px 0" }}>
            <DiscountProducts />
          </div>

          {/* Bộ sưu tập */}
          <div style={{ marginBottom: 32, textAlign: "center" }}>
            <h2 style={{ marginBottom: 24 }}>BỘ SƯU TẬP MỚI NHẤT</h2>
            <img
              src={boSuuTap}
              alt="Bộ sưu tập mới"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: 8,
                display: "block",
              }}
            />
          </div>

          {/* New Products */}
          <div style={{ marginBottom: 32 }}>
            <NewProducts />
          </div>

          {/* Tin tức */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ textAlign: "center", marginBottom: "24px" }}>TIN TỨC</h2>

            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderRadius: 8,
                    minHeight: 420,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    src={news1}
                    alt="News 1"
                    style={{
                      width: "100%",
                      borderRadius: 4,
                      objectFit: "cover",
                      maxHeight: 220,
                    }}
                  />
                  <h3 style={{ margin: "8px 0" }}>
                    Chanel kỷ niệm 30 năm đồng hồ cao cấp với một loạt thiết kế mới
                  </h3>
                  <p>
                    Đồng hồ Chanel là những tác phẩm của vẻ đẹp thời thượng, sự
                    tân trang cũng như vẻ đẹp biểu tượng của thời đại...
                  </p>
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div
                  style={{
                    backgroundColor: "#333333",
                    color: "#fff",
                    fontSize: 48,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 420,
                  }}
                >
                  C H A
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
              <Col xs={24} md={12}>
                <div
                  style={{
                    backgroundColor: "#333333",
                    color: "#fff",
                    fontSize: 48,
                    fontWeight: "bold",
                    textAlign: "center",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 420,
                  }}
                >
                  N E L
                </div>
              </Col>

              <Col xs={24} md={12}>
                <div
                  style={{
                    backgroundColor: "#fff",
                    padding: 16,
                    borderRadius: 8,
                    minHeight: 420,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    src={news2}
                    alt="News 2"
                    style={{
                      width: "100%",
                      borderRadius: 4,
                      objectFit: "cover",
                      maxHeight: 220,
                    }}
                  />
                  <h3 style={{ margin: "8px 0" }}>
                    Mỹ phẩm Chanel: Thương hiệu mỹ phẩm cao cấp hàng đầu thế giới
                  </h3>
                  <p>
                    Chanel không chỉ nổi tiếng với thời trang mà còn dẫn đầu trong
                    ngành mỹ phẩm cao cấp, được hàng triệu người yêu thích...
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </MainLayout>
      </Content>
      <FooterComponent />
    </Layout>
  );
};

export default Home;
