import React from 'react';
import get from 'lodash-es/get';
import styled from 'styled-components';
import Sidebar from '../components/sidebar';
import Zmq from '../components/zmq';
import { getByType, removeExpired } from '../utils/storage';
import { prepareData } from '../utils/card';

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      activeSection: 'callForProposal',
    };

    this.newMessage = this.newMessage.bind(this);
    this.checkExpired = this.checkExpired.bind(this);
    this.changeSection = this.changeSection.bind(this);
    this.timer = null;
  }
  
  async componentDidMount() {
    await this.checkExpired();
    this.timer = setTimeout(() => this.checkExpired(), 600000);
  }

  async changeSection(activeSection) {
    this.setState({ activeSection }, async () => await this.checkExpired());
  }

  async checkExpired() {
    const { activeSection } = this.state;
    await removeExpired(activeSection);
    const assets = await getByType(activeSection);
    this.setState({ assets });
    clearInterval(this.timer);
  }

  async newMessage(message) {
    const { user: { role } } = this.state;
    console.log('message', message);
    const card = await prepareData(
      get(this.state, 'user.role'),
      get(message, 'data')
    );
    console.log('card', card, role);

    await this.checkExpired();
  }

  render() {
    const { activeSection, assets } = this.state;

    return (
      <Main>
        <Zmq callback={this.newMessage} />
        <Data>
          <Sidebar
            showMenu
            currentPage={activeSection}
            callback={this.changeSection}
          />
        </Data>
      </Main>
    );
  }
}

export default Dashboard;

const Main = styled.main`
  height: 100vh;
`;

const Data = styled.section`
  background-image: linear-gradient(-189deg, #06236c 1%, #1449c6 95%);
  min-height: 90vh;
  position: relative;
  display: flex;
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;
