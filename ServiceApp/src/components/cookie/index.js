import React from 'react'
import { withCookies } from 'react-cookie';

class Cookie extends React.Component {
  state = { ack: true }

  componentDidMount() {
    const ack = this.props.cookies.get('semarket-ack');
    if (!ack) {
      document.getElementById('main').classList.add('cookie-bar-bottom-bar');
      this.setState({ ack: false });
    }
  }

  dismiss = () => {
    this.props.cookies.set('semarket-ack', true, { path: '/' });
    document.getElementById('main').classList.remove('cookie-bar-bottom-bar');
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
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.iota.org/research/privacy-policy"
        >
        Learn more
        </a>
      </span>
      <button className="button" onClick={this.dismiss}>Dismiss</button>
    </div>
    )
  }
}

export default withCookies(Cookie);
