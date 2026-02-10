// Minimal replacement for fakebackend_helper.js to avoid breaking imports
// Since login is disabled, we simulate a logged-in user or no-op logic.

import { del, get, post, put } from "./api_helper"
import * as url from "./url_helper"

// --- Auth Utilities ---

// Simulate logged in user
const getLoggedInUser = () => {
  return { username: "Public User", email: "public@kemenag.go.id", role: "admin" };
}

// Always authenticated
const isUserAuthenticated = () => {
  return true;
}

// Dummy Auth Functions (No-op)
const postFakeRegister = data => Promise.resolve(data);
const postFakeLogin = data => Promise.resolve(data);
const postFakeProfile = data => Promise.resolve(data);
const postFakeForgetPwd = data => Promise.resolve(data);
const postJwtRegister = (url, data) => Promise.resolve(data);
const postJwtLogin = data => Promise.resolve(data);
const postJwtForgetPwd = data => Promise.resolve(data);
const postJwtProfile = data => Promise.resolve(data);

// Only keep Real API calls that use valid URLs
export const getDashboardData = () => get(url.GET_DASHBOARD_DATA);
export const getWakafTanahData = () => get(url.GET_WAKAF_TANAH_DATA);
export const getPenyaluranZmData = () => get(url.GET_PENYALURAN_ZM_DATA);
export const getPenerimaanProvinsi = () => get(url.GET_PENERIMAAN_PROVINSI);
export const getPenyaluranProvinsi = () => get(url.GET_PENYALURAN_PROVINSI);
export const getDashboardKemenagData = () => get(url.GET_DASHBOARD_KEMENAG_DATA);


export {
  getLoggedInUser,
  isUserAuthenticated,
  postFakeRegister,
  postFakeLogin,
  postFakeProfile,
  postFakeForgetPwd,
  postJwtRegister,
  postJwtLogin,
  postJwtForgetPwd,
  postJwtProfile,
}
