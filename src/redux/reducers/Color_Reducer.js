import { createSlice } from "@reduxjs/toolkit";


const Color_Reducer = createSlice({
    name: "Color",
    initialState: {
        loading: false,
        // ColorName: localStorage.getItem("color") ? JSON.parse(localStorage.getItem("color")) : "",
        ColorName: ""
    },
    reducers: {
        ColorRequest(state, action) {
            return {
                loading: true
            }
        },
        ColorSuccess(state, action) {
            return {
                loading: false,
                ColorName: action.payload,

            }
        },
        ColorFail(state, action) {
            return {
                loading: false,
                error: action.payload
            }
        }
    }
})

const { actions, reducer } = Color_Reducer;
export const { ColorRequest, ColorSuccess, ColorFail } = actions;
export default reducer;