import { Layout, Carousel, Row, Col, Card, Rate } from "antd";
import {
  AppstoreOutlined,
  CarOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  ToolOutlined,
} from "@ant-design/icons";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";
import DiscountProducts from "@components/discountProduct";
import NewProducts from "@components/newProduct";
import slide1 from "@assets/images/slide1.png";
import slide2 from "@assets/images/slide2.jpg";
import slide3 from "@assets/images/slide3.png";
import slide4 from "@assets/images/slide4.png";
import cate1 from "@assets/images/cate1.png";
import cate2 from "@assets/images/cate2.jpg";
import cate3 from "@assets/images/cate3.jpg";
import cate4 from "@assets/images/cate4.jpg";
import news1 from "@assets/images/news1.jpg";
import news2 from "@assets/images/news2.jpg";
import boSuuTap from "@assets/images/bosuutap6.png";

const { Content } = Layout;

const contentStyle = {
  width: "100%",
  height: "750px",
  objectFit: "cover",
};

const centeredBoxStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 10,
  border: "1px solid black",
  padding: "16px",
  backgroundColor: "#fff",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  height: "100%",
};

const centeredIconStyle = {
  fontSize: 24,
  color: "#000",
  marginRight: 10,
};

const centeredTextStyle = {
  fontSize: 16,
  fontWeight: 500,
  color: "#000",
};

const boxStyle = {
  position: "relative",
  height: 345,
  borderRadius: 12,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const overlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.4)",
  zIndex: 1,
};

const textStyle = {
  color: "#fff",
  fontSize: 24,
  fontWeight: "bold",
  textTransform: "uppercase",
  zIndex: 2,
};

const categories = [
  {
    name: "NƯỚC HOA",
    image: cate1,
  },
  {
    name: "MẮT KÍNH",
    image: cate2,
  },
  {
    name: "ĐỒNG HỒ",
    image: cate3,
  },
  {
    name: "TRANG ĐIỂM",
    image: cate4,
  },
];

const Home = () => {
  return (
    <Layout
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <HeaderComponent />
      <Content
        style={{
          flex: 1,
          paddingTop: "0px",
          paddingLeft: "24px",
          paddingRight: "24px",
        }}
      >
        <Carousel autoplay dotPosition="bottom">
          <div>
            <img src={slide1} alt="Slide 1" style={contentStyle} />
          </div>
          <div>
            <img src={slide2} alt="Slide 2" style={contentStyle} />
          </div>
          <div>
            <img src={slide3} alt="Slide 3" style={contentStyle} />
          </div>
          <div>
            <img src={slide4} alt="Slide 4" style={contentStyle} />
          </div>
        </Carousel>
        <Row gutter={16} justify="center" style={{ margin: "32px 0" }}>
          <Col xs={24} sm={12} md={6}>
            <div style={centeredBoxStyle}>
              <CreditCardOutlined style={centeredIconStyle} />
              <span style={centeredTextStyle}>Trả góp không lãi suất</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={centeredBoxStyle}>
              <CarOutlined style={centeredIconStyle} />
              <span style={centeredTextStyle}>Miễn phí vận chuyển</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={centeredBoxStyle}>
              <SafetyOutlined style={centeredIconStyle} />
              <span style={centeredTextStyle}>Miễn phí lần đầu</span>
            </div>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <div style={centeredBoxStyle}>
              <ToolOutlined style={centeredIconStyle} />
              <span style={centeredTextStyle}>Chính sách bảo hành</span>
            </div>
          </Col>
        </Row>

        <div style={{ marginBottom: 0 }}>
          <Row gutter={[16, 16]} justify="center">
            {categories.map((category, index) => (
              <Col xs={24} sm={12} md={12} lg={12} key={index}>
                <div
                  style={{
                    ...boxStyle,
                    backgroundImage: `url(${category.image})`,
                  }}
                >
                  <div style={overlayStyle}></div>
                  <span style={textStyle}>{category.name}</span>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        <div style={{ marginBottom: 0 }}>
          <DiscountProducts />
        </div>

        <div style={{ marginBottom: 0, textAlign: "center" }}>
          <h2 style={{ marginBottom: 24 }}>BỘ SƯU TẬP MỚI NHẤT</h2>

          <img
            src={boSuuTap}
            alt="Bộ sưu tập mới"
            style={{
              width: "100%",
              height: "400px",
              objectFit: "fill",
              borderRadius: 8,
              display: "block",
            }}
          />
        </div>

        <div style={{ marginBottom: 0 }}>
          <NewProducts />
        </div>

        {/* Tin tức */}
        <div style={{ marginBottom: 48 }}>
          <h2 style={{ textAlign: "center", marginBottom: "24px" }}>TIN TỨC</h2>

          {/* Row 1 */}
          <Row gutter={[16, 16]} style={{ display: "flex" }}>
            <Col xs={24} md={12} style={{ display: "flex" }}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: 16,
                  borderRadius: 8,
                  minHeight: 420,
                  height: "100%",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.2)";
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
                <h3 style={{ margin: "8px 0 8px" }}>
                  Chanel kỷ niệm 30 năm đồng hồ cao cấp với một loạt thiết kế
                  mới
                </h3>
                <p>
                  Đồng hồ Chanel là những tác phẩm của vẻ đẹp thời thượng, sự
                  tân trang cũng như vẻ đẹp biểu tượng của thời đại, và trong
                  năm 2017 vừa qua, Chanel vừa cho ra đời những tác phẩm mới kỷ
                  niệm cho một thời kỳ vừa qua của thương hiệu chế tác đồng hồ
                  cao cấp.
                </p>
              </div>
            </Col>
            <Col xs={24} md={12} style={{ display: "flex" }}>
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
                  flex: 1,
                }}
              >
                C H A
              </div>
            </Col>
          </Row>

          {/* Row 2 */}
          <Row gutter={[16, 16]} style={{ marginTop: 16, display: "flex" }}>
            <Col xs={24} md={12} style={{ display: "flex" }}>
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
                  flex: 1,
                }}
              >
                N E L
              </div>
            </Col>
            <Col xs={24} md={12} style={{ display: "flex" }}>
              <div
                style={{
                  backgroundColor: "#fff",
                  padding: 16,
                  borderRadius: 8,
                  minHeight: 420,
                  height: "100%",
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 16px rgba(0,0,0,0.2)";
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
                <h3 style={{ margin: "8px 0 8px" }}>
                  Mỹ phẩm Chanel: Thương hiệu mỹ phẩm cao cấp hàng đầu thế giới
                </h3>
                <p>
                  Là một trong những thương hiệu thời trang cao cấp hàng đầu thế
                  giới, Chanel ắt hẳn là cái tên không hề xa lạ đối với nhiều
                  người. Thế nhưng, ít ai biết rằng, bên cạnh việc làm “bá chủ
                  một phương” trong mảng thời trang, Chanel còn “lấn sân” qua
                  lĩnh vực làm đẹp và gặt hái được rất nhiều thành công. Tính
                  đến hiện tại, trong một thời gian dài, mỹ phẩm Chanel luôn giữ
                  một vị trí vững vàng trên thị trường làm đẹp cao cấp, được
                  nhiều quý bà, quý cô yêu thích và tin dùng.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </Content>

      <FooterComponent />
    </Layout>
  );
};

export default Home;
