import { createSlice } from '@reduxjs/toolkit'

const filtersSlice = createSlice({
   name: "filters",
   initialState: {
      filters: {
         price: { min: 1, max: 1000000 },
         type: ["bed", "room", "flat", "house", "townhouse"],
         floor: { min: 1, max: 100 },
         rooms: null,
         area: null,
         conviniences: null
      }
   },
   reducers: {
      setFilers: (state, action) => {
         state.filters = { ...state.filters, ...action.payload }
      },
      resetFilters: (state) => {
         state.filters = {
            price: { min: 1, max: 1000000 },
            type: ["bed", "room", "flat", "house", "townhouse"],
            floor: { min: 1, max: 100 },
            rooms: null,
            area: null,
            conviniences: null
         }
      }
   }
})

export const { setFiler, resetFilters } = filtersSlice.actions

export default filtersSlice.reducer