import React from 'react';
import axios from 'axios';
import Button from './Button'
import '../assets/styles/contact-form.scss'

const emailConfig = {
    url: 'https://us-central1-semarket-iota.cloudfunctions.net/sendEmail',
    policyUrl: 'https://www.iota.org/research/privacy-policy'
}

class ContactForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      acceptedDisclaimer: false,
      newsletter: false,
      name: '',
      email: '',
      message: '',
      loading: false,
      success: false,
      error: null,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.submit = this.submit.bind(this);
    this.selectItem = this.selectItem.bind(this);
    // this.verify = this.verify.bind(this);
  }

  handleInputChange({ target }) {
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({ [name]: value });
  }

  selectItem(type, title) {
    this.setState({ [type]: title });
  }

  async submit(e) {
    e.preventDefault();
    const {
        name, email, acceptedDisclaimer, newsletter, message, loading,
    } = this.state;

    if (loading) return;

    if (!acceptedDisclaimer || !name || !email || !message) {
      return this.setState({ error: 'Please fill out all required fields marked with *' });
    }

    this.setState({ loading: true }, async () => {
      const packet = { name, email, acceptedDisclaimer, newsletter, message };

      axios
        .post(emailConfig.url, packet)
        .then(() => {
          this.setState({ success: true });
        })
        .catch(error => {
          console.log('sent email', error);
          this.setState({ success: false, error });
        });
    });
  }

  render() {
    const {
      acceptedDisclaimer, name, email, message, success, error, loading, newsletter,
    } = this.state;

    return (
      <div className="contact-form-wrapper">
        <section className="contact-form">
          {!success ? (
            <form className="form" onSubmit={this.submit}>
              <h2 className="form-heading">
                  Get in Touch
              </h2>
              {error && <p className="error">{error}</p>}
              <section className="input-form-wrapper">
                <div className="column-form-wrapper">
                  <input
                    className="input"
                    type="text"
                    placeholder="Name *"
                    value={name}
                    name="name"
                    onChange={this.handleInputChange}
                  />
                  <input
                    className="input"
                    type="email"
                    placeholder="Email *"
                    value={email}
                    name="email"
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="column-form-wrapper">
                  <textarea
                    className="textarea"
                    value={message}
                    placeholder="Message *"
                    name="message"
                    onChange={this.handleInputChange}
                  />
                </div>
              </section>
              <section className="checkbox-wrapper">
                <label className="label">
                  <input
                    className="checkbox"
                    name="acceptedDisclaimer"
                    type="checkbox"
                    checked={acceptedDisclaimer}
                    onChange={this.handleInputChange}
                  />
                  * <strong>Acknowledgement</strong> of{' '}
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer"
                    href={emailConfig.policyUrl}
                  >Disclaimer clause</a>
                </label>
                <label className="label">
                  <input
                    className="checkbox"
                    name="newsletter"
                    type="checkbox"
                    checked={newsletter}
                    onChange={this.handleInputChange}
                  />
                  Please add me to the newsletter
                </label>
              </section>
              <section className="control-wrapper">
                {
                    !loading && (
                      <Button
                        type="submit" 
                        className="medium primary" 
                        onClick={this.submit}
                      >
                        Submit
                      </Button>
                    )
                }
                {loading && <p className="error">Sending</p>}
              </section>
            </form>
          ) : (
            <div className="success-wrapper">
              <p className="success">Your message has been sent!</p>
            </div>
          )}

          <div className="bottom" />
        </section>
      </div>
    );
  }
}

export default ContactForm;
