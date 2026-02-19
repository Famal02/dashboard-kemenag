
import React from "react";
import { Navigate } from "react-router-dom";

//Dashboard
//Dashboard
const Dashboard = React.lazy(() => import("../pages/Dashboard/index"));

// ZIS Page
// ZIS Page
const ZisPage = React.lazy(() => import("../pages/ZIS/index"));
const LaporanDana = React.lazy(() => import("../pages/ZIS/LaporanDana"));
const Stakeholder = React.lazy(() => import("../pages/ZIS/Stakeholder"));

// Import Wakaf Page
const WakafPage = React.lazy(() => import("../pages/Wakaf/index"));

// Import AppTestKey
const AppTestKey = React.lazy(() => import("../AppTestKey"));

// Import Pages Rumah Ibadah (RESTORED)
import IslamPage from "../pages/RumahIbadah/Islam";
import KristenPage from "../pages/RumahIbadah/Kristen";
import KatolikPage from "../pages/RumahIbadah/Katolik";
import HinduPage from "../pages/RumahIbadah/Hindu";
import BuddhaPage from "../pages/RumahIbadah/Buddha";
import KhonghucuPage from "../pages/RumahIbadah/Khonghucu";

//Utility
import PagesStarter from "../pages/Utility/StarterPage";
import PageMaintenance from "../pages/Utility/PageMaintenance";
import PagesComingsoon from "../pages/Utility/PageComingsoon";
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

const userRoutes = [
  //dashboard
  { path: "/dashboard", component: <Dashboard /> },

  //Zispage
  { path: "/ZIS", component: <ZisPage /> },
  { path: "/ZIS/LaporanDana", component: <LaporanDana /> },
  { path: "/ZIS/Stakeholder", component: <Stakeholder /> },

  // API Key Generator
  { path: "/generate-api-key", component: <AppTestKey /> },

  // Wakaf Page
  { path: "/Wakaf", component: <WakafPage /> },

  // Route Rumah Ibadah (DISABLED TEMPORARILY)
  // { path: "/Islam", component: <IslamPage /> },
  // { path: "/Kristen", component: <KristenPage /> },
  // { path: "/Katolik", component: <KatolikPage /> },
  // { path: "/Hindu", component: <HinduPage /> },
  // { path: "/Buddha", component: <BuddhaPage /> },
  // { path: "/Khonghucu", component: <KhonghucuPage /> },

  //Utility
  { path: "/pages-starter", component: <PagesStarter /> },
  { path: "/pages-maintenance", component: <PageMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },

  // Old Routes Redirects
  { path: "/Informasi-ZIS", component: <Navigate to="/ZIS" /> },
  { path: "/Informasi-ZIS/LaporanDana", component: <Navigate to="/ZIS/LaporanDana" /> },
  { path: "/Informasi-ZIS/Stakeholder", component: <Navigate to="/ZIS/Stakeholder" /> },
  { path: "/Informasi-Wakaf", component: <Navigate to="/Wakaf" /> },

  // this route should be at the end of all other routes
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const authRoutes = [];

export { userRoutes, authRoutes };
