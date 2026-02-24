import { call, put, takeEvery, all, fork } from "redux-saga/effects";

// Cleaned up unused Sagas

export function* watchGetChartsData() {
    // No-op for now since Dashboard data is fetched directly at component level via axios
}

function* dashboardSaga() {
    yield all([fork(watchGetChartsData)]);
}

export default dashboardSaga;
