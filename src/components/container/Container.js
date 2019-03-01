import React, { Component } from 'react';
import SelectBox from '../selectBox/SelectBox';
import LoginButton from '../loginButton/LoginButton';

import './Container.css';

class Container extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
    };
  }

  saveUser = (user) => {
    this.setState({ user });
  }

  render() {
    const { user } = this.state;

    return (
      <>
        <LoginButton callback={this.saveUser} />
        <SelectBox user={user} />
      </>
    );
  }
}

export default Container;
