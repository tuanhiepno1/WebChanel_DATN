import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Upload,
  Button,
  Row,
  Col,
  Rate,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { fetchAdminSubcategories } from "@adminApi/categoryApi";

const { Option } = Select;

const AddProductModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const loadSubcategories = async () => {
      const data = await fetchAdminSubcategories();
      const active = data.filter((item) => item.status === "active");
      setSubcategories(active);
    };
    loadSubcategories();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Tách rõ các kiểu dữ liệu cần ép kiểu
      const intFields = [
        "id_category",
        "rating",
        "volume",
        "quantity",
        "views",
      ];
      const floatFields = ["price", "discount"];

      Object.keys(values).forEach((key) => {
        const value = values[key];

        if (key === "image") {
          const file = value; // vì fileList[0] chính là file rồi
          if (file?.originFileObj) {
            formData.append("image", file.originFileObj);
          }
        } else if (intFields.includes(key)) {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, parseInt(value, 10));
          }
        } else if (floatFields.includes(key)) {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, parseFloat(value));
          }
        } else {
          if (value !== undefined && value !== null) {
            formData.append(key, value);
          }
        }
      });

      // ✅ Debug check
      for (let pair of formData.entries()) {
        console.log(pair[0], ":", pair[1]);
      }

      await onSubmit(formData);
      form.resetFields();
    } catch (err) {
      console.error("Validation failed:", err);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      title="Thêm sản phẩm"
      okText="Thêm"
      cancelText="Hủy"
      destroyOnHidden
      width={1000}
      styles={{ maxHeight: "70vh", overflowY: "auto" }}
      okButtonProps={{
        style: {
          backgroundColor: "#DBB671",
          borderColor: "#DBB671",
          color: "#000",
        },
      }}
    >
      <Form layout="vertical" form={form} initialValues={{ status: "active" }}>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="id_category"
              label="Danh mục"
              rules={[{ required: true }]}
            >
              <Select placeholder="Chọn danh mục">
                {subcategories.map((cat) => (
                  <Option key={cat.id_subcategory} value={cat.id_subcategory}>
                    {cat.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="price" label="Giá" placeholder="Nhập giá" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="discount" label="Giảm giá (%)">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="volume" label="Dung tích (ml)" placeholder="Nhập dung tích">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="gender" label="Giới tính" placeholder="Chọn giới tính">
              <Select>
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="unisex">Unisex</Option>
              </Select>
            </Form.Item>

            <Form.Item name="type" label="Loại" placeholder="Nhập loại sản phẩm">
              <Input />
            </Form.Item>

            <Form.Item name="quantity" label="Tồn kho" placeholder="Nhập số lượng tồn kho" rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}>
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="views" label="Lượt xem" placeholder="Nhập số lượt xem">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Đánh giá"
              rules={[{ required: true, message: "Vui lòng chọn đánh giá" }]}
            >
              <Rate count={5} allowClear={false} />
            </Form.Item>

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="image"
              label="Hình ảnh"
              valuePropName="file"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList[0];
              }}
              rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Mô tả" rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú" rules={[{ required: false }]}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
