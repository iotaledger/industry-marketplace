import React, { Component } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';

class MessageContent extends Component {
  componentDidMount() {
    this.highlight();
  }

  componentDidUpdate() {
    this.highlight();
  }

  highlight = () => {
    try {
      hljs.highlightBlock(this.code);
    } catch (e) {
      console.log(hljs, window.hljs);
    }
  };

  render() {
    return (
      <div className="highlightjs-component">
        <pre className="prettyprint lang-json">
          <code className="json prettyprint lang-json" ref={code => (this.code = code)}>
            {JSON.stringify(this.props.message, null, 2)}
          </code>
        </pre>
      </div>
    );
  }
}

export default MessageContent;