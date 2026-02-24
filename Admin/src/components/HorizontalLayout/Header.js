import PropTypes from 'prop-types';
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// Import Icons
// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

// Import Components


// Import Images
import logoSvg from "../../assets/images/logo-kemenag.png";

// i18n
import { withTranslation } from "react-i18next";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
  changelayoutMode
} from "../../store/actions";
import { createSelector } from 'reselect';

const Header = props => {
  const dispatch = useDispatch();

  const headerData = createSelector(
    (state) => state.Layout,
    (layout) => ({
      showRightSidebar: layout.showRightSide
    })
  );

  const { showRightSidebar } = useSelector(headerData);
  const { onChangeLayoutMode } = props;

  const [isClick, setClick] = useState(true);
  /*** Fungsi Toggle Sidebar (Garis Tiga) */
  function tToggle() {
    var body = document.body;
    setClick(!isClick);
    if (isClick === true) {
      body.classList.remove("sidebar-enable");
      document.body.setAttribute("data-sidebar-size", "sm");
    } else {
      body.classList.add("sidebar-enable");
      document.body.setAttribute("data-sidebar-size", "lg");
    }
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">

          {/* --- LEFT SIDE: LOGO & NAVIGATION --- */}
          <div className="d-flex align-items-center gap-3">
            {/* 1. TOGGLE BUTTON (Mobile Only or Minimalist) */}
            <button
              onClick={() => {
                tToggle();
              }}
              type="button"
              className="btn btn-sm px-3 font-size-16 header-item waves-effect d-lg-none"
              id="custom-menu-btn-header"
            >
              <i className="fa fa-fw fa-bars"></i>
            </button>

            {/* 2. LOGO */}
            <div className="navbar-brand-box d-none d-lg-block">
              <Link to="/dashboard" className="logo logo-dark">
                <span className="logo-sm">
                  <img src={logoSvg} alt="" height="25" />
                </span>
                <span className="logo-lg">
                  <img src={logoSvg} alt="" height="35" className="me-2" />
                  <span className="logo-txt text-dark font-size-18 fw-bold">Kemenag</span>
                </span>
              </Link>
            </div>

            {/* 3. NAVIGATION MENUS (Center-Left) */}
            <div className="d-none d-lg-flex align-items-center ms-4">
              {/* Menu ZIS */}
              <Link
                to="/ZIS"
                className="text-dark fw-medium font-size-15 px-3 py-2 text-decoration-none"
                style={{ transition: '0.3s' }}
              >
                ZIS
              </Link>

              {/* Menu Wakaf */}
              <Link
                to="/Wakaf"
                className="text-dark fw-medium font-size-15 px-3 py-2 text-decoration-none"
                style={{ transition: '0.3s' }}
              >
                Wakaf
              </Link>
            </div>
          </div>


          {/* --- RIGHT SIDE: ACTIONS & PROFILE --- */}
          <div className="d-flex align-items-center gap-2">

            {/* Light/Dark Toggle */}


          </div>
        </div>
      </header>
    </React.Fragment>
  );
};

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
  changelayoutMode: PropTypes.func,
  layoutMode: PropTypes.any,
};

const mapStatetoProps = state => {
  const {
    layoutType,
    showRightSidebar,
    leftMenu,
    layoutMode
  } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu, layoutMode };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  changelayoutMode,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));