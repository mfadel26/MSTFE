import React from "react";
import { Form, Input, Layout, Menu, Breadcrumb, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { Link, Redirect } from "react-router-dom";
import "../Asset/login.css";
const { Header, Content, Footer } = Layout;
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      isLoading:false
    };
  }

  onFinish = (values) => {
    localStorage.setItem("validate", JSON.stringify(values.username));
    if (values.username == "adminMst") {
      this.setState({ isLogin: true });
    }
  };
  render() {
    const { isLogin } = this.state;
    if (isLogin == true) {
      return <Redirect to="/home" />;
    }
    return (
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["2"]}>
            <Menu.Item key="1">Welcome To MST</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: "0 90px", backgroundColor: "white" }}>
          <Breadcrumb style={{ margin: "40px 0" }}></Breadcrumb>
          <div className="site-layout-content">
            <Form
              name="normal_login"
              className="login-forms"
              initialValues={{ remember: true }}
              onFinish={this.onFinish}>
              <Form.Item
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Please input your Username!",
                  },
                ]}>
                <Input
                  prefix={<UserOutlined className="site-form-item-icon" />}
                  placeholder="Username"
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Please input your Password!",
                  },
                ]}>
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  size="large"
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>
              <Form.Item></Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="login-form-button">
                  login        
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Content>
      </Layout>
    );
  }
}

export default Login;
