import React from 'react';
import isEmpty from 'lodash-es/isEmpty';
import styled from 'styled-components';
import { generate, evaluate, operations, submodel } from 'SeMarket/ServiceApp/industry_4.0_language';
import api from '../utils/api';
import AddCard from '../components/add-asset';
import AssetList from '../components/asset-list';
import AssetNav from '../components/asset-nav';
import Loading from '../components/loading';
import Modal from '../components/modal';


import ap from  '../sample_requests/acceptProposal.json';
import cfp from '../sample_requests/cfp.json';
import proposal from '../sample_requests/proposal.json';

export const AssetContext = React.createContext({});

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assets: {
        offers: [],
        requests: []
      },
      user: {},
      orders: [],
      loading: false,
      displayNewOfferForm: false,
      displayNewRequestForm: false,
      showModal: false,
      notification: null,
      error: false,
      noAssets: true,
      assetDetails: {},
      assetToModify: {},
      response: ''
    };

    this.createOffer = this.createOffer.bind(this);
    this.deleteAsset = this.deleteAsset.bind(this);
    this.createRequest = this.createRequest.bind(this);
    this.acceptProposal = this.acceptProposal.bind(this);
    this.showNewOfferForm = this.showNewOfferForm.bind(this);
    this.hideNewOfferForm = this.hideNewOfferForm.bind(this);
    this.showNewRequestForm = this.showNewRequestForm.bind(this);
    this.hideNewRequestForm = this.hideNewRequestForm.bind(this);
    this.notificationCallback = this.notificationCallback.bind(this);
  }

  componentDidMount() {
    this.callApi();
    const operation = operations();
    console.log('operations', operation);

    const model = submodel(operation[0].id);
    console.log('model', model);
  }

  async callApi() {
    // const response = await api.post('cfp', cfp);
    // return response.message;
  };

  createOffer() {
    return this.create('proposal', proposal);
  };

  createRequest() {
    return this.create('cfp', cfp);
  };

  acceptProposal() {
    return this.create('acceptProposal', ap);
  };

  create(endpoint, packet) {
    return new Promise(async (resolve) => {
      // Call server
      const data = await api.post(endpoint, packet);
      // Check success
      if (data.success) {
        this.findAssets();
        this.setState({
          displayNewOfferForm: false,
          displayNewRequestForm: false
        });
      } else if (data.error) {
        this.setState({
          showModal: true,
          error: data.error,
          notification: 'generalError',
          loading: false,
          assetDetails: {}
        });
      }

      resolve(data);
    });
  };

  async deleteAsset(assetId, category) {
    this.setState({ loading: true });
    const assets = this.state.assets;
    assets[category] = [...assets[category].filter(asset => asset.assetId !== assetId)];
    this.setState({
      loading: false,
      assets,
    });
  };

  showNewOfferForm() {
    this.setState({ displayNewOfferForm: true });
  }

  hideNewOfferForm() {
    this.setState({ displayNewOfferForm: false });
  }

  showNewRequestForm() {
    this.setState({ displayNewRequestForm: true });
  }

  hideNewRequestForm() {
    this.setState({ displayNewRequestForm: false });
  }

  notificationCallback() {
    this.setState({
      showModal: false,
      notification: null,
      error: false,
      assetDetails: {},
    });
  }

  render() {
    const { assets, noAssets, loading, displayNewOfferForm, displayNewRequestForm } = this.state;

    const activeOffers = assets.offers && !isEmpty(assets.offers)
      ? assets.offers.filter(asset => asset.active) : [];

    const inactiveOffers = assets.offers && !isEmpty(assets.offers)
      ? assets.offers.filter(asset => !asset.active) : [];

    const activeRequests = assets.requests && !isEmpty(assets.requests)
      ? assets.requests.filter(asset => asset.active) : [];

    const inactiveRequests = assets.requests && !isEmpty(assets.requests)
      ? assets.requests.filter(asset => !asset.active) : [];

    return (
      <Main>
        <AssetNav
          createOffer={this.showNewOfferForm}
          createRequest={this.showNewRequestForm}
          acceptProposal={this.acceptProposal}
        />
        <Data>
          {
            loading ? (
              <LoadingBox>
                <Loading />
              </LoadingBox>
            ) : (
              <AssetContext.Provider
                value={{
                  deleteAsset: this.deleteAsset,
                  history: this.showHistory,
                }}
              >
                <p>{this.state.response}</p>
                {
                  noAssets ? (
                    <NoAssetsOuterWrapper>
                      <NoAssetsInnerWrapper>
                        <Heading>You have no active offers or requests</Heading>
                        <Text>Why not create a new one?</Text>
                        <ButtonWrapper>
                          <Button onClick={this.showNewOfferForm}>
                            Create offer
                          </Button>
                          <Button onClick={this.showNewRequestForm}>
                            Create request
                          </Button>
                          <Button onClick={this.acceptProposal}>
                            Accept proposal
                          </Button>
                        </ButtonWrapper>
                      </NoAssetsInnerWrapper>
                    </NoAssetsOuterWrapper>
                  ) : null
                }
                <AssetsWrapper>
                  {
                    displayNewOfferForm &&
                    <AddCard
                      createAsset={this.createOffer}
                      cancel={this.hideNewOfferForm}
                      category="offers"
                    />
                  }
                  {
                    activeOffers.length > 0 ? (
                      <React.Fragment>
                        <Heading>Active Offers</Heading>
                        <ActiveAssets>
                          <AssetList
                            assets={activeOffers}
                          />
                        </ActiveAssets>
                      </React.Fragment>
                    ) : null
                  }
                  {
                    inactiveOffers.length > 0 ? (
                      <React.Fragment>
                        <Heading>Inactive Offers</Heading>
                        <InactiveAssets>
                          <AssetList
                            assets={inactiveOffers}
                          />
                        </InactiveAssets>
                      </React.Fragment>
                    ) : null
                  }
                  {
                    displayNewRequestForm &&
                    <AddCard
                      createAsset={this.createRequest}
                      cancel={this.hideNewRequestForm}
                      category="requests"
                    />
                  }
                  {
                    activeRequests.length > 0 ? (
                      <React.Fragment>
                        <Heading>Active Requests</Heading>
                        <ActiveAssets>
                          <AssetList
                            assets={activeRequests}
                          />
                        </ActiveAssets>
                      </React.Fragment>
                    ) : null
                  }
                  {
                    inactiveRequests.length > 0 ? (
                      <React.Fragment>
                        <Heading>Inactive Requests</Heading>
                        <InactiveAssets>
                          <AssetList
                            assets={inactiveRequests}
                          />
                        </InactiveAssets>
                      </React.Fragment>
                    ) : null
                  }
                </AssetsWrapper>
              </AssetContext.Provider>
            )
          }
        </Data>
        <Modal
          show={this.state.showModal || !isEmpty(this.state.error)}
          notification={this.state.notification}
          error={this.state.error}
          category={this.state.assetDetails.category}
          assetId={this.state.assetDetails.assetId}
          callback={this.state.notification === 'generalError' ? this.notificationCallback : null}
        />
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
  position: relative;
`

const NoAssetsInnerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  margin: 30% 50%;
  text-align: center;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const ActiveAssets = styled.div``

const InactiveAssets = styled.div`
  opacity: 0.7;
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
