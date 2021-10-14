import { handleActions } from 'redux-actions'
import mockApiClient from 'services/mockApiClient'
import {
  schemas,
  actions as dbActions,
  selectors as dbSelectors
} from '../db'
import { normalize, denormalize } from 'normalizr'

// Action types
const ACTION_NAME = 'getPosts'

// Reducer namespace
export const namespace = `api/GET_POSTS`

const responseSchema = {
  posts: [schemas.PostSchema]
}

// Actions
const action = (options) => {
 return dispatch => {
    return dispatch({
      type: namespace,
      payload: mockApiClient.getPosts(options)
        .then(data => {
          let normalizedData = normalize(data, responseSchema)
          dispatch(
            dbActions.updateEntities(normalizedData.entities)
          )
          return normalizedData.result
        })
    })
  }
}

action.PENDING = `${namespace}_PENDING`
action.FULFILLED = `${namespace}_FULFILLED`
action.REJECTED = `${namespace}_REJECTED`

export const actions = {
  [ACTION_NAME]: action
}


// Reducer
let initialState = {
  pending: false,
  fulfilled: false,
  rejected: false,
  data: null,
  error: null,
}

export const reducer = handleActions(
  {
    [action.PENDING]: (state, action) => {
      return {
        ...state,
        pending: true,
        fulfilled: false,
        rejected: false,
      }
    },
    [action.FULFILLED]: (state, action) => {
      return {
        ...state,
        data: action.payload,
        error: null,
        pending: false,
        fulfilled: true,
      }
    },
    [action.REJECTED]: (state, action) => {
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
export const selectors = {
  [`${ACTION_NAME}Data`]: (state) => {
    return denormalize(state[namespace].data, responseSchema, dbSelectors.getEntities(state))
  },
  [`${ACTION_NAME}Pending`]: (state) => (state[namespace].pending),
  [`${ACTION_NAME}Fulfilled`]: (state) => (state[namespace].fulfilled),
  [`${ACTION_NAME}Rejected`]: (state)  => (state[namespace].rejected),
}
