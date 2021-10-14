import React from 'react';
import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';
import isEqual from 'lodash/isEqual'
import { FadeOut } from '../Transitions'

const variants = ['success','warning', 'error', 'info']

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: blue[600],
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});



/*
  This is a nifty component that allows you to build promise buttons.
  It's a standard material ui Button that expects a promise to be returned
  from the onClick handler. It provide render props to show different button
  content during the different promise states. It also allows you to short-circuit
  the button during the different promise states.

  Example Usage:

  state = {
    notification: {
      type: 'success',
      message: 'Form submitted!'
    }
  }

  <Notification
    onClose={this.removeNotification}
    notification={this.state.notification}
  />

*/
class Notification extends React.Component {

  componentDidMount() {
    this.startTimer()
  }

  componentDidUpdate(prevProps) {
    if (
      !isEqual(this.props.notification, prevProps.notification)
    ) {
      this.startTimer()
    }
  }

  startTimer() {
    if (!this.props.notification) {
      return
    }
    clearTimeout(this.timeout)
    let { duration } = this.props.notification
    this.timeout = setTimeout(
      () => {
        this.props.onClose()
      },
      Number.isInteger(duration) ? duration : 4000
    )
  }

  onClose = (e) => {
    clearTimeout(this.timeout)
    this.props.onClose(e)
  }

  render() {
    const {
      notification,
      className,
      classes,
      ...other
    } = this.props

    let variant = notification && variants.includes(notification.type) ? notification.type : 'info'

    const Icon = variantIcon[variant];

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        open={notification != null}
        transitionDuration={300}
      >
        <SnackbarContent
          className={classNames(classes[variant], classes.content, className)}
          aria-describedby="client-snackbar"
          message={
              <FadeOut>
                {notification && (
                  <div className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    <span>{notification.message}</span>
                  </div>
                )}
              </FadeOut>
          }
          action={
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.onClose}
            >
              <CloseIcon className={classes.icon} />
            </IconButton>
          }
          {...other}
        />
      </Snackbar>
    )
  }
}

Notification.defaultProps = {
  notification: null,
  onClose: () => {},
}

export default withStyles(styles)(Notification)
