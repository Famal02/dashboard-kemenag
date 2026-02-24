import React from "react";
import { Navigate } from "react-router-dom";

// Dashboard
const Dashboard = React.lazy(() => import("../pages/Dashboard/index"));

// ZIS Page
const ZisPage = React.lazy(() => import("../pages/ZIS/index"));

// Wakaf Page
const WakafPage = React.lazy(() => import("../pages/Wakaf/index"));

// API Key Generator
const AppTestKey = React.lazy(() => import("../AppTestKey"));

// Utility
import Error404 from "../pages/Utility/Error404";
import Error500 from "../pages/Utility/Error500";

const userRoutes = [
  // Dashboard
  { path: "/dashboard", component: <Dashboard /> },

  // ZIS Page
  { path: "/ZIS", component: <ZisPage /> },

  // Wakaf Page
  { path: "/Wakaf", component: <WakafPage /> },

  // API Key Generator
  { path: "/generate-api-key", component: <AppTestKey /> },

  // Utility
  { path: "/pages-404", component: <Error404 /> },
  { path: "/pages-500", component: <Error500 /> },

  // Old Routes Redirects
  { path: "/Informasi-ZIS", component: <Navigate to="/ZIS" /> },
  { path: "/Informasi-Wakaf", component: <Navigate to="/Wakaf" /> },

  // Catch-all (harus di paling bawah)
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const authRoutes = [];

export { userRoutes, authRoutes };
