import React, { Component } from 'react';
import api from '../utils/api';
import UserContext from './user-context';

class GlobalState extends Component {
  state = {
    user: {}
  };

  async componentDidMount() {
    await this.getUser();
  }

  getUser = async () => {
    console.log('global getUser 1');
    const user = await api.get('user');
    console.log('global getUser 2', user);
    this.setState({ user });
    return user;
  };

  render() {
    return (
      <UserContext.Provider value={{
          user: this.state.user,
          getUser: this.getUser
      }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default GlobalState;