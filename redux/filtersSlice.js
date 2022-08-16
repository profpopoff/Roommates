import { createSlice } from '@reduxjs/toolkit'

const filtersSlice = createSlice({
    name: "filters",
    initialState: {
        price: { min: 1, max: 1000000 },
        type: ["bed", "room", "flat", "house", "townhouse"],
        floor: { min: 1, max: 100 },
        rooms: null,
        area: null,
        conviniences: null
    },
    reducers: {
        setFilers: (state, action) => {
            state.price = action.payload.price
            state.type = action.payload.type
            state.floor = action.payload.floor
            state.rooms = action.payload.rooms
            state.area = action.payload.area
            state.conviniences = action.payload.conviniences
        },
        resetFilters: (state) => {
            state.price = { min: 1, max: 1000000 }
            state.type = [bed, room, flat, house, townhouse]
            state.floor = { min: 1, max: 100 }
            state.rooms = null
            state.area = null
            state.conviniences = null
        }
    }
})

export const { setFilers, resetFilters } = filtersSlice.actions

export default filtersSlice.reducer