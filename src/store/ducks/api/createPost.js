import { handleActions } from 'redux-actions'
import { createAsyncAction } from 'redux-promise-middleware-actions'
import mockApiClient from 'services/mockApiClient'

// Action types
const CREATE_POST = `api/CREATE_POST`

// Reducer namespace
export const namespace = CREATE_POST

// Actions
const createPost = createAsyncAction(CREATE_POST, async (post) => {
  return mockApiClient.createPost(post)
});

export const actions = {
  createPost
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
    [String(createPost.pending)]: (state, action) => {
      return {
        ...state,
        pending: true,
        fulfilled: false,
        rejected: false,
      }
    },
    [String(createPost.fulfilled)]: (state, action) => {
      return {
        ...state,
        data: action.payload,
        error: null,
        pending: false,
        fulfilled: true,
      }
    },
    [String(createPost.rejected)]: (state, action) => {
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
let selectorPrefix = 'createPost'
export const selectors = {
  [`${selectorPrefix}Data`]: (state) => (state[namespace].data),
  [`${selectorPrefix}Pending`]: (state) => (state[namespace].pending),
  [`${selectorPrefix}Fulfilled`]: (state) => (state[namespace].fulfilled),
  [`${selectorPrefix}Rejected`]: (state)  => (state[namespace].rejected),
}
