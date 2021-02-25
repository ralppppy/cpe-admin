import React, { useState, useEffect, useRef } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Row,
  Col,
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

const { Text } = Typography;
const { TextArea } = Input;

function CreateOrUpdateSkill({
  history,
  match,
  isUpdate,
  dispatch,
  coverImage,
}) {
  const [files, setFiles] = useState([]);
  const [isEditorEmpty, setIsEditorEmpty] = useState(false);
  const [form] = Form.useForm();
  const [isImageRemoved, setIsImageRemoved] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const pond = useRef();

  useEffect(() => {
    if (isUpdate) {
      HTTPRequest.fetchSingleSkill(match.params.skillId, form, dispatch);
    }
    return () => {
      form.resetFields();
      dispatch({ type: "CLEAR_COVER_IMAGE_NAME" });
    };
  }, [match, form, isUpdate, dispatch]);
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
      console.log(values);
      let skillContentValue = values.skillContent;
      if (skillContentValue === "<p><br></p>") {
        setIsEditorEmpty(true);
      } else {
        let data = {
          ...values,
          id: match.params.skillId,
          imageBase64:
            files.length > 0 ? files[0].getFileEncodeBase64String() : null,
        };

        HTTPRequest.updateSkill(data, setIsUpdated, dispatch);
      }
    } else {
      let skillContentValue = values.skillContent;
      if (skillContentValue === "<p><br></p>" || skillContentValue === "") {
        setIsEditorEmpty(true);
      } else {
        let data = {
          ...values,
          imageBase64:
            files.length > 0 ? files[0].getFileEncodeBase64String() : null,
        };
        HTTPRequest.createSkill(data, history);
      }
    }
  };

  const onFinishFailed = (error) => {
    console.log(error);
    let skillContentValue = error.values.skillContent;
    if (skillContentValue === "<p><br></p>" || skillContentValue === "") {
      setIsEditorEmpty(true);
    }
  };

  const handleEditorChange = () => {
    setIsEditorEmpty(false);
  };

  const setImageCoverFile = (file) => {
    form.setFieldsValue({
      skillImage: file.length > 0 ? "hasImage" : "",
    });
  };

  const handleRemoveImage = () => {
    setIsUpdated(false);
    setFiles([]);
    setIsImageRemoved(false);
    form.setFieldsValue({
      skillImage: undefined,
    });
  };

  const handleUndoImageRemove = () => {
    setIsImageRemoved(true);
    setFiles([]);
    form.setFieldsValue({
      skillImage: "hasImage",
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
                help={isEditorEmpty && "Please input skill content"}
                label="Write something about this skill"
                name="skillContent"
                rules={[
                  { required: true, message: "Please input skill content." },
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
                label="Skill Title"
                name="skillTitle"
                rules={[
                  { required: true, message: "Please input a skill title." },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Short Description"
                name="skillDescription"
                rules={[
                  {
                    required: true,
                    message: "Please input a skill description.",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                name="skillImage"
                className="text-center"
                rules={[
                  { required: true, message: "Please add a News Cover Image" },
                ]}
                label={
                  isUpdate ? (
                    <Space>
                      <Text>Cover Icon</Text>
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
                    "Upload Cover Icon"
                  )
                }
              >
                {isUpdated || (isUpdate && isImageRemoved) ? (
                  <>
                    {console.log(coverImage)}
                    <div className="container-im">
                      <Image
                        className="image-skill"
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
                  <Link to="/manage-learn-skills">
                    <Button icon={<CaretLeftOutlined />} type="default">
                      Go Back
                    </Button>
                  </Link>
                </Form.Item>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* <Card>
          <Space direction="vertical w-100">
            <div className="mb-3">
              <Space>
                <Button
                  icon={<CheckOutlined />}
                  type="primary"
                  htmlType="submit"
                >
                  {isUpdate ? "Save" : "Submit"}
                </Button>
                <Link to="/manage-learn-skills">
                  <Button icon={<CaretLeftOutlined />} type="default">
                    Go Back
                  </Button>
                </Link>
              </Space>
            </div>
            <div>
              <Form.Item
                label="Skill Title"
                name="skillTitle"
                rules={[
                  { required: true, message: "Please input a skill title." },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Short Description"
                name="skillDescription"
                rules={[
                  {
                    required: true,
                    message: "Please input a skill description.",
                  },
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                initialValue=""
                validateStatus={isEditorEmpty && "error"}
                help={isEditorEmpty && "Please input skill content"}
                label="Write something about this skill"
                name="skillContent"
                rules={[
                  { required: true, message: "Please input skill content." },
                ]}
              >
                <ReactQuill
                  onChange={handleEditorChange}
                  modules={modules}
                  formats={formats}
                  theme="snow"
                />
              </Form.Item>
            </div>
          </Space>
        </Card> */}
      </Form>
    </>
  );
}

export default React.memo(withRouter(CreateOrUpdateSkill));
