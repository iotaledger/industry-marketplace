import React from 'react';
import get from 'lodash-es/get';
import styled from 'styled-components';
import AssetList from '../components/asset-list';
import Loading from '../components/loading';
import Sidebar from '../components/sidebar';
import Zmq from '../components/zmq';
import { getByType, removeExpired } from '../utils/storage';
import { prepareData } from '../utils/card';

export const AssetContext = React.createContext({});
export const UserContext = React.createContext({});

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
    const { activeSection, assets, user, loading, displayNewRequestForm } = this.state;

    return (
      <Main>
        <UserContext.Provider value={{ user }}>
          <Zmq callback={this.newMessage} />
          <Data>
            <Sidebar
              showMenu
              currentPage={activeSection}
              callback={this.changeSection}
              handleLocationModal={this.handleLocationModal}
            />
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
                  {
                    displayNewRequestForm &&
                    <AddCard
                      createRequest={this.createRequest}
                      cancel={this.hideNewRequestForm}
                      user={user}
                    />
                  }
                  {
                    this.state.isLocationModal &&
                    <AddGeolocation
                      sendMessage={this.updateConfig}
                      handleLocationModal={this.handleLocationModal}
                    />
                  }
                </AssetContext.Provider>
              )
            }
          </Data>
        </UserContext.Provider>
      </Main>
    );
  }
}

export default Dashboard;

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
  min-height: 90vh;
  position: relative;
  display: flex;
  @media (max-width: 760px) {
    flex-direction: column;
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
