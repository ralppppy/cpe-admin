import React from "react";

const CategoriesTable = React.lazy(() => import("./CategoriesTable"));
const CreateCategories = React.lazy(() => import("./CreateCategories"));

export { CategoriesTable, CreateCategories };
