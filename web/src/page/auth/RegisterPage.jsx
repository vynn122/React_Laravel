import { Button, Card, Checkbox, Form, Input, message, Upload } from "antd";
import { LockOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import Title from "antd/es/skeleton/Title";
import { useState } from "react";
import { request } from "../../utils/request";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [fileList, setFileList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload </div>
    </button>
  );

  const handleOnChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const onFinish = async (values) => {
    console.log("Form values:", values);
    let formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("password_confirmation", values.password_confirmation);
    formData.append("phone", values.phone);
    formData.append("address", values.address);
    formData.append("type", "User");
    if (values.image && values.image.file) {
      formData.append("image", values.image.file.originFileObj);
    }

    const res = await request("register", "post", formData);
    if (res?.success) {
      setLoading(true);
      message.success(res?.message || "Account Created");
      navigate("/login");
    } else {
      message.error(res?.message || "Failed");
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <Card className="shadow-xl rounded-2xl w-full max-w-md" bordered={false}>
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2">
            Welcome Back
          </Title>
          <p className="text-gray-500">Please Create an account</p>
        </div>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input your name!" }]}
          >
            <Input size="large" placeholder="Enter name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              prefix={<UserOutlined />}
              size="large"
              placeholder="Enter email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            label="Confirm Password"
            name="password_confirmation"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>

          <Form.Item label="Phone" name="phone">
            <Input size="large" placeholder="Enter Phone Number" />
          </Form.Item>

          <Form.Item label="Address" name="address">
            <Input size="large" placeholder="Enter Address" />
          </Form.Item>
          <Form.Item name="image">
            <Upload
              listType="picture-circle"
              fileList={fileList}
              onChange={handleOnChange}
              /// use this to avoid the border red
              customRequest={(e) => {
                e.onSuccess();
              }}
            >
              {fileList.length === 1 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="rounded-lg"
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-6">
          <p className="text-gray-500">
            <span>Already have an account?</span>{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};
export default RegisterPage;
