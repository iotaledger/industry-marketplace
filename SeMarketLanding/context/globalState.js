import React, { Component } from 'react';
import LanguageContext from './language-context';

class GlobalState extends Component {
  state = {
    language: 'en'
  };

  changeLanguage = async (language) => {
    this.setState({ language });
  };

  render() {
    return (
      <LanguageContext.Provider value={{
          language: this.state.language,
          changeLanguage: this.changeLanguage
      }}>
        {this.props.children}
      </LanguageContext.Provider>
    );
  }
}

export default GlobalState;