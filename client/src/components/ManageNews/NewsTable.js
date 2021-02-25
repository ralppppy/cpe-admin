import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Card,
  Button,
  Typography,
  Form,
  Input,
  Modal,
} from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";

import HTTPRequest from "./helper/HTTPRequest";

import dayjs from "dayjs";

import metaphone from "metaphone";
import stemmer from "stemmer";

import "./styles.css";

const { Text } = Typography;

function NewsTable({ data, dispatch, searchedNews, searchedValue }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    HTTPRequest.fetchNews(dispatch, setLoading);
  }, [dispatch, setLoading]);

  const handleDelete = (record) => {
    HTTPRequest.deleteNews(record, dispatch, data);
  };

  const deleteNewsAction = (record) => {
    Modal.confirm({
      title: "Are you sure delete this news?",
      icon: <ExclamationCircleOutlined />,
      content: "This news will be deleted and cannot be undone",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  };

  const handleSearch = (e) => {
    let value = e.currentTarget.value;

    let dataCopy = [...data];

    dataCopy = dataCopy.filter((news) => {
      return news.soundsLike.includes(metaphone(stemmer(value)));
    });

    dispatch({
      type: "SET_SEARCHED_DATA",
      value: dataCopy,
      searchedValue: value,
    });
  };

  const columns = [
    {
      title: "News ID",
      dataIndex: "newsId",
      key: "newsId",
      render: (text) => <>{text}</>,
      responsive: ["lg"],
    },
    {
      title: "News Title",
      dataIndex: "newsTitle",
      key: "newsTitle",
    },
    {
      title: "Category",
      dataIndex: "newsCategory",
      key: "newsCategory",
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      render: (tags) => (
        <>
          {tags.map((tag) => {
            let color = "";

            if (tag === "PUBLISHED") {
              color = "green";
            } else {
              color = "orange";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, record) => (
        <Text>{dayjs(text).format("MMMM DD, YYYY, hh:mm a")}</Text>
      ),
    },
    {
      title: "Date Updated",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (text, record) => (
        <Text>{dayjs(text).format("MMMM DD, YYYY, hh:mm a")}</Text>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/manage-news/view/${record.newsUrlSlug}`}>
            <Button size="small" icon={<EyeOutlined />} type="primary" ghost>
              View
            </Button>
          </Link>
          <Link to={`/manage-news/update/${record.newsId}`}>
            <Button size="small" icon={<FormOutlined />} type="default">
              Edit
            </Button>
          </Link>
          <Button
            onClick={() => deleteNewsAction(record)}
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
      <Link to="/manage-news/create">
        <Button className="mb-3" type="primary" icon={<PlusOutlined />}>
          Add News
        </Button>
      </Link>

      <Card>
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleSearch}
          // initialValues={{ requiredMark }}
          // onValuesChange={onRequiredTypeChange}
        >
          <Form.Item label="">
            <Space className="float-right">
              <Input
                prefix={<SearchOutlined />}
                value={searchedValue}
                onChange={handleSearch}
                className="search-input"
                placeholder="Search for News Title or news Category"
              />
            </Space>
          </Form.Item>
        </Form>

        <Table
          loading={loading}
          scroll={{ x: 700 }}
          columns={columns}
          dataSource={searchedValue ? searchedNews : data}
        />
      </Card>
    </>
  );
}

export default React.memo(NewsTable);
