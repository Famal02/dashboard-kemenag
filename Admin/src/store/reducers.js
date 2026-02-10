import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"
// Dashboard
import dashboard from "./Dashboard/reducer"

// Keep Login reducer if needed for state.Login checks (optional, but safer to keep empty or default)
// import Login from "./auth/login/reducer" 
// Since we removed the Saga, the Login reducer won't receive success actions, but Layout might check it.
// However, since we removed ProfileMenu from Header, nothing should check auth state.

const rootReducer = combineReducers({
  Layout,
  dashboard
})

export default rootReducer
