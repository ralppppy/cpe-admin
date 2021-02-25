import { Button, Card, Form, Space } from "antd";
import React, { useEffect, useState } from "react";
import HTTPRequest from "./helper/HTTPRequest";
import { SaveOutlined } from "@ant-design/icons";
import { AboutUsForm } from "./";
import { withRouter } from "react-router-dom";

function CreateAboutUs({ aboutUsData, history, setAboutUsData }) {
  const [form] = Form.useForm();
  const [isEditorEmpty, setIsEditorEmpty] = useState(false);

  const onFinish = (values) => {
    let aboutUsValue = values.aboutUsContent;
    if (aboutUsValue === "<p><br></p>") {
      setIsEditorEmpty(true);
    } else {
      HTTPRequest.createOrUpdateAboutUs(
        values,
        aboutUsData,
        history,
        setAboutUsData
      );
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      aboutUsIntroduction: aboutUsData?.aboutUsIntroduction,
      aboutUsContent: aboutUsData?.aboutUsContent,
    });
  }, [form, aboutUsData]);

  const onFinishFailed = (error) => {
    console.log(error);
    let aboutUsContentValue = error.values.aboutUsContent;
    if (aboutUsContentValue === "<p><br></p>" || aboutUsContentValue === "") {
      setIsEditorEmpty(true);
    }
  };
  return (
    <Form
      form={form}
      layout="vertical"
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Space direction="vertical" className="w-100">
        <Button htmlType="submit" icon={<SaveOutlined />} type="primary">
          Save
        </Button>

        <Card className="mb-4">
          <div className="container">
            <AboutUsForm
              isEditorEmpty={isEditorEmpty}
              setIsEditorEmpty={setIsEditorEmpty}
            />
          </div>
          {/* <Empty description="Currently About us is emtpy click on the Write Something button to start" /> */}
        </Card>
      </Space>
    </Form>
  );
}

export default withRouter(CreateAboutUs);
