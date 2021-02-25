import React from "react";
import { Card, Comment, Tooltip, Avatar } from "../../helper/AntdCustomImports";

import "./styles.css";

function Messages() {
  const actions = [<span key="comment-basic-reply-to">Reply to</span>];

  return (
    <Card className="message-card">
      <Comment
        actions={actions}
        author={<a href="facebook.com">Han Solo</a>}
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        }
        content={
          <p>
            We supply a series of design principles, practical patterns and high
            quality design resources (Sketch and Axure),
          </p>
        }
        datetime={
          <Tooltip title={12312313}>
            <span>123123</span>
          </Tooltip>
        }
      />
      <Comment
        actions={actions}
        author={<a href="facebook.com">Han Solo</a>}
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        }
        content={
          <p>
            We supply a series of design principles, practical patterns and high
            quality design resources (Sketch and Axure),
          </p>
        }
        datetime={
          <Tooltip title={12312313}>
            <span>123123</span>
          </Tooltip>
        }
      />
      <Comment
        actions={actions}
        author={<a href="facebook.com">Han Solo</a>}
        avatar={
          <Avatar
            src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
            alt="Han Solo"
          />
        }
        content={
          <p>
            We supply a series of design principles, practical patterns and high
            quality design resources (Sketch and Axure),
          </p>
        }
        datetime={
          <Tooltip title={12312313}>
            <span>123123</span>
          </Tooltip>
        }
      />
    </Card>
  );
}

export default Messages;
