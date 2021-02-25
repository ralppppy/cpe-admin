import React from "react";
import Chart from "react-apexcharts";

import { Card } from "antd";

function ComparisonChart() {
  const series = [
    {
      name: "Male",
      data: [76, 85, 101, 12],
    },
    {
      name: "Female",
      data: [35, 41, 36, 50],
    },
  ];
  const options = {
    colors: ["#6faad6", "#bbc04f"],

    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    chart: {
      toolbar: {
        show: false,
      },
    },

    title: {
      text: "Gender breakdown",
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: ["2018", "2019", "2020", "2021"],
      title: {
        text: "Years",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "rgba(0,0,0,0.85)",
        },
      },
    },

    yaxis: {
      title: {
        text: "Number of Student/s",
        style: {
          fontSize: "12px",
          fontWeight: "bold",
          color: "rgba(0,0,0,0.85)",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => {
          return val;
        },
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
    <Card>
      <Chart options={options} series={series} type="bar" height={360} />
    </Card>
  );
}

export default ComparisonChart;
