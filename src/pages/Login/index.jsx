import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import {
  FacebookFilled,
  GoogleOutlined,
  MailOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginAndLoadCart } from "@features/authSlice";
import endPoints from "@routes/router";
import backgroundImage from "@assets/images/chanel login5.jpg";
import logo from "@assets/images/logo2.jpg";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
    const result = await dispatch(loginAndLoadCart(values));

    // Đảm bảo kết quả không undefined
    if (result && result.type === "auth/login/fulfilled") {
      message.success("Đăng nhập thành công");
      navigate("/");
    } else {
      message.error(result?.payload || "Đăng nhập thất bại");
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
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          width: 800,
          height: 500,
          display: "flex",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          backgroundColor: "#fff",
        }}
      >
        {/* LEFT SIDE - LOGO */}
        <div
          style={{
            width: "40%",
            backgroundColor: "white",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => navigate(endPoints.ALL)}
        >
          <img
            src={logo}
            alt="Logo"
            style={{ maxWidth: "70%", maxHeight: "70%" }}
          />
        </div>

        {/* RIGHT SIDE - LOGIN FORM */}
        <div
          style={{ width: "60%", padding: "40px 30px", position: "relative" }}
        >
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 30,
              fontSize: 14,
            }}
          >
            Chưa có tài khoản?{" "}
            <a href="/register" style={{ color: "#1890ff" }}>
              Đăng ký
            </a>
          </div>

          <div
            style={{
              fontSize: 18,
              fontWeight: 600,
              marginBottom: 30,
              marginTop: 20,
            }}
          >
            Xin chào,
            <br />
            <br />
            Đăng nhập để tiếp tục
          </div>

          <Form name="login" onFinish={onFinish} layout="vertical">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Vui lòng nhập email!" },
                { type: "email", message: "Email không hợp lệ!" },
              ]}
            >
              <Input placeholder="Email" prefix={<MailOutlined />} />
            </Form.Item>

            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            >
              <Input.Password
                placeholder="Mật khẩu"
                prefix={<LockOutlined />}
              />
            </Form.Item>

            <Form.Item style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox>Nhớ mật khẩu</Checkbox>
                </Form.Item>
                <Link to="/forgot-password" style={{ color: "#1890ff" }}>
                  Quên mật khẩu?
                </Link>
              </div>
            </Form.Item>

            <Form.Item>
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
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>

          {/* Divider */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "20px 0 10px",
            }}
          >
            <div style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
            <span style={{ margin: "0 10px", color: "#555" }}>
              Hoặc đăng nhập với
            </span>
            <div style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
          </div>

          {/* Social login */}
          <div style={{ textAlign: "center", marginTop: 10 }}>
            <Button
              type="primary"
              shape="circle"
              icon={<FacebookFilled />}
              style={{
                backgroundColor: "#3b5998",
                borderColor: "#3b5998",
                marginRight: 15,
              }}
              onClick={() => alert("Login with Facebook")}
            />
            <Button
              type="primary"
              shape="circle"
              icon={<GoogleOutlined />}
              style={{
                backgroundColor: "#db4437",
                borderColor: "#db4437",
              }}
              onClick={() => alert("Login with Google")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
