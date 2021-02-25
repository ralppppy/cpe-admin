import React from "react";

const NewsCard = React.lazy(() => import("./NewsCard"));
const NewsTable = React.lazy(() => import("./NewsTable"));
const CreateOrUpdateNews = React.lazy(() => import("./CreateOrUpdateNews"));
const ViewNews = React.lazy(() => import("./ViewNews"));

export { NewsCard, NewsTable, CreateOrUpdateNews, ViewNews };
