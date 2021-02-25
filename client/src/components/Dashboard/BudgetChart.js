import React from "react";
import Chart from "react-apexcharts";
import { Card } from "antd";

import "./styles.css";

function BudgetChart() {
  const series = [44, 55, 13, 43, 22];
  const options = {
    labels: ["Budget 1", "Budget 2", "Budget 3", "Budget 4", "Budget 5"],
    colors: ["#6faad6", "#bbc04f", "#b15353", "#5ab57a", "#be9b4e"],
    title: {
      text: "Budget breakdown",
      align: "left",
      margin: 10,
      offsetX: 0,
      offsetY: 0,
      floating: false,
      style: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "rgba(0,0,0,0.85)",
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: "100%",
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  return (
    <Card className="budget-card">
      <Chart
        options={options}
        series={series}
        type="pie"
        height={360}
        width="100%"
      />
    </Card>
  );
}

export default BudgetChart;
