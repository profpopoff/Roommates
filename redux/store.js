import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import filtersReducer from './filtersSlice'

export default configureStore({
    reducer: {
        user: userReducer,
        filters: filtersReducer
    }
})