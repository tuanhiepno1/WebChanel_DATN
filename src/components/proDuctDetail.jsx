import React, { useEffect, useMemo, useState } from "react";
import { Row, Col, Rate, Button, Divider, Spin, Empty, Form, Input, message, Card } from "antd";
import {
  ShoppingCartOutlined,
  PayCircleOutlined,
  ArrowLeftOutlined,
  LoginOutlined,
  SendOutlined,
} from "@ant-design/icons";
import Header from "@components/header";
import Footer from "@components/footer";
import DiscountProducts from "@components/discountProduct";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { fetchProductReviews, createProductReview } from "@api/productApi";

const { TextArea } = Input;

const ProductDetailLayout = ({ product, extraInfo = [] }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const [reviews, setReviews] = useState([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [averageFromApi, setAverageFromApi] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [form] = Form.useForm();

  const productId =
    product?.id_product ?? product?.id ?? product?._id ?? product?.productId;

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!productId) {
        setLoadingReviews(false);
        return;
      }
      try {
        setLoadingReviews(true);
        const { items, count, average } = await fetchProductReviews(productId);
        if (mounted) {
          setReviews(items);
          setReviewCount(count);
          setAverageFromApi(average);
        }
      } catch (e) {
        // có thể log hoặc hiển thị lỗi nhẹ
        console.error(e);
      } finally {
        if (mounted) setLoadingReviews(false);
      }
    })();
    return () => { mounted = false; };
  }, [productId]);

  const averageRating = useMemo(() => {
    const prodRate = Number(product?.rating);
    if (!Number.isNaN(prodRate) && prodRate > 0) return prodRate;
    if (averageFromApi > 0) return Number(averageFromApi);
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }, [product?.rating, averageFromApi, reviews]);

  if (!product) return <p style={{ padding: 20 }}>Sản phẩm không tồn tại.</p>;

  const handleAddToCart = () => {
    if (!user?.id) {
      message.warning("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
      return;
    }
    dispatch(
      addToCart({
        userId: user.id,
        product,
      })
    )
      .unwrap()
      .then(() => navigate("/gio-hang"))
      .catch(() => {});
  };

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleString("vi-VN");
    } catch {
      return iso;
    }
  };

  // ====== GỬI REVIEW MỚI ======
  const onSubmitReview = async (values) => {
    if (!user?.id) {
      message.info("Bạn cần đăng nhập để đánh giá sản phẩm.");
      navigate("/login");
      return;
    }
    if (!productId) return;

    setSubmittingReview(true);
    try {
      const payload = {
        id_user: user.id,
        id_product: productId,
        rating: Number(values.rating),
        content: values.content?.trim(),
      };

      const serverReview = await createProductReview(payload);

      // Tạo item mới để hiển thị ngay
      const displayName =
        user?.fullname ||
        [user?.firstname, user?.lastname].filter(Boolean).join(" ") ||
        user?.name ||
        "Bạn";
      const newItem = {
        id_review: serverReview?.id_review ?? `local-${Date.now()}`,
        username: serverReview?.username ?? displayName,
        image: serverReview?.image ?? null,
        created_date: serverReview?.created_date ?? new Date().toISOString(),
        rating: payload.rating,
        content: payload.content,
      };

      setReviews((prev) => [newItem, ...prev]);

      // Cập nhật count/average nhanh gọn
      setReviewCount((c) => c + 1);
      setAverageFromApi((prevAvg) => {
        const c = reviewCount; // giá trị cũ trước khi +1
        const newAvg = (prevAvg > 0 ? prevAvg : averageRating) || 0;
        const updated = ((newAvg * c + payload.rating) / (c + 1));
        return Math.round(updated * 10) / 10;
      });

      form.resetFields();
      message.success("Đã gửi đánh giá. Cảm ơn bạn!");
    } catch (err) {
      const msg =
        err?.message ||
        err?.errors?.[0] ||
        "Gửi đánh giá thất bại. Vui lòng thử lại!";
      message.error(msg);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <Header />
      <div
        style={{
          padding: "32px 64px",
          minHeight: "calc(100vh - 200px)",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* Nút quay lại */}
        <div style={{ maxWidth: 1200, margin: "0 auto 24px" }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            style={{
              marginBottom: 16,
              backgroundColor: "#DBB671",
              borderColor: "#DBB671",
              color: "#000",
            }}
          >
            Quay lại
          </Button>
        </div>

        {/* Thông tin sản phẩm */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Row gutter={32} style={{ maxWidth: 1200, width: "100%" }}>
            <Col xs={24} md={10}>
              <div
                style={{
                  width: "100%",
                  height: 500,
                  backgroundColor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                    borderRadius: 10,
                  }}
                />
              </div>
            </Col>

            <Col xs={24} md={14}>
              <h1>{product.name}</h1>
              <div
                style={{
                  height: 2,
                  backgroundColor: "black",
                  width: 160,
                  marginBottom: 16,
                }}
              />

              {/* Điểm và số lượng review */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Rate disabled allowHalf value={Number(averageRating) || 0} />
                <span style={{ color: "#555" }}>
                  {averageRating ? `${averageRating}/5` : "Chưa có đánh giá"}
                  {reviewCount ? ` · ${reviewCount} đánh giá` : ""}
                </span>
              </div>

              {extraInfo.map((item) => (
                <p key={item.label} style={{ fontSize: 16 }}>
                  <strong>{item.label}:</strong> {item.value}
                </p>
              ))}

              <div
                style={{
                  marginTop: 24,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                }}
              >
                <Button
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                  style={{
                    backgroundColor: "#aaa",
                    color: "#fff",
                    border: "none",
                    height: 48,
                    fontWeight: 500,
                    width: 500,
                  }}
                >
                  THÊM VÀO GIỎ HÀNG
                </Button>
                <Button
                  icon={<PayCircleOutlined />}
                  style={{
                    backgroundColor: "#DBB671",
                    color: "#000",
                    border: "1px solid #DBB671",
                    height: 48,
                    fontWeight: 500,
                    width: 500,
                  }}
                >
                  MUA NGAY
                </Button>
              </div>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Mô tả */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              maxWidth: 1200,
              minHeight: 300,
              paddingBottom: 16,
              overflowWrap: "break-word",
            }}
          >
            <h2>Mô tả sản phẩm</h2>
            <p style={{ fontSize: 16, lineHeight: 1.6 }}>
              {product.description}
            </p>
          </div>
        </div>

        <Divider />

        {/* ====== FORM ĐÁNH GIÁ ====== */}
        <div style={{ maxWidth: 1200, margin: "0 auto 24px" }}>
          <Card
            title="Viết đánh giá của bạn"
            bordered={false}
            style={{ borderRadius: 10 }}
            extra={
              !user?.id && (
                <Button
                  type="link"
                  icon={<LoginOutlined />}
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập để đánh giá
                </Button>
              )
            }
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmitReview}
              disabled={!user?.id}
            >
              <Form.Item
                name="rating"
                label="Chấm điểm"
                rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
              >
                <Rate />
              </Form.Item>

              <Form.Item
                name="content"
                label="Nhận xét"
                rules={[
                  { required: true, message: "Vui lòng nhập nội dung!" },
                  { min: 6, message: "Nội dung tối thiểu 6 ký tự" },
                ]}
              >
                <TextArea rows={4} placeholder="Chia sẻ trải nghiệm của bạn..." />
              </Form.Item>

              <Button
                type="primary"
                htmlType="submit"
                icon={<SendOutlined />}
                loading={submittingReview}
                style={{ background: "#DBB671", borderColor: "#DBB671", color: "#000" }}
              >
                Gửi đánh giá
              </Button>
            </Form>
          </Card>
        </div>

        {/* ====== DANH SÁCH REVIEW ====== */}
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2>Đánh giá sản phẩm</h2>

          {loadingReviews ? (
            <div style={{ padding: "16px 0" }}>
              <Spin />
            </div>
          ) : !reviews.length ? (
            <Empty description="Chưa có đánh giá nào" />
          ) : (
            reviews.map((rv) => (
              <div
                key={rv.id_review ?? `${rv.username}-${rv.created_date}`}
                style={{
                  display: "flex",
                  gap: 16,
                  padding: "16px 0",
                  borderBottom: "1px solid #eee",
                  alignItems: "flex-start",
                }}
              >
                {/* avatar đơn giản theo chữ cái đầu */}
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#ddd",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                    color: "#555",
                    flexShrink: 0,
                  }}
                >
                  {(rv.username || "U").charAt(0).toUpperCase()}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <strong>{rv.username || "Người dùng"}</strong>
                    <span style={{ color: "#999", fontSize: 12 }}>
                      {rv.created_date ? formatDate(rv.created_date) : ""}
                    </span>
                  </div>
                  <Rate disabled value={Number(rv.rating) || 0} style={{ fontSize: 16 }} />
                  <p style={{ marginTop: 8 }}>{rv.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div
          style={{
            marginTop: 24,
            paddingBottom: 32,
            backgroundColor: "#f5f5f5",
          }}
        >
          <DiscountProducts />
        </div>
      </div>

      <Footer />
    </>
  );
};

export default ProductDetailLayout;
