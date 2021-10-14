import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  actions as apiActions,
  selectors as apiSelectors
} from 'store/api'
import {selectors as dbSelectors} from 'store/db'
import { selectors as querySelectors } from 'store/queries'
import { selectors as sessionSelectors } from 'store/other/session'
import { Grid } from '@material-ui/core'
import { Loading } from 'components/Universal'
import { FadeIn } from 'components/Universal/Transitions'
import { PostCard } from 'components/App/Shared'
import { BounceLoader } from 'react-spinners'

import styles from './FavoritePostsPage.module.css'

class FavoritePostsPage extends Component {

  componentDidMount() {
    this.props.getMyFavoritePosts()
  }

  render() {
    let pageLoading = this.props.getMyFavoritePostsPending || this.props.posts == null
    return (
      <Loading loading={pageLoading} minTime={1000}>
        {ready => {
          if (!ready) {
            return (
              <div className={styles.pageLoading}>
                <BounceLoader />
              </div>
            )
          }
          if (this.props.posts.length === 0) {
            return (
              <FadeIn>
                <div className={styles.noPostsToShow}>
                  <span>You have not favorited any posts.</span>
                </div>
              </FadeIn>
            )
          }
          return (
            <FadeIn>
              <Grid container className={styles.pageContainer}>
                  {this.props.posts.map((post) => (
                    <Grid
                      key={post.id}
                      className={styles.gridItem}
                      item
                      xs={12}
                      sm={6}
                      lg={4}
                    >
                      <PostCard post={post} liked={post.likes.includes(this.props.session.user.id)}/>
                    </Grid>
                  ))}
              </Grid>
            </FadeIn>
          )
        }}
      </Loading>
    )
  }
}


const mapStateToProps = (state) => {
  let postIdsSelector = querySelectors.createIdsSelector('Post', 'my-favorites')
  let ids = postIdsSelector(state)
  let postsSelector = dbSelectors.createEntitySelector('Post', ids)
  return {
    posts: postsSelector(state),
    getMyFavoritePostsPending: apiSelectors.getMyFavoritePostsPending(state),
    session: sessionSelectors.getSession(state)
  }
}

const mapDispatchToProps = {
  getMyFavoritePosts: apiActions.getMyFavoritePosts,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FavoritePostsPage)
