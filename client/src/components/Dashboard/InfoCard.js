import React from "react";
import { Card, Typography } from "antd";

const { Text, Title } = Typography;

function InfoCard({ title, icon }) {
  return (
    <div>
      <Card>
        <Card.Meta
          avatar={icon}
          title={<Text>{title}</Text>}
          description={<Title level={2}>100</Title>}
        />
      </Card>
    </div>
  );
}

export default InfoCard;
