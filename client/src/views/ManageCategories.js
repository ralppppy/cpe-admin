import React, { Suspense, useEffect, useState } from "react";
import { Typography } from "antd";
//Helper Imports

//Components
import {
  CategoriesTable,
  CreateCategories,
} from "../components/ManageCategories";

//Common
import { FallbackSpinner } from "../components/common";
import { withRouter } from "react-router-dom";

const { Title } = Typography;

function ManageCategories({ history }) {
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    let pathname = history.location.pathname;
    switch (pathname) {
      case "/manage-categories":
        setPageTitle("Manage News Categories");
        break;
      case "/manage-categories/create":
        setPageTitle("Create category");
        break;
      default:
        setPageTitle("");
    }
  }, [history.location.pathname]);

  const renderContent = () => {
    let pathname = history.location.pathname;

    switch (pathname) {
      case "/manage-categories":
        return <CategoriesTable />;
      case "/manage-categories/create":
        return <CreateCategories />;
      default:
        return <CategoriesTable />;
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

export default withRouter(ManageCategories);
