import PropTypes from 'prop-types';
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";


import logoSvg from "../../assets/images/logo-kemenag.png";

import { withTranslation } from "react-i18next";
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
        <style>{`
          .header-menu-hover:hover {
            background-color: rgba(213, 205, 148, 0.15) !important;
            color: #375673 !important;
            border-radius: 8px !important;
            transition: all 0.3s ease;
          }
          .header-menu-hover:hover i {
             color: #375673 !important;
          }

          /* Logo visibility */
          @media (min-width: 992px) {
            .navbar-brand-box .logo-sm { display: none !important; }
            .navbar-brand-box .logo-lg { display: flex !important; align-items: center; }
          }
          @media (max-width: 991.98px), body[data-sidebar-size="sm"] .navbar-brand-box {
            .navbar-brand-box .logo-sm { display: inline-block !important; }
            .navbar-brand-box .logo-lg { display: none !important; }
          }

          /* Full width layout (no sidebar) on desktop */
          @media (min-width: 992px) {
            .vertical-menu { display: none !important; }
            .main-content { margin-left: 0 !important; }
            .footer { left: 0 !important; }
          }

          /* Container global */
          .custom-container {
              width: 100%;
              max-width: 2000px;
              margin: 0 auto;
              padding-left: 200px;
              padding-right: 200px;
          }
          @media (max-width: 1600px) {
              .custom-container { padding-left: 100px; padding-right: 100px; }
          }
          @media (max-width: 1200px) {
              .custom-container { padding-left: 50px; padding-right: 50px; }
          }
          @media (max-width: 768px) {
              .custom-container { padding-left: 20px; padding-right: 20px; }
          }
        `}</style>

        <div className="custom-container">
          <div className="navbar-header px-0 position-relative d-flex justify-content-between align-items-center"
            style={{ boxShadow: '0 4px 12px rgba(113, 216, 88, 0.05)' }}>

            {/* KIRI: LOGO */}
            <div className="d-flex align-items-center">
              <button
                type="button"
                className="btn btn-sm px-3 font-size-16 header-item waves-effect vertical-menu-btn d-lg-none me-2"
                onClick={() => { tToggle(); }}
              >
                <i className="fa fa-fw fa-bars"></i>
              </button>
              <div className="navbar-brand-box">
                <Link to="/dashboard" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSvg} alt="" height="10" />
                  </span>
                  <span className="logo-lg d-flex align-items-center">
                    <img src={logoSvg} alt="" height="45" style={{ mixBlendMode: 'multiply' }} />
                    <span className="logo-txt text-dark font-size-18 fw-bold ms-2 text-uppercase text-nowrap">Kemenag RI</span>
                  </span>
                </Link>
                <Link to="/dashboard" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSvg} alt="" height="10" />
                  </span>
                  <span className="logo-lg d-flex align-items-center">
                    <img src={logoSvg} alt="" height="45" />
                    <span className="logo-txt text-light font-size-18 fw-bold ms-2 text-uppercase text-nowrap">Kemenag RI</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* TENGAH: MENU NAVIGASI */}
            <div className="d-none d-lg-flex align-items-center position-absolute start-50 translate-middle-x gap-3">
              <Link to="/ZIS" className="btn header-menu-hover waves-effect d-inline-flex align-items-center justify-content-center px-3 py-2">
                <span className="fw-bold font-size-15">ZIS</span>
              </Link>
              <Link to="/Wakaf" className="btn header-menu-hover waves-effect d-inline-flex align-items-center justify-content-center px-3 py-2">
                <span className="fw-bold font-size-15">Wakaf</span>
              </Link>
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
  const { layoutType, showRightSidebar, leftMenu, layoutMode } = state.Layout;
  return { layoutType, showRightSidebar, leftMenu, layoutMode };
};

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  changelayoutMode,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header));
