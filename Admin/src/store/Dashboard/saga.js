import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Crypto Redux States
import {
    GET_DASHBOARD_KEMENAG_DATA
} from "./actiontype";
import {
    getDashboardKemenagDataSuccess,
    // getDashboardKemenagDataFail
} from "./actions";

//Include Both Helper File with needed methods
import {
    getDashboardKemenagData
} from "../../helpers/fakebackend_helper";


function* fetchDashboardKemenagData() {
    try {
        const response = yield call(getDashboardKemenagData);
        yield put(getDashboardKemenagDataSuccess(response));
    } catch (error) {
        // Fallback to Mock Data if API fails (since API is not ready yet)
        console.warn("API Call failed (expected if API not ready), using Mock Data");
        const mockData = {
            summary: {
                zis: 1250000000,
                wakaf: 4500,
                rumahIbadah: 12500
            },
            trends: [10, 20, 15, 25, 30, 40, 35],
            chartData: [44, 55, 41, 17, 15]
        };
        yield put(getDashboardKemenagDataSuccess(mockData));
        // yield put(getDashboardKemenagDataFail(error)); // Uncomment this when API is real
    }
}

export function* watchGetChartsData() {
    yield takeEvery(GET_DASHBOARD_KEMENAG_DATA, fetchDashboardKemenagData);
}

function* dashboardSaga() {
    yield all([fork(watchGetChartsData)]);
}

export default dashboardSaga;
