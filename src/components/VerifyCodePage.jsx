import React, { useState, useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { checkCode, checkEmailAndSendCode } from "@api/userApi";
import backgroundImage from "@assets/images/chanel login5.jpg";
import logo from "@assets/images/logo2.jpg";

const VerifyCodePage = () => {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const email = localStorage.getItem("reset_email") || "";
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await checkCode({ email, code: values.code });
      message.success("Mã xác nhận hợp lệ");
      navigate("/forgot-password/reset");
    } catch (error) {
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const resendCode = async () => {
    if (countdown > 0) return;
    try {
      await checkEmailAndSendCode(email);
      message.success("Đã gửi lại mã xác nhận");
      setCountdown(60);
    } catch (error) {
      message.error(error.message);
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
          <h2 style={{ marginTop: 20 }}>Nhập mã xác nhận</h2>
          <p>Vui lòng kiểm tra email của bạn để nhận mã</p>
        </div>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Mã xác nhận"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã xác nhận" }]}
          >
            <Input placeholder="Nhập mã xác nhận" />
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
            Xác nhận mã
          </Button>

          <Button
            type="link"
            disabled={countdown > 0}
            onClick={resendCode}
            style={{ marginTop: 12 }}
          >
            {countdown > 0
              ? `Gửi lại mã sau ${countdown}s`
              : "Gửi lại mã xác nhận"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default VerifyCodePage;
