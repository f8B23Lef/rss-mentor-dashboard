import React, { Component } from 'react';
import PropTypes from 'prop-types';
import firebase from 'firebase/app';
import 'firebase/auth';

import './LoginButton.css';

const config = {
  apiKey: 'AIzaSyDyvDtrVAOA2GWf5xoFVKnNuWOkYypgDGI',
  authDomain: 'test-p-22fd0.firebaseapp.com',
  databaseURL: 'https://test-p-22fd0.firebaseio.com',
  projectId: 'test-p-22fd0',
  storageBucket: 'test-p-22fd0.appspot.com',
  messagingSenderId: '971268174741',
};

class LoginButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };

    this.fb = firebase.initializeApp(config);
    this.provider = new firebase.auth.GithubAuthProvider();
  }

  onLogin = () => {
    this.fb.auth().signInWithPopup(this.provider).then((result) => {
      const user = result.additionalUserInfo.profile.login;
      this.setState({ user });

      const { callback } = this.props;
      callback(user);
    });
  }

  onLogout = () => {
    this.fb.auth().signOut().then(() => {
      this.setState({ user: null });

      const { user } = this.state;
      const { callback } = this.props;
      callback(user);
    });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <section className="login__wrapper">
          <div>
            {user && <p>{user}</p>}
            {user
              ? <button type="button" onClick={this.onLogout}>Logout</button>
              : <button type="button" onClick={this.onLogin}>Login</button>
            }
          </div>
        </section>
      </React.Fragment>
    );
  }
}

LoginButton.propTypes = {
  callback: PropTypes.func.isRequired,
};


export default LoginButton;
