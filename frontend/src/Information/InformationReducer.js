import layout from './Layout/LayoutReducer'
import location from './Location/LocationReducer'
import {combineReducers} from "redux";


export default combineReducers({
	layout, location
})