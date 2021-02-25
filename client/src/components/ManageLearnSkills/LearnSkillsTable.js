import React, { useEffect, useState } from "react";
import { Table, Space, Card, Button, Form, Input, Modal } from "antd";
import {
  FormOutlined,
  DeleteOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";

import { Link } from "react-router-dom";

import HTTPRequest from "./helper/HTTPRequest";

import metaphone from "metaphone";
import stemmer from "stemmer";

import "./styles.css";

function LearnSkillsTable({ data, dispatch, searchedSkills, searchedValue }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    HTTPRequest.fetchSkills(dispatch, setLoading);
  }, [dispatch, setLoading]);

  const handleDelete = (record) => {
    HTTPRequest.deleteSkill(record, dispatch, data);
  };

  const deleteSkillAction = (record) => {
    Modal.confirm({
      title: "Are you sure delete this skill?",
      icon: <ExclamationCircleOutlined />,
      content: "This skill will be deleted and cannot be undone",
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
      title: "Skill ID",
      dataIndex: "skillId",
      key: "skillId",
      render: (text) => <>{text}</>,
      responsive: ["lg"],
    },
    {
      title: "Skill Title",
      dataIndex: "skillTitle",
      key: "skillTitle",
    },
    {
      title: "Skill Description",
      dataIndex: "skillDescription",
      key: "skillDescription",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Link to={`/manage-learn-skills/view/${record.skillUrlSlug}`}>
            <Button size="small" icon={<EyeOutlined />} type="primary" ghost>
              View
            </Button>
          </Link>
          <Link to={`/manage-learn-skills/update/${record.skillId}`}>
            <Button size="small" icon={<FormOutlined />} type="default">
              Edit
            </Button>
          </Link>
          <Button
            onClick={() => deleteSkillAction(record)}
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
      <Link to="/manage-learn-skills/create">
        <Button className="mb-3" type="primary" icon={<PlusOutlined />}>
          Add Skill
        </Button>
      </Link>

      <Card>
        <Form form={form} layout="horizontal" onFinish={handleSearch}>
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
          dataSource={searchedValue ? searchedSkills : data}
        />
      </Card>
    </>
  );
}

export default React.memo(LearnSkillsTable);
