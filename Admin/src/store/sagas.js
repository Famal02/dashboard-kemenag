import { all, fork } from "redux-saga/effects"

// Layout
import LayoutSaga from "./layout/saga"

// Dashboard (Only if it exists and uses the new API)
import dashBoardSaga from "./Dashboard/saga"

export default function* rootSaga() {
  yield all([
    fork(LayoutSaga),
    fork(dashBoardSaga),
  ])
}
