import React, { Suspense, useContext, useEffect, useState } from "react";
import { Typography } from "antd";
//Helper Imports

//Components
import {
  NewsTable,
  CreateOrUpdateNews,
  ViewNews,
} from "../components/ManageNews";

//Common
import { FallbackSpinner } from "../components/common";
import { withRouter } from "react-router-dom";

import { ManageNewsContext } from "../context/ManageNewsContext";

const { Title } = Typography;

function ManageNews({ history, match }) {
  let { state, dispatch } = useContext(ManageNewsContext);

  const [pageTitle, setPageTitle] = useState("");

  const PATH = {
    manageNews: "/manage-news",
    createNews: "/manage-news/create",
    updateNews: `/manage-news/update/${match.params.newsId}`,
    viewNews: `/manage-news/view/${match.params.newsUrlSlug}`,
  };

  useEffect(() => {
    let pathname = history.location.pathname;
    switch (pathname) {
      case PATH.manageNews:
        setPageTitle("Manage News");
        break;
      case PATH.createNews:
        setPageTitle("Create News");
        break;
      case PATH.updateNews:
        setPageTitle("Update News");
        break;
      default:
        setPageTitle("");
    }
  }, [history.location.pathname, PATH]);

  const renderContent = () => {
    let pathname = history.location.pathname;
    let isUpdate = false;

    switch (pathname) {
      case PATH.manageNews:
        return (
          <NewsTable
            data={state.news}
            searchedNews={state.searchedNews}
            searchedValue={state.searchedValue}
            dispatch={dispatch}
          />
        );
      case PATH.createNews:
        isUpdate = false;
        return (
          <CreateOrUpdateNews
            isUpdate={isUpdate}
            dispatch={dispatch}
            coverImage={state.coverImage}
            coverImageName={state.coverImageName}
          />
        );
      case PATH.updateNews:
        isUpdate = true;
        return (
          <CreateOrUpdateNews
            isUpdate={isUpdate}
            dispatch={dispatch}
            coverImage={state.coverImage}
            coverImageName={state.coverImageName}
          />
        );
      case PATH.viewNews:
        return <ViewNews />;
      default:
        return <NewsTable data={state.news} dispatch={dispatch} />;
    }
  };

  return (
    <div>
      <Title level={2} className="font-weight-bolder">
        {pageTitle}
      </Title>
      <div>
        <Suspense fallback={FallbackSpinner()}>{renderContent()}</Suspense>
      </div>
    </div>
  );
}

export default withRouter(ManageNews);
