import React from "react";

const InfoCard = React.lazy(() => import("./InfoCard"));
const ComparisonChart = React.lazy(() => import("./ComparisonChart"));
const Messages = React.lazy(() => import("./Messages"));
const BudgetChart = React.lazy(() => import("./BudgetChart"));

export { InfoCard, ComparisonChart, Messages, BudgetChart };
