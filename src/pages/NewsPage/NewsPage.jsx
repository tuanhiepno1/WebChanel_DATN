import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Card, Typography, List, Spin, message, Empty } from "antd";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";
import { fetchArticles } from "@api/newsApi";

const { Title, Paragraph } = Typography;

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
      onError={(e) => {
        e.currentTarget.src =
          "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='52%' font-size='20' fill='%23999' text-anchor='middle'>No Image</text></svg>";
      }}
    />
  </div>
);

// Helper: cắt gọn nội dung
const excerpt = (text = "", len = 160) => {
  const s = String(text).replace(/\s+/g, " ").trim();
  return s.length > len ? s.slice(0, len - 1) + "…" : s;
};

const NewsPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    setLoading(true);
    try {
      const res = await fetchArticles();
      // Chỉ hiển thị bài đã publish (nếu cần)
      const visible = Array.isArray(res)
        ? res.filter((a) => a.status === "published" || !a.status)
        : [];
      setArticles(visible);
    } catch (e) {
      message.error("Không thể tải danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Chia layout: 2 bài lớn bên trái, phần còn lại danh sách phải
  const leftArticles = useMemo(() => articles.slice(0, 2), [articles]);
  const rightArticles = useMemo(() => articles.slice(2, 8), [articles]);

  return (
    <>
      <HeaderComponent />

      <div style={{ background: "#fff" }}>
        {/* Title */}
        <div style={{ padding: "16px 0 8px", textAlign: "center" }}>
          <Title level={2} style={{ letterSpacing: 1, marginBottom: 0 }}>
            TIN TỨC
          </Title>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>
          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
              <Spin size="large" />
            </div>
          ) : articles.length === 0 ? (
            <Empty description="Chưa có bài viết" style={{ padding: "48px 0" }} />
          ) : (
            <Row gutter={[24, 24]}>
              {/* LEFT column: bài lớn động */}
              <Col xs={24} md={16}>
                {leftArticles.map((item) => (
                  <Card
                    key={item.id_articles}
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
                      marginBottom: 24,
                    }}
                    bodyStyle={{ padding: 0 }}
                    hoverable
                  >
                    <Cover16x9 src={item.image} alt={item.title} minHeight={280} />
                    <div style={{ padding: 16 }}>
                      <Title level={4} style={{ marginTop: 4 }}>
                        {item.title}
                      </Title>
                      <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                        {excerpt(item.content, 220)}
                      </Paragraph>
                    </div>
                  </Card>
                ))}
              </Col>

              {/* RIGHT column: danh sách ngắn động */}
              <Col xs={24} md={8}>
                <List
                  itemLayout="vertical"
                  dataSource={rightArticles}
                  split={false}
                  renderItem={(item) => (
                    <List.Item
                      key={item.id_articles}
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
                        <Row gutter={0} wrap={false} style={{ alignItems: "stretch" }}>
                          <Col flex="150px" style={{ overflow: "hidden" }}>
                            {/* Ảnh 4:3 */}
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
                                src={item.image}
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
                                  (e.currentTarget.style.transform = "scale(1.05)")
                                }
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.transform = "scale(1)")
                                }
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect width='100%' height='100%' fill='%23f0f0f0'/><text x='50%' y='52%' font-size='14' fill='%23999' text-anchor='middle'>No Image</text></svg>";
                                }}
                              />
                            </div>
                          </Col>
                          <Col flex="auto">
                            <div style={{ padding: 12 }}>
                              <Title level={5} style={{ marginBottom: 0, lineHeight: 1.3 }}>
                                {item.title}
                              </Title>
                              <Paragraph
                                type="secondary"
                                style={{ marginTop: 6, marginBottom: 0 }}
                              >
                                {excerpt(item.content, 100)}
                              </Paragraph>
                            </div>
                          </Col>
                        </Row>
                      </Card>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>
          )}
        </div>
      </div>

      <FooterComponent />
    </>
  );
};

export default NewsPage;
