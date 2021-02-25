import React from "react";
import { Form, Input } from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./style.css";

const { TextArea } = Input;

function AboutUsForm({ isEditorEmpty, setIsEditorEmpty }) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, false] }],
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

  const handleEditorChange = () => {
    setIsEditorEmpty(false);
  };

  return (
    <>
      <Form.Item
        label="Write a About Us Introduction"
        name="aboutUsIntroduction"
        rules={[
          {
            required: true,
            message: "Please write a about us introduction.",
          },
        ]}
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        initialValue=""
        validateStatus={isEditorEmpty && "error"}
        help={isEditorEmpty && "Please input about us content"}
        label="Write a about us content"
        name="aboutUsContent"
        rules={[{ required: true, message: "Please input about us content." }]}
      >
        <ReactQuill
          onChange={handleEditorChange}
          modules={modules}
          formats={formats}
          theme="snow"
        />
      </Form.Item>
    </>
  );
}

export default AboutUsForm;
