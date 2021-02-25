import React, { useState } from "react";
import parse from "html-react-parser";

import {
  Card,
  Divider,
  Typography,
  Image,
  Button,
  Tag,
  Skeleton,
  Space,
  Col,
  Row,
  Result,
} from "antd";
import { Link, withRouter } from "react-router-dom";
import HTTPRequest from "./helper/HTTPRequest";
import dayjs from "dayjs";

import { CaretLeftOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

function ViewNews({ match }) {
  const [viewData, setViewData] = useState({ newsTitle: "", newsContent: "" });

  useState(() => {
    let { newsUrlSlug } = match.params;
    HTTPRequest.fetchSingleNewsView(newsUrlSlug, setViewData);
  }, [match, setViewData]);

  return (
    <Card className="mb-3">
      {!viewData ? (
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={
            <Link to="/manage-news">
              <Button icon={<CaretLeftOutlined />} type="default">
                Go Back
              </Button>
            </Link>
          }
        />
      ) : (
        <Row>
          <Col className="w-100" md={{ span: 24 }}>
            <Link className="float-right" to="/manage-news">
              <Button icon={<CaretLeftOutlined />} type="default">
                Go Back
              </Button>
            </Link>
          </Col>
          <Col className="w-100" md={{ span: 24 }}>
            {viewData.newsTitle &&
            viewData.createdAt &&
            viewData.coverImageNameLg &&
            viewData.newsContent ? (
              <>
                <Title>{viewData.newsTitle}</Title>
                <Text strong={true}>Date Created: </Text>
                <Text>
                  {dayjs(viewData.createdAt).format("MMMM DD, YYYY, hh:mm a")}{" "}
                </Text>
                <Text>
                  <Tag color={viewData.published ? "#87d068" : "#c5c5c5"}>
                    {viewData.published ? "PUBLISHED" : "PENDING FOR PUBLISHED"}
                  </Tag>
                </Text>
                <Divider />

                <Image
                  alt="news-cover"
                  style={{ cursor: "pointer" }}
                  src={`/public/image/news/${viewData.coverImageNameLg}`}
                />
                <Divider />
                {parse(viewData.newsContent)}
              </>
            ) : (
              <>
                <Space direction="vertical" size="large">
                  <Skeleton.Input
                    style={{ width: "40vw" }}
                    active={true}
                    size="large"
                  />

                  <Space>
                    <Skeleton.Input
                      style={{ width: "6vw" }}
                      active={true}
                      size="small"
                    />

                    <Skeleton.Input
                      style={{ width: "10vw" }}
                      active={true}
                      size="small"
                    />
                    <Skeleton.Input
                      style={{ width: "4vw" }}
                      active={true}
                      size="small"
                    />
                    <Skeleton.Input
                      style={{ width: "8vw" }}
                      active={true}
                      size="small"
                    />
                  </Space>
                </Space>
                <Divider />
                <Skeleton.Image className="w-100" />
                <Divider />
                <Skeleton paragraph={{ rows: 6 }} />
              </>
            )}
          </Col>
        </Row>
      )}
    </Card>
  );
}

export default withRouter(ViewNews);
