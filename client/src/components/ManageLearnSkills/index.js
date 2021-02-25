import React from "react";

const LearnSkillsTable = React.lazy(() => import("./LearnSkillsTable"));
const CreateOrUpdateSkill = React.lazy(() => import("./CreateOrUpdateSkill"));
const ViewSkill = React.lazy(() => import("./ViewSkill"));

export { LearnSkillsTable, CreateOrUpdateSkill, ViewSkill };
