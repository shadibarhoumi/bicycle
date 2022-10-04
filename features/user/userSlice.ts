import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  user: {
    uid: string
    displayName: string | null
    photoURL: string | null
  } | null
  username: string | null
}

export const userInitialState: UserState = {
  user: null,
  username: null,
}

const userSlice = createSlice({
  name: 'userData',
  initialState: userInitialState,
  reducers: {
    setUser(state, action: PayloadAction<UserState['user']>) {
      state.user = action.payload
    },
    setUsername(state, action: PayloadAction<UserState['username']>) {
      state.username = action.payload
    },
  },
})

export const { setUser, setUsername } = userSlice.actions

export default userSlice.reducer
