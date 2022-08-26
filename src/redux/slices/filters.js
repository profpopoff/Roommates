import { createSlice } from '@reduxjs/toolkit'

const filtersSlice = createSlice({
   name: "filters",
   initialState: {
      filters: {
         price: { min: 1, max: 100000 },
         type: ["bed", "room", "flat", "house", "townhouse"],
         floor: { min: 1, max: 50 },
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
            price: { min: 1, max: 100000 },
            type: ["bed", "room", "flat", "house", "townhouse"],
            floor: { min: 1, max: 50 },
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