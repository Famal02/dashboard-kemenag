import {
    GET_DASHBOARD_KEMENAG_DATA_SUCCESS,
    GET_DASHBOARD_KEMENAG_DATA_FAIL
} from "./actiontype"

const INIT_STATE = {
    dashboardKemenagData: {
        summary: { zis: 0, wakaf: 0 },
        trends: [],
        chartData: []
    },
    error: {}
}

const dashboard = (state = INIT_STATE, action) => {
    switch (action.type) {
        case GET_DASHBOARD_KEMENAG_DATA_SUCCESS:
            return { ...state, dashboardKemenagData: action.payload }
        case GET_DASHBOARD_KEMENAG_DATA_FAIL:
            return { ...state, error: action.payload }
        default:
            return state
    }
}

export default dashboard
