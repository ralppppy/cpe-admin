import React from "react";

import { Card, Skeleton } from "antd";

const CardAvatarSkeletonFallback = (rows, rowList) => {
  const skeletonRow = new Array(rowList).fill("");
  return (
    <Card>
      {skeletonRow.map((n, key) => (
        <Skeleton
          key={key}
          avatar
          active
          size="small"
          shape="round"
          paragraph={{ rows: rows }}
        />
      ))}
    </Card>
  );
};

export default CardAvatarSkeletonFallback;
