import React, { useEffect, useState } from "react";
import { Button, Card, Table, Space, Modal, Input, Form, message } from "antd";

import {
  FormOutlined,
  DeleteOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
  CloseOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import HTTPRequest from "./helper/HTTPRequest";

function CategoriesTable() {
  const [visible, setVisible] = useState(false);
  const [categoriesData, setCategoriesData] = useState([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  useEffect(() => {
    HTTPRequest.fetchCategories(setCategoriesData, setLoading);
  }, [setCategoriesData, setLoading]);

  const handleDeleteCategory = (record) => {
    HTTPRequest.deleteCategory(setCategoriesData, record, categoriesData);
  };

  const handleOk = () => {
    setVisible(!visible);
  };

  const handleCancel = () => {
    setVisible(!visible);
  };
  const handleAddCategory = () => {
    form.setFieldsValue({ categoryName: "" });
    setIsEditMode(false);
    setVisible(true);
  };

  const onFinish = (values, isEditMode) => {
    setIsAddingCategory(true);

    message.loading({
      content: isEditMode ? "Updating Category" : "Adding Category",
      key: "updatable",
    });
    if (isEditMode) {
      HTTPRequest.updateCategory(
        setCategoriesData,
        setVisible,
        setIsAddingCategory,
        values,
        editId,
        categoriesData
      );
    } else {
      HTTPRequest.createCategory(
        categoriesData,
        setCategoriesData,
        setVisible,
        setIsAddingCategory,
        form,
        values
      );
    }
  };

  const deleteCategoryAction = (record) => {
    Modal.confirm({
      title: "Are you sure delete this category?",
      icon: <ExclamationCircleOutlined />,
      content: "This category will be deleted and cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDeleteCategory(record);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };
  const onFinishFailed = (errors) => {
    console.log(errors);
  };

  const handleUpdateAction = (record) => {
    form.setFieldsValue({
      categoryName: record.categoryName,
    });

    setIsEditMode(true);

    setVisible(true);

    setEditId(record.categoryId);
  };

  const columns = [
    {
      title: "Category ID",
      dataIndex: "categoryId",
      key: "categoryId",
      render: (text) => <>{text}</>,
      responsive: ["lg"],
    },
    {
      title: "Category Name",
      dataIndex: "categoryName",
      key: "categoryName",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button
            onClick={() => handleUpdateAction(record)}
            size="small"
            icon={<FormOutlined />}
            type="default"
          >
            Edit
          </Button>
          <Button
            onClick={() => deleteCategoryAction(record)}
            size="small"
            icon={<DeleteOutlined />}
            danger
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Button
        onClick={handleAddCategory}
        className="mb-3"
        type="primary"
        icon={<PlusOutlined />}
      >
        Add category
      </Button>

      <Card>
        <Table
          loading={loading}
          columns={columns}
          dataSource={categoriesData}
        />
      </Card>

      <Modal
        title={isEditMode ? "Edit" : "Add"}
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          layout="vertical"
          name="basic"
          initialValues={{ remember: true }}
          onFinish={(values) => onFinish(values, isEditMode)}
          onFinishFailed={onFinishFailed}
          form={form}
        >
          <Form.Item
            initialValue=""
            label={isEditMode ? "Update news category" : "Add a news category"}
            name="categoryName"
            rules={[
              { required: true, message: "Please input news category name." },
            ]}
          >
            <Input placeholder="Category Name" />
          </Form.Item>

          <Space>
            <Button
              loading={isAddingCategory}
              htmlType="submit"
              icon={isEditMode ? <SyncOutlined /> : <PlusOutlined />}
              type="primary"
            >
              {isEditMode ? "Update" : "Add"}
            </Button>
            <Button
              icon={<CloseOutlined />}
              onClick={handleCancel}
              type="default"
            >
              Cancel
            </Button>
          </Space>
        </Form>
      </Modal>
    </>
  );
}

export default CategoriesTable;
