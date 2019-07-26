import React from 'react';
import get from 'lodash-es/get';
import isEmpty from 'lodash-es/isEmpty';
import styled from 'styled-components';
import api from '../utils/api';
import AddCard from '../components/add-asset';
import Config from '../components/config';
import AssetList from '../components/asset-list';
import AssetNav from '../components/asset-nav';
import Loading from '../components/loading';
import Modal from '../components/modal';
import Sidebar from '../components/sidebar';
import Zmq from '../components/zmq';
import { generate } from '../Industry_4.0_language';
import UserContext from '../context/user-context';
import { waitingTime } from '../config.json';
import {
  getByType,
  readFromStorage,
  removeExpired,
  removeFromStorage,
  removeProposals,
  writeToStorage
} from '../utils/storage';
import { prepareData } from '../utils/card';

export const AssetContext = React.createContext({});

class Dashboard extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      user: {},
      activeSection: 'callForProposal',
      loading: false,
      displayNewRequestForm: false,
      error: false,
      isConfigModal: false,
      isSideBarOpen:  false//only useful on mobile screens
    };

    this.handleSidebar =  this.handleSidebar.bind(this)
    this.createRequest = this.createRequest.bind(this);
    this.getUser = this.getUser.bind(this);
    this.newMessage = this.newMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.showHistory = this.showHistory.bind(this);
    this.showNewRequestForm = this.showNewRequestForm.bind(this);
    this.hideNewRequestForm = this.hideNewRequestForm.bind(this);
    this.notificationCallback = this.notificationCallback.bind(this);
    this.checkExpired = this.checkExpired.bind(this);
    this.changeSection = this.changeSection.bind(this);
    this.rejectAction = this.rejectAction.bind(this);
    this.confirmAction = this.confirmAction.bind(this);
    this.handleConfigModal = this.handleConfigModal.bind(this);
    this.removeAsset = this.removeAsset.bind(this);
    this.updateConfig = this.updateConfig.bind(this);
    this.timer = null;
  }

  async componentDidMount() {
    await this.getUser();
    await this.checkExpired();
    this.timer = setInterval(() => this.checkExpired(), 600000);

  }

  handleSidebar(e) {
    this.setState(prevState => ({
      isSideBarOpen: !prevState.isSideBarOpen
    }));
  }

  async getUser() {
    const user = await this.context.getUser();
    this.setState({ user });
  };

  async changeSection(activeSection) {
    this.setState({ activeSection }, async () => await this.checkExpired());
  }

  async checkExpired() {
    const { activeSection } = this.state;
    await removeExpired(activeSection);
    const assets = await getByType(activeSection);
    this.setState({ assets });
  }

  async createRequest(message) {
    return this.sendMessage('cfp', message);
  };

  async sendMessage(endpoint, packet) {
    this.setState({ loading: true });
    return new Promise(async (resolve) => {
      // Call server
      const data = await api.post(endpoint, packet);
      // Check success
      if (data.success) {
        this.setState({
          displayNewRequestForm: false,
          error: false,
          loading: false,
        });
        if (endpoint !== 'rejectProposal') {
          await this.newMessage({ data: packet });
        }        
      } else if (data.error) {
        this.setState({
          error: data.error,
          loading: false,
        });
      }

      resolve(data);
    });
  };

  async updateConfig(packet) {
    return new Promise(async resolve => {
      if (!packet) {
        return resolve({ error: 'Address convertion failed. Please use only latin letters' });
      }
      // Call server
      const data = await api.post('config', packet);
      // Check success
      if (data.success) {
        this.setState({
          isConfigModal: false,
          error: false,
          loading: false,
        });
      } else if (data.error) {
        this.setState({
          error: data.error,
          loading: false,
        });
      }

      await this.getUser();
      resolve(data);
    });
  };

  handleConfigModal(state) {
    this.setState({ isConfigModal: state })
  }

  showHistory(assetId) {
    this.props.history.push(`/history/${assetId}`);
  }

  showNewRequestForm() {
    this.setState({ displayNewRequestForm: true });
  }

  hideNewRequestForm() {
    this.setState({ displayNewRequestForm: false });
  }

  async newMessage(message) {
    const { user: { role } } = this.state;
    console.log('message', message);
    const card = await prepareData(
      get(this.state, 'user.role'),
      get(message, 'data')
    );
    console.log('card', card, role);

    if (card.type !== 'rejectProposal') {
      await writeToStorage(card, role);
    }
    if (card.type === 'informPayment') {
      await this.getUser();
    }
    await this.checkExpired();
  }

  async generateRequest(type, id, partner = null, price = null) {
    const { user } = this.state;
    const { irdi, originalMessage, walletAddress } = await readFromStorage(partner ? `${id}#${partner}` : id);
    const request = generate({
      messageType: type,
      userId: user.id,
      replyTime: waitingTime,
      originalMessage: await JSON.parse(originalMessage),
      irdi,
      price
    });
    if (walletAddress) {
      request.walletAddress = walletAddress;
    }
    console.log('generateRequest', request);
    return request;
  }

  async removeAsset(id) {
    await removeFromStorage(id);
    await this.checkExpired();
  }

  async confirmAction(id, partner, price = null) {
    const { activeSection, user: { role } } = this.state;
    let message;
    if (role === 'SR') {
      switch (activeSection) {
        case 'proposal':
          // send acceptProposal
          message = await this.generateRequest('acceptProposal', id, partner);
          await removeProposals(id);
          return this.sendMessage('acceptProposal', message);
        case 'informConfirm':
          // send informPayment
          message = await this.generateRequest('informPayment', id);
          this.setState({ loading: true });
          return this.sendMessage('informPayment', message);
        default:
          return null;
      }
    } else if (role === 'SP') {
      switch (activeSection) {
        case 'callForProposal':
          // send proposal
          message = await this.generateRequest('proposal', id, null, 10);
          return this.sendMessage('proposal', message);
        case 'acceptProposal':
          // send informConfirm
          message = await this.generateRequest('informConfirm', id);
          return this.sendMessage('informConfirm', message);
        default:
          return null;
      }
    }
  }

  async rejectAction(id, partner) {
    const { activeSection, user: { role } } = this.state;
    if (role === 'SR') {
      switch (activeSection) {
        case 'callForProposal':
          await removeFromStorage(id);
          await this.checkExpired();
          return null;
        case 'proposal':
          // send rejectProposal
          const message = await this.generateRequest('rejectProposal', id, partner);
          await removeFromStorage(`${id}#${partner}`);
          await this.checkExpired();
          return this.sendMessage('rejectProposal', message);
        default:
          return null;
      }
    } else if (role === 'SP') {
      switch (activeSection) {
        case 'callForProposal':
        case 'acceptProposal':
        case 'rejectProposal':
          await removeFromStorage(id);
          await this.checkExpired();
          return null;
        default:
          return null;
      }
    }
  }

  notificationCallback() {
    this.setState({ error: false });
  }

  render() {
    const { activeSection, assets, user, loading, displayNewRequestForm, isSideBarOpen } = this.state;
    return (
      <Main>
        <AssetNav
          createRequest={this.showNewRequestForm}
          handleSidebar={this.handleSidebar}
          isSideBarOpen={isSideBarOpen}
        />
        <Zmq callback={this.newMessage} />
        <ColumnWrap>
          <Sidebar
            isSideBarOpen={isSideBarOpen}
            handleSidebar={this.handleSidebar}
            createRequest={this.showNewRequestForm}
            showMenu
            currentPage={activeSection}
            callback={this.changeSection}
            handleConfigModal={this.handleConfigModal}
          />
          <Data>
            <AnimationWrapper isSideBarOpen={isSideBarOpen}>
              {
                loading ? (
                  <LoadingBox>
                    <Loading />
                  </LoadingBox>
                ) : (
                  <AssetContext.Provider
                    value = {{
                      history: this.showHistory,
                      onCancel: this.removeAsset,
                      onConfirm: this.confirmAction,
                      onReject: this.rejectAction,
                    }}
                  >
                    {
                      user.role === 'SR' && assets.length === 0 && activeSection === 'callForProposal' ? (
                        <NoAssetsOuterWrapper>
                          <NoAssetsInnerWrapper>
                            <Heading>You have no active requests</Heading>
                            <Text>Why not create a new one?</Text>
                            <ButtonWrapper>
                              <Button onClick={this.showNewRequestForm}>
                                Create request
                              </Button>
                            </ButtonWrapper>
                          </NoAssetsInnerWrapper>
                        </NoAssetsOuterWrapper>
                      ) : (
                        <AssetsWrapper>
                          <AssetList assets={assets} />
                        </AssetsWrapper>
                      )
                    }
                  </AssetContext.Provider>
                )
              }
            </AnimationWrapper>
          </Data>
          {
            displayNewRequestForm &&
            <AddCard
              createRequest={this.createRequest}
              cancel={this.hideNewRequestForm}
              user={user}
            />
          }
          {
            this.state.isConfigModal &&
            <Config
              sendMessage={this.updateConfig}
              handleConfigModal={this.handleConfigModal}
            />
          }
        </ColumnWrap>
        <Modal
          show={!isEmpty(this.state.error)}
          error={this.state.error}
          callback={this.notificationCallback}
        />
      </Main>
    );
  }
}

