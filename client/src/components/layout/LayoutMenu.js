import React, { useEffect, useState } from "react";
import { Link, withRouter } from "react-router-dom";

import { Row, Col, Avatar, Menu, Typography } from "antd";
import {
  UserOutlined,
  AppstoreOutlined,
  ClusterOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import cpeLogo from "../../assets/images/cpe-logo.png";
import "./styles.css";

const { Text } = Typography;
const { SubMenu } = Menu;

function LayoutMenu({ history, setSiderCollapse }) {
  const [activeMenu, setActiveMenu] = useState("1");
  let openKeys = [];
  let pathname = history.location.pathname;

  if (
    pathname.includes("/manage-news") ||
    pathname.includes("/manage-categories")
  ) {
    openKeys = ["news"];
  } else if (pathname.includes("/manage-learn-skills")) {
    openKeys = ["learn-skills"];
  }

  useEffect(() => {
    let pathname = history.location.pathname;

    if (pathname === "/") {
      setActiveMenu("1");
    } else if (pathname === "/manage-news/create") {
      setActiveMenu("3");
    } else if (pathname.includes("/manage-news")) {
      setActiveMenu("2");
    } else if (pathname.includes("/manage-categories")) {
      setActiveMenu("4");
    } else if (pathname.includes("/manage-learn-skills")) {
      setActiveMenu("5");
    } else if (pathname.includes("/manage-about-us")) {
      setActiveMenu("6");
    }
  }, [history.location.pathname]);
  const onMenuChange = ({ key }) => {
    setSiderCollapse(false);
    setActiveMenu(key);
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-center pb-1 logo-div">
        <img loading="lazy" alt="logo" width={90} src={cpeLogo} />
      </div>
      <Row>
        <Col className="user-column" span={9}>
          <Avatar
            className="ml-1 mb-2 mt-2"
            size={50}
            alt="user-profile"
            src="https://scontent.fmnl7-1.fna.fbcdn.net/v/t1.0-9/116893716_3204324283015870_5983696327049027815_o.jpg?_nc_cat=100&_nc_sid=09cbfe&_nc_eui2=AeGkR2afXv9hVLQO9qHDHEblld2WR0vxCx6V3ZZHS_ELHk30MP1YjTLn4NFdzGoEQZqu0OZrr2VkTI601kN6oWwk&_nc_ohc=T9Ms2WrKQ48AX-Vnyrx&_nc_ht=scontent.fmnl7-1.fna&oh=357c71e5d4b1051df2805d0ca93392f1&oe=5FA89548"
          />
        </Col>
        <Col className="user-column" span={15}>
          <div className="d-flex flex-column align-items-start justify-content-center h-100 w-100">
            <Text className="text-center" strong>
              Ralp Yosores
            </Text>
            <small type="secondary">Web Developer</small>
          </div>
        </Col>
      </Row>

      <Menu
        mode="inline"
        defaultSelectedKeys={[activeMenu]}
        selectedKeys={[activeMenu]}
        onClick={onMenuChange}
        defaultOpenKeys={openKeys}
      >
        <Menu.Item key="1" icon={<UserOutlined />}>
          <Link to="/">Dashboard</Link>
        </Menu.Item>
        <SubMenu key="news" icon={<AppstoreOutlined />} title="News">
          <Menu.Item key="2">
            <Link to="/manage-news">Manage News</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/manage-news/create">Add News</Link>
          </Menu.Item>

          <Menu.Item key="4">
            <Link to="/manage-categories">Manage News Category</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="learn-skills"
          icon={<ClusterOutlined />}
          title="Learn Skills"
        >
          <Menu.Item key="5">
            <Link to="/manage-learn-skills">Manage Learn Skills</Link>
          </Menu.Item>
        </SubMenu>

        <Menu.Item icon={<QuestionCircleOutlined />} key="6">
          <Link to="/manage-about-us">Manage About Us</Link>
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default withRouter(LayoutMenu);
