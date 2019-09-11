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
import Cookie from '../components/cookie';
import NoRequests from '../components/no-requests';
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
      activeSection: 'callForProposal',
      loading: false,
      loadingText: '',
      notification: '',
      displayNewRequestForm: false,
      error: false,
      confirmRemove: null,
      isConfigModal: false,
      isSideBarOpen: false,
      badges: {
        callForProposal: 0,
        proposal: 0,
        acceptProposal: 0,
        informConfirm: 0,
        informPayment: 0
      }
    };

    this.handleSidebar =  this.handleSidebar.bind(this)
    this.createRequest = this.createRequest.bind(this);
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
    await this.checkExpired();
    this.timer = setInterval(() => this.checkExpired(), 600000);

  }

  handleSidebar(e) {
    this.setState(prevState => ({
      isSideBarOpen: !prevState.isSideBarOpen
    }));
  }

  async changeSection(activeSection) {
    const badges = this.state.badges;
    badges[activeSection] = 0;
    this.setState({ activeSection, badges }, async () => await this.checkExpired());
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
          await this.newMessage({ data: data.request }, true);
        }        
      } else if (data.error) {
        this.setState({
          error: data.error,
          loading: false,
          loadingText: ''
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

      await this.context.getUser();
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

  async newMessage(message, ownMessage = false) {
    const { role } = this.context.user;
    console.log('message', message);
    const card = await prepareData(role, get(message, 'data'));
    console.log('card', card, role);

    if (card.type !== 'rejectProposal') {
      await writeToStorage(card, role);
      if (!ownMessage) {
        const badges = this.state.badges;
        badges[card.type] = badges[card.type] + 1;
        this.setState({ badges });  
      }
    }
    if (card.type === 'informPayment') {
      await this.context.getUser();
    }
    await this.checkExpired();
  }

  async generateRequest(type, id, partner = null, price = null) {
    const { irdi, originalMessage, partnerName } = await readFromStorage(partner ? `${id}#${partner}` : id);
    const request = {
      messageType: type,
      userId: this.context.user.id,
      replyTime: waitingTime,
      originalMessage: await JSON.parse(originalMessage),
      userName: partnerName,
      irdi,
      price,
    };
    console.log('generateRequest', request);
    return request;
  }

  async removeAsset(id, partner, type) {
    const cardId = type === 'proposal' ? `${id}#${partner}` : id;
    const { irdi, operation } = await readFromStorage(cardId);
    const notification = `Do you really want to remove request "${operation}" with IRDI "${irdi}" from the list?`;
    this.setState({ notification, confirmRemove: cardId });
  }

  async confirmAction(id, partner, price = null) {
    const { role } = this.context.user;
    const { activeSection } = this.state;
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
          this.setState({ loading: true, loadingText: 'Synchronizing with the Tangle. This will take a couple of seconds, do not close the window' });
          return this.sendMessage('informPayment', message);
        default:
          return null;
      }
    } else if (role === 'SP') {
      switch (activeSection) {
        case 'callForProposal':
          // send proposal
          message = await this.generateRequest('proposal', id, null, price);  
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
    const { role } = this.context.user;
    const { activeSection } = this.state;
    if (role === 'SR') {
      switch (activeSection) {
        case 'callForProposal':
          this.removeAsset(id, null, 'callForProposal');
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

  async notificationCallback(confirmRemove = false) {
    if (confirmRemove) {
      await removeFromStorage(this.state.confirmRemove);
      await this.checkExpired();
    }
    this.setState({ error: false, notification: '', confirmRemove: null });
  }

  render() {
    const { activeSection, assets, badges, loading, loadingText, displayNewRequestForm, isSideBarOpen } = this.state;
    return (
      <Main id="main">
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
            badges={badges}
            currentPage={activeSection}
            callback={this.changeSection}
            handleConfigModal={this.handleConfigModal}
          />
          <Data>
            <AnimationWrapper isSideBarOpen={isSideBarOpen}>
              <AssetContext.Provider
                value = {{
                  history: this.showHistory,
                  onCancel: this.removeAsset,
                  onConfirm: this.confirmAction,
                  onReject: this.rejectAction,
                }}
              >
                {
                  this.context.user.role === 'SR' && assets.length === 0 && activeSection === 'callForProposal' ? (
                    <NoRequests callback={this.showNewRequestForm} />
                  ) : (
                    <AssetsWrapper>
                      {
                        loading ? (
                          <LoadingBox>
                            <Loading text={loadingText} />
                          </LoadingBox>
                        ) : <AssetList assets={assets} />
                      }
                    </AssetsWrapper>
                  )
                }
              </AssetContext.Provider>
            </AnimationWrapper>
          </Data>
          {
            displayNewRequestForm &&
              <AddCard
                createRequest={this.createRequest}
                cancel={this.hideNewRequestForm}
                user={this.context.user}
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
          show={!isEmpty(this.state.error) || this.state.notification}
          error={this.state.error}
          type={this.state.confirmRemove ? 'confirmRemove' : 'general'}
          notification={this.state.notification}
          callback={this.notificationCallback}
        />
        <Cookie />
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
  height: 100%;
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
