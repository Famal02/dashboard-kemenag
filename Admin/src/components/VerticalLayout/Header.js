import PropTypes from 'prop-types';
import React, { useState } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

//Import Icons
import FeatherIcon from "feather-icons-react";

// Reactstrap
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col, Container } from "reactstrap";

// Import menuDropdown
// import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown";
// import NotificationDropdown from "../CommonForBoth/TopbarDropdown/NotificationDropdown";
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu";
import LightDark from "../CommonForBoth/Menus/LightDark";

// import images
import logoSvg from "../../assets/images/logo-kemenag.png";
// import github from "../../assets/images/brands/github.png";
// import bitbucket from "../../assets/images/brands/bitbucket.png";
// import dribbble from "../../assets/images/brands/dribbble.png";
// import dropbox from "../../assets/images/brands/dropbox.png";
// import mail_chimp from "../../assets/images/brands/mail_chimp.png";
// import slack from "../../assets/images/brands/slack.png";

//i18n
import { withTranslation } from "react-i18next";
//redux
import { useSelector, useDispatch } from "react-redux";

// Redux Store
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
  // Inside your component
  const { showRightSidebar } = useSelector(headerData);

  const { onChangeLayoutMode } = props;
  const [search, setsearch] = useState(false);
  const [socialDrp, setsocialDrp] = useState(false);
  const [isClick, setClick] = useState(true);
  const [menuRumahIbadah, setMenuRumahIbadah] = useState(false);
  const [menuZis, setMenuZis] = useState(false);

  /*** Sidebar menu icon and default menu set */
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
            background-color: #e6f9ed !important; /* Hijau muda lembut */
            color: #34c38f !important; /* Teks Hijau saat hover */
            border-radius: 8px !important;
            transition: all 0.3s ease;
          }
          /* Pastikan icon di dalam juga berubah warna */
          .header-menu-hover:hover i {
             color: #34c38f !important;
          }
          /* Class untuk Menu yang Sedang Aktif (Dibuka) */
          .menu-active-green {
            background-color: #e6f9ed !important;
            color: #34c38f !important;
            border-radius: 8px !important;
          }
          .menu-active-green i {
            color: #34c38f !important;
          }

          /* Style untuk Submenu Dropdown item */
          .dropdown-item:hover, .dropdown-item:active, .dropdown-item:focus {
            background-color: #e6f9ed !important;
            color: #34c38f !important; /* Teks Hijau */
            border-radius: 6px; /* Agar item list cantik tidak kotak kaku */
          }
        `}</style>
        {/* WRAPPER UTAMA: Container membatasi lebar konten (±1200px) agar berada di tengah */}
        <div className="custom-container"> {/* <--- INI YANG BARU */}
          <div className="navbar-header px-0 position-relative d-flex justify-content-between align-items-center"
            style={{ boxShadow: '0 4px 12px rgba(113, 216, 88, 0.05)' }}>

            {/* === 1. BAGIAN KIRI: LOGO (Tanpa Kotak Background) === */}
            <div className="d-flex align-items-center">
              <div className="navbar-brand-box">
                <Link to="/dashboard" className="logo logo-dark">
                  <span className="logo-sm">
                    <img src={logoSvg} alt="" height="10" />
                  </span>
                  <span className="logo-lg d-flex align-items-center">
                    {/* mixBlendMode: multiply membuat background putih pada logo JPG/PNG menjadi transparan */}
                    <img src={logoSvg} alt="" height="45" style={{ mixBlendMode: 'multiply' }} />
                    <span className="logo-txt text-dark font-size-18 fw-bold ms-2 text-uppercase">Kemenag RI</span>
                  </span>
                </Link>

                <Link to="/dashboard" className="logo logo-light">
                  <span className="logo-sm">
                    <img src={logoSvg} alt="" height="10" />
                  </span>
                  <span className="logo-lg d-flex align-items-center">
                    <img src={logoSvg} alt="" height="45" />
                    <span className="logo-txt text-light font-size-18 fw-bold ms-2 text-uppercase">Kemenag RI</span>
                  </span>
                </Link>
              </div>
            </div>

            {/* === 2. BAGIAN TENGAH: MENU NAVIGASI (Absolute Center) === */}
            {/* Posisi Absolute membuat elemen ini lepas dari aliran flexbox dan bisa ditaruh tepat di tengah layar */}
            <div className="d-none d-lg-flex align-items-center position-absolute start-50 translate-middle-x">

              <Dropdown className="d-inline-block" isOpen={menuZis} toggle={() => setMenuZis(!menuZis)}>
                <DropdownToggle
                  className={`btn header-menu-hover waves-effect d-inline-flex align-items-center justify-content-center px-3 py-2 ${menuZis ? 'menu-active-green' : ''}`}
                  tag="button"
                >
                  <span className="d-inline-block fw-bold font-size-15">ZIS</span>
                  <i className={`mdi mdi-chevron-down d-inline-block ms-1 transition-all ${menuZis ? 'rotate-180' : ''}`}></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end border-0 shadow-lg rounded-3 p-2 mt-2">
                  <Link to="/Informasi-ZIS" className="dropdown-item fw-medium font-size-14 py-2 rounded mb-1">Laporan Dana</Link>
                  <Link to="/Informasi-ZIS/Stakeholder" className="dropdown-item fw-medium font-size-14 py-2 rounded">Stakeholder</Link>
                </DropdownMenu>
              </Dropdown>

              <Link to="/Informasi-Wakaf" className="btn header-menu-hover waves-effect d-inline-flex align-items-center justify-content-center px-3 py-2 ms-1">
                <span className="fw-bold font-size-15">Wakaf</span>
              </Link>

              <Dropdown className="d-inline-block ms-1" isOpen={menuRumahIbadah} toggle={() => setMenuRumahIbadah(!menuRumahIbadah)}>
                <DropdownToggle
                  className={`btn header-menu-hover waves-effect d-inline-flex align-items-center justify-content-center px-3 py-2 ${menuRumahIbadah ? 'menu-active-green' : ''}`}
                  tag="button"
                >
                  <span className="d-inline-block fw-bold font-size-15">Rumah Ibadah</span>
                  <i className={`mdi mdi-chevron-down d-inline-block ms-1 transition-all ${menuRumahIbadah ? 'rotate-180' : ''}`}></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end border-0 shadow-lg rounded-3 p-2 mt-2" style={{ minWidth: '200px' }}>
                  <Link to="/Islam" className="dropdown-item fw-medium font-size-14 py-2 rounded">Islam</Link>
                  <Link to="/Kristen" className="dropdown-item fw-medium font-size-14 py-2 rounded">Kristen</Link>
                  <Link to="/Katolik" className="dropdown-item fw-medium font-size-14 py-2 rounded">Katolik</Link>
                  <Link to="/Hindu" className="dropdown-item fw-medium font-size-14 py-2 rounded">Hindu</Link>
                  <Link to="/Buddha" className="dropdown-item fw-medium font-size-14 py-2 rounded">Buddha</Link>
                  <Link to="/Khonghucu" className="dropdown-item fw-medium font-size-14 py-2 rounded">Khonghucu</Link>
                </DropdownMenu>
              </Dropdown>
            </div>

            {/* === 3. BAGIAN KANAN: PROFILE & TOOLS === */}
            <div className="d-flex align-items-center">
              {/* Search Mobile */}
              <div className="dropdown d-inline-block d-lg-none ms-2">
                <button onClick={() => setsearch(!search)} type="button" className="btn header-item noti-icon" id="page-header-search-dropdown">
                  <i className="mdi mdi-magnify" />
                </button>
                <div className={search ? "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0 show" : "dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"}>
                  <form className="p-3">
                    <div className="form-group m-0">
                      <div className="input-group">
                        <input type="text" className="form-control" placeholder="Search ..." />
                        <div className="input-group-append">
                          <button className="btn btn-primary" type="submit"><i className="mdi mdi-magnify" /></button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              <LightDark layoutMode={props['layoutMode']} onChangeLayoutMode={onChangeLayoutMode} />

              <div onClick={() => dispatch(showRightSidebarAction(!showRightSidebar))} className="dropdown d-inline-block">
                <button type="button" className="btn header-item noti-icon right-bar-toggle">
                  <FeatherIcon icon="settings" className="icon-lg" />
                </button>
              </div>


            </div>

          </div>
        </div> {/* <--- INI YANG BARU */}
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
