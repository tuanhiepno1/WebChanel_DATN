import React from "react";
import { Form, Input } from "antd";

const DeliveryInfoForm = ({ info, setInfo, form }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={info}
      onValuesChange={(changedValues, allValues) => setInfo(allValues)}
    >
      <Form.Item
        label="Tên người nhận"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên người nhận" }]}
      >
        <Input placeholder="Tên người nhận" />
      </Form.Item>

      <Form.Item
        label="Số điện thoại"
        name="phone"
        rules={[
          { required: true, message: "Vui lòng nhập số điện thoại" },
          { pattern: /^\d{10}$/, message: "Số điện thoại phải gồm 10 chữ số" },
        ]}
      >
        <Input placeholder="Số điện thoại (VD: 0912345678)" />
      </Form.Item>

      <Form.Item
        label="Địa chỉ nhận hàng"
        name="address"
        rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
      >
        <Input.TextArea placeholder="Địa chỉ nhận hàng" autoSize />
      </Form.Item>
    </Form>
  );
};

export default DeliveryInfoForm;
