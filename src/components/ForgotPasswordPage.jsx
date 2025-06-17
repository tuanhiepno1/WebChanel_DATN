import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { checkEmailAndSendCode } from "@api/userApi";
import backgroundImage from "@assets/images/chanel login5.jpg";
import logo from "@assets/images/logo2.jpg";

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("reset_email");
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await checkEmailAndSendCode(values.email);
      message.success("Mã xác nhận đã được gửi về email");
      localStorage.setItem("reset_email", values.email);
      navigate("/forgot-password/code");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 500,
          padding: 30,
          borderRadius: 10,
          backgroundColor: "#fff",
          boxShadow: "0 0 15px rgba(0,0,0,0.2)",
        }}
      >
        <Button
          type="link"
          icon={<LeftOutlined />}
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16, paddingLeft: 0 }}
        >
          Quay lại
        </Button>

        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <img src={logo} alt="Logo" style={{ height: 60 }} />
          <h2 style={{ marginTop: 20 }}>Quên mật khẩu</h2>
          <p>Vui lòng nhập email để nhận mã xác nhận</p>
        </div>

        <Form onFinish={onFinish} layout="vertical" initialValues={{ email }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "Vui lòng nhập email hợp lệ",
              },
            ]}
          >
            <Input placeholder="Nhập email của bạn" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            loading={loading}
            style={{
              backgroundColor: "#1E232C",
              borderColor: "#1E232C",
              color: "#fff",
            }}
          >
            Gửi mã xác nhận
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
