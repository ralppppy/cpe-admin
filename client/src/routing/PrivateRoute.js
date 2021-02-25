import React, { Suspense } from "react";
import { Redirect, Route } from "react-router-dom";

function PrivateRoute({
  component: Component,
  authState,
  layout: Layout,
  type,
  provider: Provider = null,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (type === "login") {
          if (authState.authenticated) {
            return (
              <Redirect
                to={{ pathname: "/", state: { from: props.location } }}
              />
            );
          } else {
            return (
              <Suspense
                fallback={
                  <div className="d-flex align-items-center justify-content-center w-100 h-100">
                    Loading...
                  </div>
                }
              >
                <Component />
              </Suspense>
            );
          }
        } else {
          if (authState.authenticated) {
            if (Provider) {
              return (
                <Provider>
                  <Layout>
                    <Component />
                  </Layout>
                </Provider>
              );
            } else {
              return (
                <Layout>
                  <Component />
                </Layout>
              );
            }
          } else {
            return (
              <Redirect
                to={{ pathname: "/login", state: { from: props.location } }}
              />
            );
          }
        }
      }}
    />
  );
}

export default PrivateRoute;
