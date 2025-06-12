import React from "react";
import { Form, Input, Button, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register } from "@features/authSlice";
import endPoints from "@routes/router";
import backgroundImage from "@assets/images/chanel login5.jpg";
import logo from "@assets/images/logo2.jpg";

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const onFinish = async (values) => {
  try {
    const payload = {
      ...values,
      phone: parseInt(values.phone, 10),
    };

    console.log("👉 Payload gửi lên đăng ký:", payload);

    await dispatch(register(payload)).unwrap();
    message.success("Đăng ký thành công!");
    navigate("/login");
  } catch (err) {
    message.error(err || "Đăng ký thất bại");
  }
};

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 800,
          display: "flex",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          backgroundColor: "#fff",
        }}
      >
        <div
          style={{
            width: "40%",
            backgroundColor: "#fff",
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

        <div
          style={{
            width: "60%",
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ alignSelf: "flex-end", fontSize: 14 }}>
            Đã có tài khoản?{" "}
            <a href="/login" style={{ color: "#1890ff" }}>
              Đăng nhập
            </a>
          </div>

          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>Đăng ký</div>
            <div style={{ fontSize: 14, color: "#555", marginTop: 10 }}>
              Tạo tài khoản mới để tiếp tục
            </div>
          </div>

          <Form layout="vertical" onFinish={onFinish}>
            <div style={{ display: "flex", gap: 16 }}>
              <Form.Item
                label="Họ"
                name="firstname"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
              >
                <Input placeholder="Họ" prefix={<UserOutlined />} />
              </Form.Item>

              <Form.Item
                label="Tên"
                name="lastname"
                style={{ flex: 1 }}
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Tên" prefix={<UserOutlined />} />
              </Form.Item>
            </div>

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
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: "Vui lòng nhập số điện thoại!" },
              ]}
            >
              <Input placeholder="Số điện thoại" prefix={<PhoneOutlined />} />
            </Form.Item>

            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
            >
              <Input placeholder="Địa chỉ" prefix={<HomeOutlined />} />
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

            <div style={{ fontSize: 12, marginBottom: 12, color: "#555" }}>
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a style={{ color: "#1890ff" }} href="#">
                Điều khoản
              </a>{" "}
              và{" "}
              <a style={{ color: "#1890ff" }} href="#">
                Chính sách Bảo mật
              </a>
              .
            </div>

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
                Đăng ký
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Register;
