import { createStore, applyMiddleware, combineReducers } from 'redux'
import { createLogger } from 'redux-logger'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise-middleware'
import { reducers as queryReducers } from './queries'
import { reducers as apiReducers } from './api'
import { reducer as dbReducer } from './db'
import {
  reducers as otherReducers,
} from './other'
import {
  selectors as sessionSelectors,
  namespace as sessionNamespace
} from './other/session'
import { loadState, saveState } from './localStorage'
import throttle from 'lodash/throttle'

const middleware = [ thunk, promiseMiddleware() ];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const rootReducer = combineReducers({
  ...apiReducers,
  ...queryReducers,
  ...otherReducers,
  entities: dbReducer
})

const initStore = () => {
  const persistedState = loadState()

  let store = createStore(
    rootReducer,
    persistedState,
    applyMiddleware(...middleware)
  )

  store.subscribe(throttle(() => {
    let state = store.getState()
    saveState({
      [sessionNamespace]: sessionSelectors.getSession(state),
    })
  }, 1000))

  return store
}

export default initStore
