import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import { withRouter } from 'react-router';
import Cookie from '../components/cookie';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
    };

    this.onAnchorClick = this.onAnchorClick.bind(this);
  }

  componentDidMount() {
    ReactGA.pageview('/home');
    const { location } = this.props;
    const anchor = (location.state && location.state.anchor) || null;
    this.setState({ anchor });
  }

  onAnchorClick(anchor) {
    this.setState({ anchor });
  }

  render() {
    const { anchor } = this.state;
    return (
      <Main id="main">
        <Cookie />
        <ImgContainer>
          <Image src="/static/illustrations/home1.png" alt="IOTA process illustration" />
        </ImgContainer>
      </Main>
    );
  }
}

export default withRouter(HomePage);

const Main = styled.div`
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
`;

const ImgContainer = styled.div`
  display: flex;
  justify-content: center;
  height: 100%;
`;

const Image = styled.img`
  height: 100%;
  padding: 10px 0;
  width: 500px;
  @media (max-width: 650px) {
    width: 350px;
  }
`;
