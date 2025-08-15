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
      const active = (Array.isArray(data) ? data : []).filter(
        (item) => item.status === "active"
      );
      setSubcategories(active);
    };
    loadSubcategories();
  }, []);

  useEffect(() => {
    if (product) {
      form.setFieldsValue({
        ...product,
        image: undefined, // tránh bind trực tiếp ảnh cũ vào Upload
      });
    }
  }, [product, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      // Định nghĩa kiểu để ép sang số/float
      const intFields = [
        "id_category",
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
          if (value !== undefined && value !== null)
            formData.append(key, parseInt(value, 10));
        } else if (floatFields.includes(key)) {
          if (value !== undefined && value !== null)
            formData.append(key, parseFloat(value));
        } else {
          if (value !== undefined && value !== null)
            formData.append(key, value);
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
      destroyOnClose
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
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="id_category"
              label="Danh mục"
              rules={[{ required: true, message: "Vui lòng chọn danh mục" }]}
            >
              <Select placeholder="Chọn danh mục">
                {subcategories.map((cat) => (
                  <Option key={cat.id_subcategory} value={cat.id_subcategory}>
                    {cat.category_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="price"
              label="Giá"
              rules={[{ required: true, message: "Vui lòng nhập giá" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item name="discount" label="Giảm giá (%)">
              <InputNumber style={{ width: "100%" }} min={0} max={100} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="volume" label="Dung tích (ml)">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="Nam">Nam</Option>
                <Option value="Nữ">Nữ</Option>
                <Option value="Unisex">Unisex</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại"
              rules={[{ required: true, message: "Vui lòng nhập loại" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Tồn kho"
              rules={[{ required: true, message: "Vui lòng nhập tồn kho" }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item name="views" label="Lượt xem">
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            {/* ĐÃ BỎ FIELD RATING */}

            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
            >
              <Select placeholder="Chọn trạng thái">
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="image"
              label="Hình ảnh"
              valuePropName="file"
              // Không bắt buộc thay ảnh khi chỉnh sửa; nếu muốn bắt buộc, thêm rule validator check file
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
