import PropTypes from 'prop-types'
import React from "react";

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

const App = props => {

  function getLayout() {
    let layoutCls = VerticalLayout
    switch (props.layout.layoutType) {
      case "horizontal":
        layoutCls = HorizontalLayout
        break
      default:
        layoutCls = VerticalLayout
        break
    }
    return layoutCls
  }

  const Layout = getLayout()
  return (
    <React.Fragment>
      <Routes>
        {userRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <React.Fragment>
                <Layout>{route.component}</Layout>
              </React.Fragment>}
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
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