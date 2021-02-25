import React, { useContext } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

import "./App.css";
import "./App.less";
import AdminLayout from "./components/layout/AdminLayout";
import PrivateRoute from "./routing/PrivateRoute";

import {
  Login,
  Dashboard,
  ManageNews,
  ManageCategories,
  ManageLearnSkills,
  ManageAboutUs,
} from "./views";

import { AuthContext } from "./context/AuthContext";
import { ManageNewsProvider } from "./context/ManageNewsContext";
import { ManageLearnSkillsProvider } from "./context/ManageLearnSkillsContext";

function App() {
  const { authState } = useContext(AuthContext);

  if (typeof window.__REACT_DEVTOOLS_GLOBAL_HOOK__ === "object") {
    for (let [key, value] of Object.entries(
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__
    )) {
      window.__REACT_DEVTOOLS_GLOBAL_HOOK__[key] =
        typeof value == "function" ? () => {} : null;
    }
  }

  return (
    <div className="App">
      {authState.loading && (
        <Router>
          <Switch>
            <PrivateRoute
              exact
              path="/"
              type="admin"
              component={Dashboard}
              layout={AdminLayout}
              authState={authState}
            />

            {/* NEWS SECTION */}
            <PrivateRoute
              path="/manage-news/view/:newsUrlSlug"
              type="admin"
              component={ManageNews}
              layout={AdminLayout}
              provider={ManageNewsProvider}
              authState={authState}
            />
            <PrivateRoute
              path="/manage-news/update/:newsId"
              type="admin"
              component={ManageNews}
              layout={AdminLayout}
              provider={ManageNewsProvider}
              authState={authState}
            />

            <PrivateRoute
              path="/manage-news"
              type="admin"
              component={ManageNews}
              provider={ManageNewsProvider}
              layout={AdminLayout}
              authState={authState}
            />

            <PrivateRoute
              path="/manage-news/create"
              type="admin"
              component={ManageNews}
              layout={AdminLayout}
              authState={authState}
            />

            <PrivateRoute
              path="/manage-categories"
              type="admin"
              component={ManageCategories}
              layout={AdminLayout}
              authState={authState}
            />

            {/* END NEWS SECTION */}

            {/* LEARN SKILLS SECTION */}
            <PrivateRoute
              path="/manage-learn-skills/view/:skillUrlSlug"
              type="admin"
              component={ManageLearnSkills}
              layout={AdminLayout}
              provider={ManageLearnSkillsProvider}
              authState={authState}
            />
            <PrivateRoute
              path="/manage-learn-skills/update/:skillId"
              type="admin"
              component={ManageLearnSkills}
              layout={AdminLayout}
              provider={ManageLearnSkillsProvider}
              authState={authState}
            />
            <PrivateRoute
              path="/manage-learn-skills"
              type="admin"
              component={ManageLearnSkills}
              provider={ManageLearnSkillsProvider}
              layout={AdminLayout}
              authState={authState}
            />
            <PrivateRoute
              path="/manage-learn-skills/create"
              type="admin"
              component={ManageLearnSkills}
              layout={AdminLayout}
              authState={authState}
            />
            {/* END LEARN SKILLS SECTION */}

            <PrivateRoute
              path="/manage-about-us"
              type="admin"
              component={ManageAboutUs}
              layout={AdminLayout}
              authState={authState}
            />
            <PrivateRoute
              path="/manage-about-us/create"
              type="admin"
              component={ManageAboutUs}
              layout={AdminLayout}
              authState={authState}
            />

            <PrivateRoute
              type="login"
              path="/login"
              component={Login}
              authState={authState}
            />

            {/* <Route
            path="/login"
            component={() => {
              return (
                <Suspense
                  fallback={
                    <div className="d-flex align-items-center justify-content-center w-100 h-100">
                      Loading...
                    </div>
                  }
                >
                  <Login />
                </Suspense>
              );
            }}
          /> */}

            <Route component={() => <>NOT FOUND</>} />
          </Switch>
        </Router>
      )}
    </div>
  );
}

export default App;
