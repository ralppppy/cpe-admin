import {
  Card,
  Divider,
  Skeleton,
  Typography,
  Row,
  Col,
  Button,
  Result,
} from "antd";
import React, { useState } from "react";
import { withRouter, Link } from "react-router-dom";
import parse from "html-react-parser";
import { CaretLeftOutlined } from "@ant-design/icons";

import HTTPRequest from "./helper/HTTPRequest";

const { Title } = Typography;

function ViewSkill({ match }) {
  const [viewData, setViewData] = useState({
    skillTitle: "",
    skillContent: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useState(() => {
    let { skillUrlSlug } = match.params;
    HTTPRequest.fetchSingleSkillView(skillUrlSlug, setViewData, setIsLoading);
  }, [match, setViewData, setIsLoading]);
  return (
    <div>
      <Card>
        {!viewData ? (
          <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={
              <Link to="/manage-learn-skills">
                <Button icon={<CaretLeftOutlined />} type="default">
                  Go Back
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            <Row>
              <Col className="w-100" md={{ span: 24 }}>
                <Link className="float-right" to="/manage-learn-skills">
                  <Button icon={<CaretLeftOutlined />} type="default">
                    Go Back
                  </Button>
                </Link>
              </Col>
              <Col className="w-100" md={{ span: 24 }}>
                {viewData.skillTitle && viewData.skillContent && isLoading ? (
                  <>
                    <Skeleton.Input
                      size="large"
                      active={true}
                      style={{ width: "40vw" }}
                    />
                    <Divider />

                    <Skeleton paragraph={{ rows: 6 }} />
                  </>
                ) : (
                  <>
                    <Title>{viewData.skillTitle}</Title>
                    <Divider />
                    {parse(viewData.skillContent)}
                  </>
                )}
              </Col>
            </Row>
          </>
        )}
      </Card>
    </div>
  );
}

export default withRouter(ViewSkill);
