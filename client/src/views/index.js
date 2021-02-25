import React from "react";

import Dashboard from "./Dashboard";
import ManageNews from "./ManageNews";
import ManageCategories from "./ManageCategories";
import ManageLearnSkills from "./ManageLearnSkills";
import ManageAboutUs from "./ManageAboutUs";

const Login = React.lazy(() => import("./Login"));

export {
  Login,
  Dashboard,
  ManageNews,
  ManageCategories,
  ManageLearnSkills,
  ManageAboutUs,
};
