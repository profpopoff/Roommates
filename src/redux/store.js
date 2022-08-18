import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import userReducer from './slices/user'
import filtersReducer from './slices/filters'

const makeStore = () => configureStore({
    reducer: {
        user: userReducer,
        filters: filtersReducer
    },
    devTools: true
})

export const wrapper = createWrapper(makeStore)