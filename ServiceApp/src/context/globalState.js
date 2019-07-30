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
    const user = await api.get('user');
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