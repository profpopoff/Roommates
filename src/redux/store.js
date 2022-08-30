import { configureStore } from '@reduxjs/toolkit'
import { createWrapper } from 'next-redux-wrapper'

import userReducer from './slices/user'
import filtersReducer from './slices/filters'
import favouritesReducer from './slices/favourites'

const makeStore = () => configureStore({
    reducer: {
        user: userReducer,
        filters: filtersReducer,
        favourites: favouritesReducer
    },
    devTools: true
})

export const wrapper = createWrapper(makeStore)