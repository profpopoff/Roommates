import { createSlice } from '@reduxjs/toolkit'

const filtersSlice = createSlice({
   name: "filters",
   initialState: {
      filters: {
         price: [1, 100000],
         type: ["bed", "room", "flat", "house", "townhouse"],
         floor: [1, 50],
         rooms: null,
         area: null,
         conviniences: null,
         sortBy: ['createdAt'],
         withRoommates: true
      }
   },
   reducers: {
      setFilters: (state, action) => {
         state.filters = { ...state.filters, ...action.payload }
      },
      resetFilters: (state) => {
         state.filters = {
            price: [1, 100000],
            type: ["bed", "room", "flat", "house", "townhouse"],
            floor: [1, 50],
            rooms: null,
            area: null,
            conviniences: null,
            sortBy: ['createdAt'],
            withRoommates: true
         }
      }
   }
})

export const { setFilters, resetFilters } = filtersSlice.actions

export default filtersSlice.reducer