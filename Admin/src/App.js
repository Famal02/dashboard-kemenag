import PropTypes from 'prop-types'
import React, { Suspense } from "react";

import { Routes, Route } from "react-router-dom";
import { connect } from "react-redux";

// Import Routes all
import { userRoutes } from "./routes/allRoutes";

// layouts Format
import VerticalLayout from "./components/VerticalLayout/";
import HorizontalLayout from "./components/HorizontalLayout/";

// Import scss
import "./assets/scss/theme.scss";
import "./assets/scss/preloader.scss";
import "./assets/scss/kemenag-theme.css";
import "./assets/scss/responsive-patch.css";
import "./assets/scss/kemenag-hover.css";
import "./assets/scss/skeleton.scss";

const App = props => {

  const Layout = props.layout.layoutType === "horizontal" ? HorizontalLayout : VerticalLayout;

  return (
    <React.Fragment>
      <Suspense fallback={null}>
        <Routes>
          {userRoutes.map((route, idx) => (
            <Route
              path={route.path}
              element={
                <Layout>{route.component}</Layout>
              }
              key={idx}
              exact={true}
            />
          ))}
        </Routes>
      </Suspense>
    </React.Fragment >
  )
}

App.propTypes = {
  layout: PropTypes.any
}

const mapStateToProps = state => {
  return {
    layout: state.Layout,
  }
}

export default connect(mapStateToProps, null)(App)