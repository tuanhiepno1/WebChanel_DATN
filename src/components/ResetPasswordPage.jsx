import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { LeftOutlined } from "@ant-design/icons";
import { resetPassword } from "@api/userApi";
import backgroundImage from "@assets/images/chanel login5.jpg";
import logo from "@assets/images/logo2.jpg";

const ResetPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem("reset_email") || "";

  const onFinish = async (values) => {
    if (values.password !== values.confirm_password) {
      return message.error("Mật khẩu xác nhận không khớp");
    }

    const oldPassword = localStorage.getItem("old_password");
    if (oldPassword && values.password === oldPassword) {
      return message.error("Mật khẩu mới không được trùng với mật khẩu cũ");
    }

    setLoading(true);
    try {
      await resetPassword({
        email,
        password: values.password,
        confirm_password: values.confirm_password,
      });
      message.success("Đặt lại mật khẩu thành công");
      localStorage.removeItem("reset_email");
      localStorage.removeItem("old_password");
      navigate("/login");
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
          <h2 style={{ marginTop: 20 }}>Đặt lại mật khẩu</h2>
        </div>

        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
          >
            <Input.Password placeholder="Mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirm_password"
            rules={[{ required: true, message: "Vui lòng nhập lại mật khẩu" }]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
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
            Đặt lại mật khẩu
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
