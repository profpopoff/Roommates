import { createSlice } from '@reduxjs/toolkit'

const favouritesSlice = createSlice({
   name: "favourites",
   initialState: {
      posts: []
   },
   reducers: {
      addFavourite: (state, action) => {
         state.posts.push(action.payload)
      },
      deleteFavourite: (state, action) => {
         state.posts = action.payload
      }
   }
})

export const { addFavourite, deleteFavourite } = favouritesSlice.actions

export default favouritesSlice.reducer