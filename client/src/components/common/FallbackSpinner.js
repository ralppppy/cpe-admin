import React from "react";
import { Card } from "antd";
import "./spinner.styles.css";
import "./styles.css";

const FallbackSpinner = () => {
  return (
    <Card className="d-flex align-items-center justify-content-center fallback-spinner">
      <div className="half-circle-spinner">
        <div className="circle circle-1"></div>
        <div className="circle circle-2"></div>
      </div>
    </Card>
  );
};

export default FallbackSpinner;
