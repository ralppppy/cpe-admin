import React, { useState } from "react";

import { Layout, Drawer } from "antd";
import { UnorderedListOutlined } from "@ant-design/icons";
import LayoutMenu from "./LayoutMenu";

import "./styles.css";

const { Header, Content, Sider } = Layout;

function AdminLayout({ children }) {
  const [siderCollapse, setSiderCollapse] = useState(false);

  const onClose = () => {
    setSiderCollapse(false);
  };
  const openDrawer = () => {
    setSiderCollapse(true);
  };

  return (
    <Layout className="h-100 ">
      <Sider
        trigger={null}
        className="text-center"
        style={{ zIndex: 3 }}
        theme="light"
        breakpoint="lg"
        collapsedWidth="0"
        onBreakpoint={(broken) => {}}
        onCollapse={(collapsed, type) => {}}
      >
        <LayoutMenu setSiderCollapse={setSiderCollapse} />
      </Sider>

      <Drawer
        placement="left"
        closable={true}
        onClose={onClose}
        maskClosable
        visible={siderCollapse}
      >
        <LayoutMenu setSiderCollapse={setSiderCollapse} />
      </Drawer>

      <Layout>
        <Header style={{ zIndex: 2 }} className="shadow-sm header">
          <div style={{ fontSize: 20 }} className="ml-3 float-left">
            <UnorderedListOutlined onClick={openDrawer} />
          </div>
          <div className="mr-3 float-right">Notification</div>
          <div className="mr-3 float-right">Logout</div>
        </Header>

        <Content
          style={{
            margin: "24px 16px 0",
            marginTop: 80,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

export default AdminLayout;
