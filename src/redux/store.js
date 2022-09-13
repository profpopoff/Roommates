import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import userReducer from './slices/user'
import filtersReducer from './slices/filters'
import modalReducer from './slices/modal'

const makeStore = () => configureStore({
    reducer: {
        user: userReducer,
        filters: filtersReducer,
        modal: modalReducer
    },
    devTools: true
})

export const wrapper = createWrapper(makeStore)