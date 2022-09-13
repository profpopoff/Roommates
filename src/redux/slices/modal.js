import { createSlice } from '@reduxjs/toolkit'

const modalSlice = createSlice({
   name: "modal",
   initialState: {
      modals: {
         loginActive: false,
         regiserActive: false,
         settingsActive: false
      }
   },
   reducers: {
      setModal: (state, action) => {
         state.modals = { ...state.modals, ...action.payload }
      }
   }
})

export const { setModal } = modalSlice.actions

export default modalSlice.reducer