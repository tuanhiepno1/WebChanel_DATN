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

const EditProductModal = ({ visible, onCancel, onSubmit, product }) => {
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

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        image: undefined, // để tránh bị lỗi khi binding ảnh
      });
    }
  }, [product, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

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
          const file = value;
          if (file?.originFileObj) {
            formData.append("image", file.originFileObj);
          }
        } else if (intFields.includes(key)) {
          if (value !== undefined) formData.append(key, parseInt(value, 10));
        } else if (floatFields.includes(key)) {
          if (value !== undefined) formData.append(key, parseFloat(value));
        } else {
          if (value !== undefined) formData.append(key, value);
        }
      });

      await onSubmit(product.id_product, formData);
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
      title="Chỉnh sửa sản phẩm"
      okText="Cập nhật"
      cancelText="Hủy"
      destroyOnHidden
      width={1000}
      okButtonProps={{
        style: {
          backgroundColor: "#DBB671",
          borderColor: "#DBB671",
          color: "#000",
        },
      }}
    >
      <Form layout="vertical" form={form}>
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

            <Form.Item name="price" label="Giá">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="discount" label="Giảm giá (%)">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="volume" label="Dung tích (ml)">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="gender" label="Giới tính">
              <Select>
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="unisex">Unisex</Option>
              </Select>
            </Form.Item>

            <Form.Item name="type" label="Loại">
              <Input />
            </Form.Item>

            <Form.Item name="quantity" label="Tồn kho">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="views" label="Lượt xem">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item
              name="rating"
              label="Đánh giá"
              rules={[{ required: true }]}
            >
              <Rate count={5} allowClear={false} />
            </Form.Item>

            <Form.Item name="status" label="Trạng thái">
              <Select>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>

            <Form.Item name="image" label="Hình ảnh" valuePropName="file"
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList?.[0];
              }}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item name="description" label="Mô tả">
              <Input.TextArea rows={3} />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProductModal;
