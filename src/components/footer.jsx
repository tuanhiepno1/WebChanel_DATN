import { Layout } from "antd";
import {
  FacebookOutlined,
  InstagramOutlined,
  TikTokOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer style={{ backgroundColor: "transparent", padding: "0" }}>
      <div
        style={{
          backgroundColor: "	#1a1a1a",
          color: "white",
          padding: "20px 0",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 24px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          {/* Thương Hiệu */}
          <div style={{ flex: "1 1 250px" }}>
            <h3 style={{ color: "white", fontSize: "20px", lineHeight: "1.5" }}>
              Thương Hiệu
            </h3>
            <ul style={{ padding: 0, listStyle: "none", lineHeight: "1.8" }}>
              <li>Báo cáo doanh nghiệp</li>
              <li>Chống hàng giả</li>
              <li>Kết quả tài chính</li>
            </ul>
          </div>

          {/* Dịch Vụ Tại Cửa Hàng */}
          <div style={{ flex: "1 1 250px" }}>
            <h3 style={{ color: "white", fontSize: "20px", lineHeight: "1.5" }}>
              Dịch Vụ Tại Cửa Hàng
            </h3>
            <ul style={{ padding: 0, listStyle: "none", lineHeight: "1.8" }}>
              <li>Hệ thống cửa hàng</li>
              <li>Lịch hẹn với Chanel</li>
            </ul>
          </div>

          {/* Liên Hệ */}
          <div style={{ flex: "1 1 250px" }}>
            <h3 style={{ color: "white", fontSize: "20px", lineHeight: "1.5" }}>
              Liên Hệ
            </h3>
            <ul style={{ padding: 0, listStyle: "none", lineHeight: "1.8" }}>
              <li>Telephone: +84 876111815</li>
              <li>Zalo: +84 876111815</li>
              <li>E-mail: hiepvo066@gmail.com</li>
            </ul>
          </div>

          {/* Giờ Mở Cửa */}
          <div style={{ flex: "1 1 250px" }}>
            <h3 style={{ color: "white", fontSize: "20px", lineHeight: "1.5" }}>
              Giờ Mở Cửa
            </h3>
            <p>Thứ 2 - thứ 7: 8:00 đến 18:00</p>
          </div>
        </div>

        {/* Social Icons */}
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "24px",
            color: "white",
          }}
        >
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px", color: "white" }}
          >
            <FacebookOutlined />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px", color: "white" }}
          >
            <InstagramOutlined />
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px", color: "white" }}
          >
            <TikTokOutlined />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ margin: "0 10px", color: "white" }}
          >
            <YoutubeOutlined />
          </a>
        </div>
      </div>
    </Footer>
  );
};

export default FooterComponent;
