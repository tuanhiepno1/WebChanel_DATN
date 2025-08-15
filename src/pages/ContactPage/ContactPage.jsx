import React from "react";
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Upload,
  Checkbox,
  Button,
  Typography,
  Space,
  Divider,
} from "antd";
import {
  InboxOutlined,
  PhoneOutlined,
  MailOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import HeaderComponent from "@components/header";
import FooterComponent from "@components/footer";

const { Title, Text } = Typography;
const { Dragger } = Upload;

const ContactPage = () => {
  const onFinish = (values) => {
    // TODO: call API gửi form
    console.log("Contact submit:", values);
  };

  return (
    <>
      <HeaderComponent />

      <div style={{ background: "#fff" }}>
        {/* Banner/title */}
        <div style={{ padding: "40px 0 12px", textAlign: "center" }}>
          <Title level={2} style={{ letterSpacing: 1 }}>
            LIÊN HỆ VỚI CHÚNG TÔI
          </Title>
        </div>

        {/* Form + Map block */}
        <div style={{ padding: "0 24px 40px" }}>
          <Card
            bodyStyle={{ padding: 0 }}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
              maxWidth: 1200,
              margin: "0 auto",
            }}
          >
            <Row gutter={0}>
              {/* LEFT: Form */}
              <Col xs={24} md={12} style={{ padding: 24 }}>
                <Space direction="vertical" size={8} style={{ width: "100%" }}>
                  <Title level={3} style={{ margin: 0 }}>
                    THÔNG TIN <span style={{ color: "#C8A96A" }}>CỦA BẠN</span>
                  </Title>
                  <Text type="secondary">
                    Tôi không làm thời trang, tôi chính là thời trang
                  </Text>
                </Space>

                <Form
                  layout="vertical"
                  style={{ marginTop: 16 }}
                  onFinish={onFinish}
                  requiredMark={false}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label="Tên liên hệ"
                        name="fullName"
                        rules={[{ required: true, message: "Vui lòng nhập tên" }]}
                      >
                        <Input size="large" placeholder="Tên liên hệ" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={24} md={16}>
                      <Form.Item label="Đường" name="street">
                        <Input size="large" placeholder="Địa chỉ đường/phường" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={8}>
                      <Form.Item label="Mã bưu chính" name="zip">
                        <Input size="large" placeholder="Mã bưu chính" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col xs={12} md={12}>
                      <Form.Item label="Thành phố" name="city">
                        <Input size="large" placeholder="Thành phố" />
                      </Form.Item>
                    </Col>
                    <Col xs={12} md={12}>
                      <Form.Item
                        label="Số điện thoại"
                        name="phone"
                        rules={[{ required: true, message: "Vui lòng nhập số điện thoại" }]}
                      >
                        <Input size="large" placeholder="Số điện thoại" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[{ type: "email", message: "Email không hợp lệ" }]}
                      >
                        <Input size="large" placeholder="E-mail" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Cho tôi biết ý tưởng của bạn" name="message">
                    <Input.TextArea
                      rows={4}
                      placeholder="Nội dung liên hệ"
                      style={{ resize: "none" }}
                    />
                  </Form.Item>

                  <Form.Item label="Tệp đính kèm" valuePropName="fileList" name="files">
                    <Dragger multiple beforeUpload={() => false} maxCount={3} style={{ borderRadius: 10 }}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                      </p>
                      <p className="ant-upload-text">Upload Additional file</p>
                      <p className="ant-upload-hint">Dung lượng mỗi tệp không quá 10MB</p>
                    </Dragger>
                  </Form.Item>

                  <Form.Item
                    name="agree"
                    valuePropName="checked"
                    rules={[
                      {
                        validator: (_, v) =>
                          v ? Promise.resolve() : Promise.reject("Bạn cần đồng ý điều khoản"),
                      },
                    ]}
                  >
                    <Checkbox>Tôi đồng ý với các điều khoản và chính sách của Chanel</Checkbox>
                  </Form.Item>

                  <Button
                    htmlType="submit"
                    type="primary"
                    size="large"
                    style={{
                      background: "#C8A96A",
                      border: "none",
                      width: 160,
                      borderRadius: 8,
                    }}
                  >
                    XÁC NHẬN
                  </Button>

                  <Divider style={{ margin: "20px 0" }} />

                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" size={4}>
                        <Space>
                          <PhoneOutlined />
                          <Text strong>Phone</Text>
                        </Space>
                        <Text type="secondary">+84 876 111 815</Text>
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" size={4}>
                        <Space>
                          <MailOutlined />
                          <Text strong>E-MAIL</Text>
                        </Space>
                        <Text type="secondary">hiepdv066@gmail.com</Text>
                      </Space>
                    </Col>
                    <Col xs={24} md={8}>
                      <Space direction="vertical" size={4}>
                        <Space>
                          <CustomerServiceOutlined />
                          <Text strong>Github</Text>
                        </Space>
                        <a href="https://bitly.li/10nX" target="_blank" rel="noreferrer">
                          https://github.com/datn
                        </a>
                      </Space>
                    </Col>
                  </Row>
                </Form>
              </Col>

              {/* RIGHT: Map */}
              <Col xs={24} md={12} style={{ background: "#E9D7B3" }}>
                <div style={{ padding: 16, height: "100%" }}>
                  <div
                    style={{
                      borderRadius: 16,
                      overflow: "hidden",
                      height: "100%",
                      background: "#fff",
                    }}
                  >
                    <iframe
                      title="Google Map"
                       src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d346.34466660601265!2d106.62591377523533!3d10.853902181135854!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752b6c59ba4c97%3A0x535e784068f1558b!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1755234623455!5m2!1svi!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: 520 }}
                      allowFullScreen=""
                      loading="lazy"
                    ></iframe>
                  </div>
                </div>
              </Col>
            </Row>
          </Card>
        </div>

      </div>

      <FooterComponent />
    </>
  );
};

export default ContactPage;
