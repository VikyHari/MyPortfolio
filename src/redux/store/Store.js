import { configureStore } from '@reduxjs/toolkit'
import RootReducer from '../reducers'
import thunk from 'redux-thunk'


export const Store = configureStore({
    reducer: RootReducer,
    middleware: [thunk]
})