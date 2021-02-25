import React from "react";
import { Button, Card, Divider, Empty, Space } from "antd";

import { FormOutlined } from "@ant-design/icons";

import "react-quill/dist/quill.snow.css";
import "./style.css";

import parse from "html-react-parser";

import { Link } from "react-router-dom";

function AboutUs({ aboutUsData }) {
  return (
    <>
      <Space direction="vertical" className="w-100">
        <Link to="/manage-about-us/create">
          <Button icon={<FormOutlined />} type="primary">
            Write Something
          </Button>
        </Link>

        <Card className="mb-4">
          <div className="container">
            {aboutUsData ? (
              <>
                <Divider />
                {console.log(aboutUsData)}
                {parse(aboutUsData?.aboutUsContent)}
              </>
            ) : (
              <Empty description="Currently About us is emtpy click on the Write Something button to start." />
            )}
          </div>
        </Card>
      </Space>
    </>
  );
}

export default AboutUs;