export default Dashboard;

const ColumnWrap = styled.div`
  display: flex;
  min-height: calc(100% - 92px); 
  height: calc(100% - 92px); 
  @media (min-width: 769px) {
  }
`

const AnimationWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transition: transform 0.5s;
  transform: ${(p) => p.isSideBarOpen ? 'translateX(-100%)' : 'translateX(0px)'};
`
const Main = styled.main`
  height: 100vh;
`;

const AssetsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const NoAssetsOuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const NoAssetsInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const Data = styled.section`
  background-image: linear-gradient(-189deg, #06236c 1%, #1449c6 95%);
  width: 100%;
  display: flex;
  height: 100%;
  overflow-y: auto;
  @media (min-width: 769px) {
  }
`;

const LoadingBox = styled.div`
  margin: auto;
`;

const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 15px 'Nunito Sans', sans-serif;
  letter-spacing: 0.47px;
  padding: 20px 38px;
  border-radius: 100px;
  text-transform: uppercase;
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.38px;
  padding: 12px 21px;
  margin: 15px 0 0;
  box-shadow: 0 10px 20px 0 #0a2056;
  font-weight: 700;
  background-color: #009fff;
  width: 160px;
`;

const Heading = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  color: #ffffff;
  padding-top: 50px;
  margin: 0 40px;
`;

const Text = styled.h4`
  font-size: 1.3rem;
  font-weight: 300;
  color: #ffffff;
  padding: 20px 0;
`;
