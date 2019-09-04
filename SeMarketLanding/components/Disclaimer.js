import React from 'react'
import { withCookies } from 'react-cookie';
import Button from './Button'

import '../styles/disclaimer.scss'

class Disclaimer extends React.Component {
  state = { ack: true }

  componentDidMount() {
    const ack = this.props.cookies.get('coordicide-cookie');
    if (!ack) {
      document.getElementById('footer').classList.add('cookie-bar-bottom-bar');
      this.setState({ ack: false });
    }
  }

  dismiss = () => {
    this.props.cookies.set('coordicide-cookie', true, { path: '/' });
    document.getElementById('footer').classList.remove('cookie-bar-bottom-bar');
    this.setState({ ack: true })
  }

  render() {
    if (this.state.ack) return null;

    return (
      <div className="disclaimer">
        <span className="disclaimer-text">
          This website uses cookies to ensure you get the best experience on our
          website.&nbsp;
          <a
            className="disclaimer-link"
            href="https://www.iota.org/research/privacy-policy"
          >
            Learn more
          </a>
        </span>
        <Button className="medium primary centered" onClick={this.dismiss}>Dismiss</Button>
      </div>
    )
  }
}

export default withCookies(Disclaimer)