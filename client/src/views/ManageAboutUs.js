import React, { Suspense, useState, useEffect } from "react";
import { Typography } from "antd";

//Common
import { FallbackSpinner } from "../components/common";
import { withRouter } from "react-router-dom";

//Components
import { AboutUs, CreateAboutUs } from "../components/ManageAboutUs";
import HTTPRequest from "../components/ManageAboutUs/helper/HTTPRequest";

const { Title } = Typography;

function ManageAboutUs({ history, match }) {
  const [pageTitle, setPageTitle] = useState("");
  const [aboutUsData, setAboutUsData] = useState(null);

  useEffect(() => {
    HTTPRequest.fetchAboutUs(setAboutUsData);
  }, [setAboutUsData]);

  const PATH = {
    manageAboutUs: "/manage-about-us",
    createAboutUs: "/manage-about-us/create",
    updateAboutUs: `/manage-about-us/update/${match.params.aboutUsId}`,
  };

  useEffect(() => {
    let pathname = history.location.pathname;
    switch (pathname) {
      case PATH.manageAboutUs:
        setPageTitle("Manage About Us");
        break;
      case PATH.createAboutUs:
        setPageTitle("Manage About Us");
        break;

      default:
        setPageTitle("");
    }
  }, [history.location.pathname, PATH]);

  const renderContent = () => {
    let pathname = history.location.pathname;

    switch (pathname) {
      case PATH.manageAboutUs:
        return <AboutUs aboutUsData={aboutUsData} />;
      case PATH.createAboutUs:
        return (
          <CreateAboutUs
            aboutUsData={aboutUsData}
            setAboutUsData={setAboutUsData}
          />
        );

      default:
        return <AboutUs aboutUsData={aboutUsData} />;
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

export default withRouter(ManageAboutUs);
