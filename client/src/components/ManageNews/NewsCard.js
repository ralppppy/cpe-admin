import React from "react";

import { Tooltip, Card } from "antd";

import { DeleteOutlined, EyeOutlined, FormOutlined } from "@ant-design/icons";

function NewsCard() {
  return (
    <Card
      cover={
        <img
          alt="example"
          src="https://scontent.fmnl6-2.fna.fbcdn.net/v/t1.0-9/121237306_3681131788598499_2053335864716817617_n.jpg?_nc_cat=100&ccb=2&_nc_sid=8bfeb9&_nc_eui2=AeFwfJIy9SNBBFl80SvRrIadzJDXrHTTOanMkNesdNM5qRQ_NuG46YvrEnZVmzan6ydvKbWesFTHAfw7fHF1Ozcd&_nc_ohc=B0W5VvK0144AX9OouYH&_nc_ht=scontent.fmnl6-2.fna&oh=18702e84e284f0e799cc57bb4cdceb30&oe=5FB67B22"
        />
      }
      actions={[
        <Tooltip title="View Post">
          <EyeOutlined className="text-primary" />
        </Tooltip>,
        <Tooltip title="Edit Post">
          <FormOutlined className="text-info" />
        </Tooltip>,
        <Tooltip title="Delete Post">
          <DeleteOutlined className="text-danger" />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        title="This is a news Title"
        description="This is created bla bla lbah "
      />
    </Card>
  );
}

export default NewsCard;
