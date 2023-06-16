import { Form, Input } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { getAntdInputValidation } from "../../utils/helpers";

const OrgHospitalForm = ({ type }) => {
  return (
    <>
      <Form.Item
        label={type === "hospital" ? "Hospital Name" : "Organization Name"}
        name={type === "hospital" ? "Hospital Name" : "Organization Name"}
        rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item label="Owner" name="owner"
      rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email"
      rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item name="phone" label="Phone"
      rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item name="website" label="Website"
      rules={getAntdInputValidation()}>
        <Input />
      </Form.Item>
      <Form.Item name="password" label="Password"
      rules={getAntdInputValidation()}>
        <Input type="password" />
      </Form.Item>
      <Form.Item name="address" label="Address" className="col-span-2"
      rules={getAntdInputValidation()}>
        <TextArea />
      </Form.Item>
    </>
  );
};

export default OrgHospitalForm;
