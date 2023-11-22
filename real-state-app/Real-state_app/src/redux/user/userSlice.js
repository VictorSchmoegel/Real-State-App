import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    singInStart: (state) => {
      state.loading = true;
    },
    singInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    singInFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateUserStart: (state) => {
      state.loading = true;
    },
    updateUserSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    userDeletedStart: (state) => {
      state.loading = true;
    },
    userDeletedSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    userDeletedFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    userSingOutStart: (state) => {
      state.loading = true;
    },
    userSingOutSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },
    userSingOutFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  }
});

export const { 
  singInStart,
  singInSuccess,
  singInFailure,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  userDeletedStart,
  userDeletedSuccess,
  userDeletedFailure,
  userSingOutStart,
  userSingOutSuccess,
  userSingOutFailure,
} = userSlice.actions;

export default userSlice.reducer;