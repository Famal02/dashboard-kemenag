import PropTypes from 'prop-types';
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

// Import Icons
// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";

// Import Components
import LightDark from "../CommonForBoth/Menus/LightDark";

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

  // --- STATE MANAGEMENT ---
  const [search, setsearch] = useState(false);
  const [isClick, setClick] = useState(true);

  // State untuk Dropdown Rumah Ibadah
  const [menuRumahIbadah, setMenuRumahIbadah] = useState(false);

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

              {/* Menu Rumah Ibadah (Dropdown) */}
              <Dropdown
                isOpen={menuRumahIbadah}
                toggle={() => setMenuRumahIbadah(!menuRumahIbadah)}
                className="d-inline-block"
              >
                <DropdownToggle
                  className="text-dark fw-medium font-size-15 px-3 py-2 text-decoration-none bg-transparent border-0"
                  tag="button"
                >
                  Rumah Ibadah
                  <i className="mdi mdi-chevron-down ms-1"></i>
                </DropdownToggle>

                <DropdownMenu>
                  <Link to="/Islam" className="dropdown-item">Islam</Link>
                  <Link to="/Kristen" className="dropdown-item">Kristen</Link>
                  <Link to="/Katolik" className="dropdown-item">Katolik</Link>
                  <Link to="/Hindu" className="dropdown-item">Hindu</Link>
                  <Link to="/Buddha" className="dropdown-item">Buddha</Link>
                  <Link to="/Khonghucu" className="dropdown-item">Khonghucu</Link>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>


          {/* --- RIGHT SIDE: ACTIONS & PROFILE --- */}
          <div className="d-flex align-items-center gap-2">

            {/* Light/Dark Toggle */}
            <div className="ms-2">
              <LightDark layoutMode={props['layoutMode']} onChangeLayoutMode={onChangeLayoutMode} />
            </div>

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