import {
    GET_DASHBOARD_KEMENAG_DATA,
    GET_DASHBOARD_KEMENAG_DATA_SUCCESS,
    GET_DASHBOARD_KEMENAG_DATA_FAIL,
} from "./actiontype";

export const getDashboardKemenagData = (data) => ({
    type: GET_DASHBOARD_KEMENAG_DATA,
    payload: data,
});

export const getDashboardKemenagDataSuccess = (data) => ({
    type: GET_DASHBOARD_KEMENAG_DATA_SUCCESS,
    payload: data,
});

export const getDashboardKemenagDataFail = (error) => ({
    type: GET_DASHBOARD_KEMENAG_DATA_FAIL,
    payload: error,
});