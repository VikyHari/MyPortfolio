import { combineReducers } from "redux";
import ColorRedcer from './Color_Reducer';
const RootReducer = combineReducers({
    login: "reducer",
    colors: ColorRedcer
});


export default RootReducer;