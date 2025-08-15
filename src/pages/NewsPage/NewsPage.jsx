import React from "react";
import { Row, Col, Card, Typography, List } from "antd";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";

// Ảnh local
import News1 from "@assets/images/news1.png";
import News2 from "@assets/images/news2.png";
import News3 from "@assets/images/news3.png";
import News4 from "@assets/images/news4.png";
import News5 from "@assets/images/news5.png";
import News6 from "@assets/images/news6.png";
import News7 from "@assets/images/news7.png";
import News8 from "@assets/images/news8.png";
import NewsBanner from "@assets/images/newsbanner.png";

const { Title, Paragraph } = Typography;

// Data bên trái (bài lớn)
const leftArticles = [
  {
    id: 1,
    title: "Logo Chanel - Nguồn gốc và ý nghĩa đằng sau logo thương hiệu",
    cover: News1,
    excerpt:
      "Nhắc đến thương hiệu thời trang đẳng cấp thế giới thì chắc chắn không thể bỏ qua cái tên Chanel...",
  },
  {
    id: 2,
    title:
      "Đại sứ thương hiệu Chanel – Những cái tên vang danh trong làng thời trang thế giới",
    cover: News2,
    excerpt:
      "Chanel là một trong những thương hiệu thời trang đạt độ phủ sóng toàn cầu với hàng loạt đại sứ đình đám...",
  },
];

// Data bên phải (danh sách ngắn)
const rightArticles = [
  { id: 101, title: "Top 20 thương hiệu mỹ phẩm dẫn đầu...", cover: News3 },
  {
    id: 102,
    title: "Thương hiệu Chanel và những dòng túi xách...",
    cover: News5,
  },
  {
    id: 103,
    title: "Tham khảo bài học quý giá về chiến lược Marketing...",
    cover: News7,
  },
  {
    id: 104,
    title: "Đại sứ thương hiệu của Chanel: G-Dragon...",
    cover: News8,
  },
  { id: 105, title: "Xu hướng tăng giá của Chanel...", cover: News6 },
  {
    id: 106,
    title: "Chanel và những sản phẩm nổi bật nhất trong năm 2023...",
    cover: News4,
  },
];

// Helper: khung ảnh tỉ lệ 16:9 (cover)
const Cover16x9 = ({ src, alt, minHeight = 240 }) => (
  <div
    style={{
      position: "relative",
      width: "100%",
      aspectRatio: "16 / 9",
      minHeight,
      overflow: "hidden",
    }}
  >
    <img
      src={src}
      alt={alt}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        objectFit: "cover",
        transition: "transform .35s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    />
  </div>
);

const NewsPage = () => {
  return (
    <>
      <HeaderComponent />

      <div style={{ background: "#fff" }}>
        {/* BANNER: ảnh full, không text */}
        <div style={{ width: "100%", marginBottom: 24 }}>
          <div style={{ width: "100%", overflow: "hidden" }}>
            <img
              src={NewsBanner}
              alt="News banner"
              style={{
                width: "100%",
                height: "auto",
                display: "block",
                objectFit: "cover",
              }}
            />
          </div>
        </div>

        {/* Title */}
        <div style={{ padding: "16px 0 8px", textAlign: "center" }}>
          <Title level={2} style={{ letterSpacing: 1, marginBottom: 0 }}>
            TIN TỨC
          </Title>
        </div>

        {/* Content */}
        <div
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}
        >
          <Row gutter={[24, 24]}>
            {/* LEFT column: bài lớn */}
            <Col xs={24} md={16}>
              {leftArticles.map((item) => (
                <Card
                  key={item.id}
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                    marginBottom: 24,
                  }}
                  bodyStyle={{ padding: 0 }}
                  hoverable
                >
                  <Cover16x9
                    src={item.cover}
                    alt={item.title}
                    minHeight={280}
                  />
                  <div style={{ padding: 16 }}>
                    <Title level={4} style={{ marginTop: 4 }}>
                      {item.title}
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                      {item.excerpt}
                    </Paragraph>
                  </div>
                </Card>
              ))}
            </Col>

            {/* RIGHT column: danh sách ngắn */}
            <Col xs={24} md={8}>
              <List
                itemLayout="vertical"
                dataSource={rightArticles}
                split={false}
                renderItem={(item) => (
                  <List.Item
                    key={item.id}
                    style={{ padding: 0, marginBottom: 16 }}
                  >
                    <Card
                      hoverable
                      style={{
                        borderRadius: 16,
                        overflow: "hidden",
                        boxShadow: "0 6px 14px rgba(0,0,0,0.06)",
                      }}
                      bodyStyle={{ padding: 0 }}
                    >
                      <Row
                        gutter={0}
                        wrap={false}
                        style={{ alignItems: "stretch" }}
                      >
                        <Col flex="150px" style={{ overflow: "hidden" }}>
                          {/* Ảnh 4:3 đẹp với chiều cao cố định */}
                          <div
                            style={{
                              position: "relative",
                              width: "100%",
                              aspectRatio: "4 / 3",
                              minHeight: 120,
                              overflow: "hidden",
                            }}
                          >
                            <img
                              src={item.cover}
                              alt={item.title}
                              style={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                transition: "transform .35s ease",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform =
                                  "scale(1.05)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            />
                          </div>
                        </Col>
                        <Col flex="auto">
                          <div style={{ padding: 12 }}>
                            <Title
                              level={5}
                              style={{ marginBottom: 0, lineHeight: 1.3 }}
                            >
                              {item.title}
                            </Title>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>
      </div>

      <FooterComponent />
    </>
  );
};

export default NewsPage;
