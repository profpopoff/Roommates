import { createSlice } from '@reduxjs/toolkit'
import { HYDRATE } from 'next-redux-wrapper'

export const UserSlice = createSlice({
   name: 'user',
   initialState: {
      info: null
   },
   reducers: {
      setUser: (state, action) => {
         state.info = { ...state.info, ...action.payload }
      },
      exit: (state) => {
         state.info = null
      }
   },
   extraReducers: {
      [HYDRATE]: (state, action) => {
         if (!action.payload.user.info) {
            return state
        }
         state.info = { ...state.info, ...action.payload.user.info }
      }
   }
})

export const { setUser, exit } = UserSlice.actions

export default UserSlice.reducer