import React, { Suspense } from "react";

import { Row, Col, Typography } from "antd";

import { TeamOutlined } from "@ant-design/icons";

//Components
import {
  InfoCard,
  ComparisonChart,
  BudgetChart,
} from "../components/Dashboard";

//Helper
import {
  CardAvatarSkeletonFallback,
  FallbackSpinner,
} from "../components/common/";

const { Title } = Typography;

function Dashboard() {
  const infoCards = [
    {
      title: "Students enrolled",
      icon: <TeamOutlined style={{ fontSize: 50, color: "#5b86c1" }} />,
    },
    {
      title: "Total Professors",
      icon: <TeamOutlined style={{ fontSize: 50, color: "#5b86c1" }} />,
    },
    {
      title: "This year's budget",
      icon: <TeamOutlined style={{ fontSize: 50, color: "#5b86c1" }} />,
    },
    {
      title: "Upcomming events",
      icon: <TeamOutlined style={{ fontSize: 50, color: "#5b86c1" }} />,
    },
  ];

  const secondRow = [
    {
      component: <ComparisonChart />,
      fallback: FallbackSpinner(),
    },
    {
      component: <BudgetChart />,
      fallback: FallbackSpinner(),
    },
  ];

  return (
    <div>
      <Title className="font-weight-bolder" level={2}>
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        {infoCards.map((info, index) => (
          <Col
            key={index}
            xl={{ span: 6 }}
            lg={{ span: 12 }}
            md={{ span: 12 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Suspense fallback={CardAvatarSkeletonFallback(1, 1)}>
              <InfoCard {...info} />
            </Suspense>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        {secondRow.map((row, index) => (
          <Col
            key={index}
            xl={{ span: 12 }}
            lg={{ span: 24 }}
            md={{ span: 24 }}
            sm={{ span: 24 }}
            xs={{ span: 24 }}
          >
            <Suspense fallback={row.fallback}>{row.component}</Suspense>
          </Col>
        ))}
      </Row>
    </div>
  );
}

export default Dashboard;
