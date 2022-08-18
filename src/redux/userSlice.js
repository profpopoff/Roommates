import { createSlice } from '@reduxjs/toolkit'

export const userSlice = createSlice({
    name: "user",
    initialState: {
        info: null
    },
    reducers: {
        set: (state, action) => {
            state.info = {...state.info, ...action.payload}
        },
        exit: (state) => {
            state.info = null
        }
    }
})


export const { set, exit } = userSlice.actions

export default userSlice.reducer