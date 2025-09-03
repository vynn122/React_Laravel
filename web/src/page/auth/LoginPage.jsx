import React, { useState } from "react";
import { profileStore } from "../../store/profileStore";
import { Button, Card, Checkbox, Form, Input, message } from "antd";
import Title from "antd/es/skeleton/Title";
import { useNavigate } from "react-router-dom";
import { request } from "../../utils/request";
const LoginPage = () => {
  const { setProfile, setAccessToken } = profileStore();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const onFinish = async (value) => {
    let data = {
      ...value,
    };
    setLoading(true);
    const res = await request("login", "post", data);
    console.log(res);
    if (res?.success) {
      message.success(res.message);
      setProfile(res?.user);
      setAccessToken(res?.token);
      navigate("/");
    } else {
      message.error(res?.error);
    }
    // alert(JSON.stringify(value));
    // let isSuccess = true;
    // if (isSuccess) {
    //   setProfile({
    //     ...value,
    //   });
    //   navigate("/");
    // }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <Card className="shadow-xl rounded-2xl w-full max-w-md" bordered={false}>
        <div className="text-center mb-6">
          <Title level={2} className="!mb-2">
            Welcome Back
          </Title>
          <p className="text-gray-500">Please login to your account</p>
        </div>

        <Form
          name="login"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input size="large" placeholder="Enter username" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" placeholder="Enter password" />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a href="#" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              className="rounded-lg"
              loading={loading}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center mt-6">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
};
export default LoginPage;
