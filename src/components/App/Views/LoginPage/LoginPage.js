import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  actions as apiActions,
} from 'store/api'
import { selectors as sessionSelectors } from 'store/other/session'
import { TextField } from '@material-ui/core'
import { PromiseButton } from 'components/App/Shared'
import { FadeIn } from 'components/Universal/Transitions'
import { actions as notificationActions } from 'store/other/notifications'

import styles from './LoginPage.module.css'

class LoginPage extends Component {

  state = {
    email: '',
    password: ''
  }

  componentDidMount() {
    this.props.showNotification({
      type: 'info',
      message: 'Hint: Because this web app is only a demo, you may log in with any credentials.',
      duration: 5000
    })
  }

  onInputChange = (key, value) => {
    this.setState({
      [key]: value
    })
  }

  logIn = () => {
    return this.props.logIn(
      this.state.email,
      this.state.password
    ).then(() => {
      this.props.history.push('/')
    })
  }

  render() {
    return (
      <FadeIn>
        <div className={styles.root}>
          <form className={styles.loginForm}>
            <TextField
              label="Email"
              type="email"
              margin="normal"
              onChange={(e) => this.onInputChange('email', e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              margin="normal"
              onChange={(e) => this.onInputChange('password', e.target.password)}
            />
            <PromiseButton color="primary" onClick={this.logIn}>Log In</PromiseButton>
          </form>
        </div>
      </FadeIn>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    session: sessionSelectors.getSession(state)
  }
}

const mapDispatchToProps = {
  logIn: apiActions.logIn,
  showNotification: notificationActions.showNotification,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage)
