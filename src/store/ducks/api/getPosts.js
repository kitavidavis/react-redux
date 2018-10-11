import { handleActions } from 'redux-actions'
import { createAsyncAction } from 'redux-promise-middleware-actions'
import mockApiClient from 'services/mockApiClient'

// Action types
const GET_POSTS = `api/GET_POSTS`

// Reducer namespace
export const namespace = GET_POSTS

// Actions
const getPosts = createAsyncAction(GET_POSTS, async () => {
  return mockApiClient.getPosts()
});

export const actions = {
  getPosts
}


let initialState = {
  pending: false,
  fulfilled: false,
  rejected: false,
  data: null,
  error: null,
}

// Reducer
export const reducer = handleActions(
  {
    [String(getPosts.pending)]: (state, action) => {
      return {
        ...state,
        pending: true,
        fulfilled: false,
        rejected: false,
      }
    },
    [String(getPosts.fulfilled)]: (state, action) => {
      return {
        ...state,
        data: action.payload,
        error: null,
        pending: false,
        fulfilled: true,
      }
    },
    [String(getPosts.rejected)]: (state, action) => {
      return {
        ...state,
        error: action.payload,
        pending: false,
        rejected: true,
      }
    },
  },
  initialState
)

// Selectors
let selectorPrefix = 'getPosts'
export const selectors = {
  [`${selectorPrefix}Data`]: (state) => (state[namespace].data),
  [`${selectorPrefix}Pending`]: (state) => (state[namespace].pending),
  [`${selectorPrefix}Fulfilled`]: (state) => (state[namespace].fulfilled),
  [`${selectorPrefix}Rejected`]: (state)  => (state[namespace].rejected),
}
