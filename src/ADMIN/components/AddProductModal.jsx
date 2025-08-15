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

const AddProductModal = ({ visible, onCancel, onSubmit }) => {
  const [form] = Form.useForm();
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const loadSubcategories = async () => {
      const data = await fetchAdminSubcategories();
      const active = Array.isArray(data) ? data.filter((item) => item.status === "active") : [];
      setSubcategories(active);
    };
    loadSubcategories();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const formData = new FormData();

      const intFields = ["id_category", "volume", "quantity", "views"];
      const floatFields = ["price", "discount"];

      Object.keys(values).forEach((key) => {
        const value = values[key];

        if (key === "image") {
          const file = value;
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
      destroyOnClose
      width={1000}
      styles={{ maxHeight: "70vh", overflowY: "auto" }}
      okButtonProps={{
        style: { backgroundColor: "#DBB671", borderColor: "#DBB671", color: "#000" },
      }}
    >
      <Form layout="vertical" form={form} initialValues={{ status: "active" }}>
        <Row gutter={[16, 8]}>
          <Col span={8}>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
            >
              <Input placeholder="Nhập tên sản phẩm" />
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
              rules={[
                { required: true, message: "Vui lòng nhập giá" },
                { type: "number", min: 0, message: "Giá không được âm" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Nhập giá" />
            </Form.Item>

            <Form.Item
              name="discount"
              label="Giảm giá (%)"
              rules={[
                { required: true, message: "Vui lòng nhập mức giảm giá" },
                { type: "number", min: 0, message: "Giảm giá không được âm" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Nhập % giảm giá" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="volume"
              label="Dung tích (ml)"
              rules={[
                { required: true, message: "Vui lòng nhập dung tích" },
                { type: "number", min: 0, message: "Dung tích không được âm" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Nhập dung tích (ml)" />
            </Form.Item>

            <Form.Item
              name="gender"
              label="Giới tính"
              rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}
            >
              <Select placeholder="Chọn giới tính">
                <Option value="male">Nam</Option>
                <Option value="female">Nữ</Option>
                <Option value="unisex">Unisex</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="type"
              label="Loại"
              rules={[{ required: true, message: "Vui lòng nhập loại sản phẩm" }]}
            >
              <Input placeholder="Nhập loại sản phẩm" />
            </Form.Item>

            <Form.Item
              name="quantity"
              label="Tồn kho"
              rules={[
                { required: true, message: "Vui lòng nhập số lượng tồn kho" },
                { type: "number", min: 0, message: "Tồn kho không được âm" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Nhập số lượng tồn kho" />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              name="views"
              label="Lượt xem"
              rules={[
                { required: true, message: "Vui lòng nhập lượt xem" },
                { type: "number", min: 0, message: "Lượt xem không được âm" },
              ]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="Nhập số lượt xem" />
            </Form.Item>

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
              getValueFromEvent={(e) => {
                if (Array.isArray(e)) return e;
                return e?.fileList?.[0];
              }}
              rules={[{ required: true, message: "Vui lòng chọn hình ảnh" }]}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
              </Upload>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <Input.TextArea rows={3} placeholder="Nhập mô tả sản phẩm" />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea rows={2} placeholder="(Không bắt buộc)" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default AddProductModal;
