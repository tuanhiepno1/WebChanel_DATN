import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Row,
  Col,
} from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const VoucherModal = ({ visible, onCancel, onSubmit, voucher }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (voucher) {
      form.setFieldsValue({
        ...voucher,
        discount_amount: Number(voucher.discount_amount),
        min_order_amount: Number(voucher.min_order_amount),
        max_discount_amount: voucher.max_discount_amount
          ? Number(voucher.max_discount_amount)
          : null,
        usage_limit: Number(voucher.usage_limit),
        range: [dayjs(voucher.start_date), dayjs(voucher.end_date)],
      });
    } else {
      form.resetFields();
    }
  }, [voucher, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const { range, ...rest } = values;

      const formData = {
        ...rest,
        start_date: range?.[0]?.format("YYYY-MM-DD"),
        end_date: range?.[1]?.format("YYYY-MM-DD"),
        discount_amount: Number(rest.discount_amount),
        usage_limit: Number(rest.usage_limit),
        min_order_amount: String(rest.min_order_amount),
        max_discount_amount:
          rest.max_discount_amount !== null &&
          rest.max_discount_amount !== undefined
            ? String(rest.max_discount_amount)
            : null,
        description: rest.description || "",
        note: rest.note || "",
        status: rest.status || "inactive",
      };

      console.log("🚀 Sending data to API:", formData);

      await onSubmit(formData);
      form.resetFields();
    } catch (err) {
      message.error("Vui lòng kiểm tra lại thông tin.");
    }
  };

  return (
    <Modal
      open={visible}
      title={voucher ? "Cập nhật voucher" : "Thêm voucher"}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
      destroyOnClose
      okText={voucher ? "Sửa" : "Thêm"}
      okButtonProps={{
        style: {
          backgroundColor: "#DBB671",
          borderColor: "#DBB671",
          color: "#000",
        },
      }}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Mã voucher"
              name="code"
              rules={[{ required: true, message: "Vui lòng nhập mã voucher" }]}
            >
              <Input />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Loại giảm giá"
              name="type"
              rules={[{ required: true, message: "Chọn loại giảm giá" }]}
            >
              <Select placeholder="Chọn loại">
                <Option value="fixed">Giảm cố định (VNĐ)</Option>
                <Option value="percentage">Giảm phần trăm (%)</Option>
              </Select>
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Số tiền giảm"
              name="discount_amount"
              rules={[{ required: true, message: "Nhập số tiền hoặc % giảm" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Đơn tối thiểu"
              name="min_order_amount"
              rules={[{ required: true, message: "Nhập số tiền đơn tối thiểu" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Giảm tối đa"
              name="max_discount_amount"
              rules={[{ message: "Nhập số tiền giảm tối đa" }]}
            >
              <InputNumber min={0} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Giới hạn lượt dùng"
              name="usage_limit"
              rules={[{ required: true, message: "Nhập số lượt dùng" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Thời gian áp dụng"
              name="range"
              rules={[{ required: true, message: "Chọn thời gian áp dụng" }]}
            >
              <RangePicker format="DD/MM/YYYY" style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Trạng thái"
              name="status"
              rules={[{ required: true, message: "Chọn trạng thái" }]}
            >
              <Select>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Không hoạt động</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={2} />
        </Form.Item>

        <Form.Item label="Ghi chú" name="note">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default VoucherModal;
