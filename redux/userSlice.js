import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: {
            // token: null,
            // _id: null,
            // name: null,
            // email: null,
            // phoneNumber: null,
            // profilePicture: null
        },
        pending: null,
        error: false
    },
    reducers: {
        start: (state) => {
            state.pending = true;
        },
        success: (state, action) => {
            state.pending = false;
            state.userInfo = action.payload;
        },
        error: (state) => {
            state.pending = false;
            state.error = true;
        },
    }
})

export const { start, success, error } = userSlice.actions;

export default userSlice.reducer;