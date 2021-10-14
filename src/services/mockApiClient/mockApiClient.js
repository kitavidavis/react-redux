import { timeout } from 'utils/other'
import users from './users.json'
import allPosts from './posts.json'
let posts = allPosts.slice(0, 10)

const TIMEOUT_MS = 100
const token = '12345'
const loggedInUser = users[0]

class MockApiClient {

  constructor (token) {
    this.headers = {}
    if (token) {
      this.setToken(token)
    }
  }

  setToken (token) {
    this.token = token
    this.headers['Authorization'] = `Bearer ${token.token}`
  }

  async logIn (email, password) {
    await timeout(TIMEOUT_MS * 5)
    this.setToken(token)
    return {
      token,
      user: loggedInUser
    }
  }

  async getPosts ({page = 0, perPage = 6} = {}) {
    await timeout(TIMEOUT_MS)
    return {
      page,
      perPage,
      numPages: Math.ceil(posts.length / perPage),
      posts: posts.slice(page * perPage, page * perPage + perPage)
    }
  }

  async getMyFavoritePosts() {
    await timeout(TIMEOUT_MS)
    return posts.filter(post => post.likes.includes(loggedInUser.id))
  }

  async likePost (id) {
    await timeout(TIMEOUT_MS)
    let post = posts.find((p) => p.id === id)
    if (post) {
      // Normally user would be inferred from auth token
      post.likes = [loggedInUser.id]
    }
    return post
  }

  async unlikePost (id) {
    await timeout(TIMEOUT_MS)
    let post = posts.find((p) => p.id === id)
    if (post) {
      post.likes = []
    }
    return post
  }

  async logOut () {
    await timeout(TIMEOUT_MS)
    delete this.token
    delete this.headers.Authorization
  }

}

// Export Singleton
const mockApiClient = new MockApiClient(window.localStorage.getItem('token'))

export default mockApiClient
