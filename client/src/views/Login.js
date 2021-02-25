import React, { useContext, useState } from "react"

import { Link, withRouter } from "react-router-dom"
import { Button, Card, Form, Input, Space, Typography } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useMediaQuery } from "react-responsive"
import { AuthContext } from "../context/AuthContext"

const { Text } = Typography

function Login({ history }) {
  const { authenticate } = useContext(AuthContext)
  const [isValidating, setIsValidating] = useState(false)

  const [form] = Form.useForm()

  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" })

  const onFinish = (values) => {
    authenticate(values, setIsValidating)
  }

  return (
    <div className="d-flex align-items-center justify-content-center h-100 w-100 text-center">
      <Card className={`shadow-sm ${isTabletOrMobile ? "w-100" : "w-25"}`}>
        <img
          alt="logo"
          width={100}
          src={"https://wmsu-cpe.herokuapp.com/brand/brand@2x.png"}
        />
        <Form
          layout={"vertical"}
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Username"
            name="userName"
            rules={[
              {
                required: true,
                message: "Please input your Username",
              },
            ]}
          >
            <Input placeholder="Enter your email" prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                message: "Please input your Password",
              },
            ]}
            label="Password"
            name="password"
          >
            <Input.Password
              placeholder="Enter your password"
              prefix={<LockOutlined />}
            />
          </Form.Item>
          <Form.Item>
            <Button
              loading={isValidating}
              htmlType="submit"
              className="w-100"
              type="primary"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
        <Card>
          <Space>
            <small>Username: wmsucpeadmin</small>
            <small>Password: climate619</small>
          </Space>
        </Card>{" "}
        <br />
        <Text>Forgot your password?</Text> <Link to="#">Click Here</Link>
      </Card>
    </div>
  )
}

export default withRouter(Login)
