import { combineReducers } from 'redux'
import { configureStore, EnhancedStore } from '@reduxjs/toolkit'
import userReducer, { userInitialState } from '@features/user/userSlice'
import { useMemo } from 'react'

let store: EnhancedStore<RootState> | null

const rootReducer = combineReducers({
  user: userReducer,
})
export type RootState = ReturnType<typeof rootReducer>

const initialState = {
  user: userInitialState,
}

const initStore = (preloadedState = initialState) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export const initializeStore = (preloadedState: RootState) => {
  let _store = store ?? initStore(preloadedState)

  // after navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    })
    store = null
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store
  // create the store once in the client
  if (!store) store = _store

  return _store
}

export const useStore = (initialReduxState: RootState = initialState) => {
  const store = useMemo(() => initializeStore(initialReduxState), [initialReduxState])
  return store
}
