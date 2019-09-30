import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import get from 'lodash-es/get';
import ModalVideo from 'react-modal-video';
import Map from '../components/map';
import Layout from '../components/Layout';
import AssetCards from '../components/asset-cards';
import AssetList from '../components/asset-list';
import Zmq from '../components/zmq';
import Text from '../components/Text';
import Tabs from '../components/Tabs';
import Button from '../components/Button';
import { getAll, getByType, removeExpired, writeToStorage } from '../utils/storage';
import { prepareData } from '../utils/card';
import { serviceRequester, serviceProvider } from '../config.json';
import '../assets/styles/demo.scss';
import grid from '../assets/img/demo/grid.svg';
import grid_selected from '../assets/img/demo/grid_selected.svg';
import list from '../assets/img/demo/list.svg';
import list_selected from '../assets/img/demo/list_selected.svg';
import empty from '../assets/img/demo/empty.svg';
import redirect from '../assets/img/demo/redirect.svg';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: [],
      allAssets: [],
      activeSection: 'callForProposal',
      view: 'grid',
      showVideo: false
    };

    this.newMessage = this.newMessage.bind(this);
    this.checkExpired = this.checkExpired.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.timer = null;
  }

  async componentDidMount() {
    window.scrollTo(0, 0);
    ReactGA.pageview('/demo');
    await this.checkExpired();
    this.timer = setInterval(() => this.checkExpired(), 600000);
  }

  async checkExpired() {
    const { activeSection } = this.state;
    await removeExpired(activeSection);
    const assets = await getByType(activeSection);
    const allAssets = await getAll();
    this.setState({ assets, allAssets });
  }

  async newMessage(message) {
    const card = await prepareData(get(message, 'data'));
    await writeToStorage(card);
    await this.checkExpired();
  }

  onTabChange(index) {
    const sections = ['callForProposal', 'proposal', 'acceptProposal'];
    this.setState({ activeSection: sections[index] }, async () => await this.checkExpired());
  }

  render() {
    const { assets, allAssets, activeSection, view, showVideo } = this.state;
    const externalService = activeSection === 'proposal' ? serviceProvider : serviceRequester;
    const statusNameMap = {
      callForProposal: 'Calls for Proposal',
      proposal: 'Proposals',
      acceptProposal: 'accepted Proposals'
    }

    return (
      <Layout>
        <div className="demo-page">
          <div className="demo-header">
            <Text className="title">Yellow Pages</Text>
            <Text>Discover how the Industry Marketplace acts as an integrated hub to enable the Industry 4.0 vision.</Text>
            <h3 className="links">
              <a href={serviceRequester} target="_blank" rel="noopener noreferrer">
                  Try it as Service Requester
              </a>
              {'  |  '}
              <a href={serviceProvider} target="_blank" rel="noopener noreferrer">
                  Try it as Service Provider
              </a>
            </h3>
            <Button
              className="medium secondary"
              onClick={() => this.setState({ showVideo: true })}
            >
                Demonstration
            </Button>
          </div>
          <div className="request-data-wrapper">
            <div className="demo-page-navigation">
              <div className="buttons-wrapper">
                <ChangeViewButton
                  selected={view === 'grid'}
                  onClick={() => this.setState({ view: 'grid' })}
                >
                  <img src={view === 'grid' ? grid_selected : grid} alt="Grid view" />
                </ChangeViewButton>
                <ChangeViewButton
                  selected={view === 'list'}
                  onClick={() => this.setState({ view: 'list' })}
                >
                  <img src={view === 'list' ? list_selected : list} alt="List view" />
                </ChangeViewButton>
              </div>
              <Tabs
                view={view}
                assets={assets}
                activeSection={activeSection}
                onTabChange={this.onTabChange}
              />
            </div>
            <div className="assets-wrapper">
              {
                assets.length === 0 ? (
                  <div className="no-assets">
                    <img src={empty} alt="" />
                    <Text className="title">No <strong>{statusNameMap[activeSection]}</strong> found</Text>
                    <Text>Test out this feature by clicking the “>” button</Text>
                    <a
                        href={externalService}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <img src={redirect} alt="Create new request" />
                    </a>
                  </div>
                ) : view === 'grid'
                  ? <div className="assets"><AssetCards assets={assets} /></div>
                  : <div className="assets"><AssetList assets={assets} /></div>
              }
            </div>
            <Map assets={allAssets} />
          </div>
        </div>
        <Zmq callback={this.newMessage} />
        <ModalVideo
            channel='youtube'
            autoplay
            allowFullScreen
            isOpen={showVideo}
            videoId='471yyvWLfQk'
            onClose={() => this.setState({ showVideo: false })}
        />
      </Layout>
    );
  }
}

const ChangeViewButton = styled.button`
  margin: 5px;
  background: transparent;
  border-radius: 6px;
  height: 40px;
  border: ${props => (props.selected ? '2px solid #4140DF' : '2px solid transparent')};
`;
