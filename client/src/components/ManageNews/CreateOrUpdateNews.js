import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
  Select,
  Checkbox,
  Space,
  Image,
  Typography,
} from "antd";
import {
  CheckOutlined,
  SaveOutlined,
  CaretLeftOutlined,
  UndoOutlined,
} from "@ant-design/icons";
import ReactQuill from "react-quill";

import HTTPRequest from "./helper/HTTPRequest";

import "react-quill/dist/quill.snow.css";
import "./styles.css";
import { Link, withRouter } from "react-router-dom";

// Import React FilePond
import { FilePond, registerPlugin } from "react-filepond";

// Import FilePond styles
import "filepond/dist/filepond.min.css";

// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";

import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginFileEncode
);

const { Option } = Select;
const { Text } = Typography;

function CreateOrUpdateNews({
  history,
  match,
  isUpdate,
  dispatch,
  coverImageName,
  coverImage,
}) {
  const [files, setFiles] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [isEditorEmpty, setIsEditorEmpty] = useState(false);
  const [form] = Form.useForm();
  const [isImageRemoved, setIsImageRemoved] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const pond = useRef();

  useEffect(() => {
    if (isUpdate) {
      HTTPRequest.fetchSingleNews(match.params.newsId, dispatch, form);
    }

    return () => {
      form.resetFields();
      dispatch({ type: "CLEAR_COVER_IMAGE_NAME" });
    };
  }, [match, form, dispatch, isUpdate]);

  useEffect(() => {
    HTTPRequest.fetchCategories(setCategoryList);
  }, [setCategoryList]);

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  const onFinish = (values) => {
    if (isUpdate) {
      let newsContentValue = values.newsContent;
      if (newsContentValue === "<p><br></p>") {
        setIsEditorEmpty(true);
      } else {
        let data = {
          ...values,
          id: match.params.newsId,
          published: values.published ? true : false,
          imageBase64:
            files.length > 0 ? files[0].getFileEncodeBase64String() : null,
        };

        HTTPRequest.updateNews(data, setIsUpdated, dispatch);
      }
    } else {
      let newsContentValue = values.newsContent;
      if (newsContentValue === "<p><br></p>" || newsContentValue === "") {
        setIsEditorEmpty(true);
      } else {
        let data = {
          ...values,
          published: values.published ? true : false,
          imageBase64: files[0].getFileEncodeBase64String(),
        };
        HTTPRequest.createNews(data, history);
      }
    }
  };

  const onFinishFailed = (error) => {
    console.log(error);
    let newsContentValue = error.values.newsContent;
    if (newsContentValue === "<p><br></p>" || newsContentValue === "") {
      setIsEditorEmpty(true);
    }
  };

  const handleEditorChange = () => {
    setIsEditorEmpty(false);
  };

  const setImageCoverFile = (file) => {
    console.log(coverImageName);
    form.setFieldsValue({
      newsImage: file.length > 0 ? "hasImage" : "",
    });
  };

  const handleRemoveImage = () => {
    setIsUpdated(false);
    setFiles([]);
    setIsImageRemoved(false);
    form.setFieldsValue({
      newsImage: undefined,
    });
  };

  const handleUndoImageRemove = () => {
    setIsImageRemoved(true);
    setFiles([]);
    form.setFieldsValue({
      newsImage: "hasImage",
    });
  };

  return (
    <>
      <Form
        form={form}
        layout="vertical"
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Row gutter={[16, 16]}>
          <Col
            lg={{ span: 16 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Card>
              <Form.Item
                initialValue=""
                validateStatus={isEditorEmpty && "error"}
                help={isEditorEmpty && "Please input news content"}
                label="Write a news content"
                name="newsContent"
                rules={[
                  { required: true, message: "Please input news content." },
                ]}
              >
                <ReactQuill
                  onChange={handleEditorChange}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                />
              </Form.Item>
            </Card>
          </Col>
          <Col
            lg={{ span: 8 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Card>
              <Form.Item
                label="News Title"
                name="newsTitle"
                rules={[
                  { required: true, message: "Please input a news title." },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="newsCategoryID"
                label="Select a category"
                rules={[
                  { required: true, message: "Please select a Category " },
                ]}
              >
                <Select placeholder="Please select a category">
                  {categoryList.map((category, index) => (
                    <Option key={index} value={category.categoryId}>
                      {category.categoryName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="newsImage"
                className="text-center"
                rules={[
                  { required: true, message: "Please add a News Cover Image" },
                ]}
                label={
                  isUpdate ? (
                    <Space>
                      <Text>Cover Image</Text>
                      {!isImageRemoved && !isUpdated && (
                        <Button
                          onClick={handleUndoImageRemove}
                          icon={<UndoOutlined />}
                          size="small"
                        >
                          Undo
                        </Button>
                      )}
                    </Space>
                  ) : (
                    "Upload Cover Image"
                  )
                }
              >
                {isUpdated || (isUpdate && isImageRemoved) ? (
                  <>
                    <div className="container-im">
                      <Image
                        className="image"
                        preview={false}
                        src={coverImage}
                      />
                      <div className="middle">
                        <Button
                          onClick={handleRemoveImage}
                          danger
                          type="primary"
                        >
                          Remove Image
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <FilePond
                    ref={pond}
                    allowFileTypeValidation={true}
                    allowFileEncode={true}
                    instantUpload={false}
                    files={files}
                    onupdatefiles={(file) => {
                      setFiles(file);
                      setImageCoverFile(file);
                    }}
                    allowMultiple={false}
                    acceptedFileTypes={["image/*"]}
                    maxFiles={3}
                    name="files"
                    credits={{ label: "" }}
                    labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                  />
                )}
              </Form.Item>

              <Form.Item valuePropName="checked" name="published">
                <Checkbox style={{ lineHeight: "32px" }}>Publish</Checkbox>
              </Form.Item>

              <Space>
                <Form.Item>
                  <Button
                    icon={isUpdate ? <SaveOutlined /> : <CheckOutlined />}
                    type="primary"
                    htmlType="submit"
                  >
                    {isUpdate ? "Save" : "Submit"}
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Link to="/manage-news">
                    <Button icon={<CaretLeftOutlined />} type="default">
                      Go Back
                    </Button>
                  </Link>
                </Form.Item>
              </Space>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  );
}

export default React.memo(withRouter(CreateOrUpdateNews));
