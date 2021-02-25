import React, { Suspense, useContext, useEffect, useState } from "react";
import { Typography } from "antd";

//Components
import {
  LearnSkillsTable,
  ViewSkill,
  CreateOrUpdateSkill,
} from "../components/ManageLearnSkills";

//Common
import { FallbackSpinner } from "../components/common";
import { withRouter } from "react-router-dom";

import { ManageLearnSkillsContext } from "../context/ManageLearnSkillsContext";

const { Title } = Typography;

function ManageLearnSkills({ history, match }) {
  let { state, dispatch } = useContext(ManageLearnSkillsContext);

  const [pageTitle, setPageTitle] = useState("");

  const PATH = {
    manageLearnSkills: "/manage-learn-skills",
    createLearnSkills: "/manage-learn-skills/create",
    updateLearnSkills: `/manage-learn-skills/update/${match.params.skillId}`,
    viewLearnSkills: `/manage-learn-skills/view/${match.params.skillUrlSlug}`,
  };

  useEffect(() => {
    let pathname = history.location.pathname;
    switch (pathname) {
      case PATH.manageLearnSkills:
        setPageTitle("Manage Learn Skills");
        break;
      case PATH.createLearnSkills:
        setPageTitle("Create Skill");
        break;
      case PATH.updateLearnSkills:
        setPageTitle("Update Skill");
        break;
      default:
        setPageTitle("");
    }
  }, [history.location.pathname, PATH]);

  const renderContent = () => {
    let pathname = history.location.pathname;
    let isUpdate = false;

    switch (pathname) {
      case PATH.manageLearnSkills:
        return (
          <LearnSkillsTable
            data={state.skills}
            searchedSkills={state.searchedSkills}
            searchedValue={state.searchedValue}
            dispatch={dispatch}
          />
        );
      case PATH.createLearnSkills:
        isUpdate = false;
        return (
          <CreateOrUpdateSkill
            coverImage={state.coverImage}
            coverImageName={state.coverImageName}
            dispatch={dispatch}
            isUpdate={isUpdate}
          />
        );
      case PATH.updateLearnSkills:
        isUpdate = true;
        return (
          <CreateOrUpdateSkill
            coverImage={state.coverImage}
            coverImageName={state.coverImageName}
            dispatch={dispatch}
            isUpdate={isUpdate}
          />
        );
      case PATH.viewLearnSkills:
        return <ViewSkill />;

      default:
        return <LearnSkillsTable />;
    }
  };

  return (
    <div>
      <Title level={2} className="font-weight-bolder">
        {pageTitle}
      </Title>
      <div className="mb-3">
        <Suspense fallback={FallbackSpinner()}>{renderContent()}</Suspense>
      </div>
    </div>
  );
}

export default withRouter(ManageLearnSkills);
