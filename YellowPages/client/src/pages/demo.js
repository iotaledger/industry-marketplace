import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import get from 'lodash-es/get';
import BurgerMenu from '../components//header/burger';
import MiniHeader from '../components/header/mini-header';
import Footer from '../components/footer';
import Map from '../components/map';
import ScrollToTop from '../components/scroll-to-top';
import Loading from '../components/loading';
import Cookie from '../components/cookie';
import AssetCards from '../components/asset-cards';
import AssetList from '../components/asset-list';
import Zmq from '../components/zmq';
import { getAll, getByType, removeExpired, writeToStorage } from '../utils/storage';
import { prepareData } from '../utils/card';

const Header = ({ changeSection }) => {
  return (
    <Container>
      <Shapes>
        <Shape1 src="/static/shapes/demo/shape-5.svg" alt="Background shape" />
        <Tagline>Yellow Pages</Tagline>
      </Shapes>
      <Info>
        <SubLink
          role="button"
          onClick={() => changeSection('callForProposal')}
        >
          {'Calls for proposal'.toUpperCase()}
        </SubLink>
        <SubLink
          role="button"
          onClick={() => changeSection('proposal')}
        >
          {'Proposals'.toUpperCase()}
        </SubLink>
        <SubLink
          role="button"
          onClick={() => changeSection('acceptProposal')}
        >
          {'Accepted proposals'.toUpperCase()}
        </SubLink>
      </Info>
    </Container>
  );
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchor: null,
      assets: [],
      allAssets: [],
      activeSection: 'callForProposal',
      view: 'grid'
    };

    this.newMessage = this.newMessage.bind(this);
    this.checkExpired = this.checkExpired.bind(this);
    this.changeSection = this.changeSection.bind(this);
    this.timer = null;
  }

  async componentDidMount() {
    ReactGA.pageview('/demo');
    await this.checkExpired();
    this.timer = setInterval(() => this.checkExpired(), 600000);
  }

  async changeSection(activeSection) {
    this.setState({ activeSection, anchor: 'list' }, async () => await this.checkExpired());
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
    console.log('card', card);
    await writeToStorage(card);
    await this.checkExpired();
  }

  onScrollToTop() {
    const target = document.querySelector('#main');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render() {
    const { assets, allAssets } = this.state;

    return (
      <Main id="main" noAssets={assets.length === 0}>
        <Zmq callback={this.newMessage} />
        <Cookie />
        <BurgerMenu />
        <MiniHeader />
        <Header changeSection={this.changeSection} />
        {
          assets.length === 0 ? (
            <LoadingBox>
              <Loading color="#009fff" size="130" />
            </LoadingBox>
          ) : (
            <React.Fragment>
              <ButtonsWrapper>
                <Button
                  selected={this.state.view === 'grid'}
                  onClick={() => this.setState({ view: 'grid' })}
                >
                  <i className="fas fa-th-large"></i>&nbsp;&nbsp;Grid
                </Button> 
                <Button 
                  selected={this.state.view === 'list'}
                  onClick={() => this.setState({ view: 'list' })}
                >
                  <i className="fas fa-bars"></i>&nbsp;&nbsp;List
                </Button> 
              </ButtonsWrapper>
              {
                this.state.view === 'grid'
                  ? <AssetCards assets={assets} />
                  : <AssetList assets={allAssets} />
              }
              <Map assets={assets} />
              {
                assets.length > 0 ? <ScrollToTop onClick={this.onScrollToTop} /> : null
              }
            </React.Fragment>
          )
        }
        <Footer />
      </Main>
    );
  }
}

const Main = styled.div`
  overflow-x: hidden;
  height: ${props => (props.noAssets ? '100vh' : 'unset')};
  display: ${props => (props.noAssets ? 'flex' : 'block')};
  flex-direction: column;
  justify-content: space-between;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Button = styled.button`
  font-size: 20px;
  margin: 20px;
  background: transparent;
  color: ${props => (props.selected ? '#009fff' : '#000000')};
`;

const Container = styled.div`
  display: flex;
  width: 100%;
  max-width: 1170px;
  padding: 0 15px;
  margin-right: auto;
  margin-left: auto;
  margin-bottom: 150px;

  @media (max-width: 820px) {
    margin-bottom: 80px;
  }

  @media (max-width: 660px) {
    background-image: url(/static/shapes/demo/shape-header-hero.svg);
    background-repeat: no-repeat;
    background-size: 448px 209px;
    padding: 48px 0;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 550px) {
    background-size: 289px 167px;
    background-position-y: 50px;
    padding: 38px 0;
  }

  @media (max-width: 400px) {
    background-image: none;
    padding-top: 0;
  }
`;

const LoadingBox = styled.div`
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Info = styled.div`
  width: 40%;
  max-width: 600px;
  padding: 100px 0 100px 100px;
  @media (max-width: 1220px) {
    width: 45%;
    padding: 90px 0 100px 50px;
  }
  @media (max-width: 1120px) {
    width: 40%;
    padding: 90px 0 100px 0px;
  }
  @media (max-width: 960px) {
    padding: 60px 0 70px 20px;
  }
  @media (max-width: 820px) {
    width: 55%;
  }
  @media (max-width: 760px) {
    padding: 35px 0 50px 0px;
  }
  @media (max-width: 660px) {
    margin-left: 105px;
    padding-top: 10px;
  }
  @media (max-width: 550px) {
    margin-left: 30px;
    padding-top: 45px;
    padding-bottom: 0;
    width: 400px;
  }
  @media (max-width: 400px) {
    margin-left: 0;
    padding-top: 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const SubLink = styled.p`
  font-size: 14px;
  letter-spacing: 1.5px;
  font-weight: 600;
  line-height: 33px;
  padding: 7px 15px 0;
  color: rgba(78, 90, 97, 1);
  opacity: 0.5;
  -webkit-transition: all 0.3s ease;
  -moz-transition: all 0.3s ease;
  transition: all 0.3s ease;
  cursor: pointer;
  &:hover {
    opacity: 1;
  }

  @media (max-width: 660px) {
    color: #ffffff;
    opacity: 0.7;
    line-height: 20px;
    margin: 15px 0;
  }

  @media (max-width: 400px) {
    color: #4e5a61;
  }
`;

const Tagline = styled.h2`
  display: none;
  font-size: 20px;
  font-weight: 400;

  @media (max-width: 660px) {
    display: block;
    position: absolute;
    top: 115px;
    right: 3vw;
    color: #4e5a61;
  }

  @media (max-width: 400px) {
    display: flex;
    position: static;
    align-self: center;
  }
`;

const Shapes = styled.div`
  width: 60%;

  background-image: url(/static/shapes/demo/shape-header-hero-text.svg);
  background-repeat: no-repeat;
  background-size: 439px 269px;
  background-position-x: 187px;
  display: flex;
  flex-direction: column;

  @media (max-width: 1220px) {
    background-position-x: 100px;
    background-size: 580px 260px;
  }

  @media (max-width: 1120px) {
    width: 60%;
    background-size: 500px 260px;
  }

  @media (max-width: 970px) {
    background-size: 478px 202px;
  }

  @media (max-width: 880px) {
    width: 70%;
    background-size: 370px 202px;
    background-position-x: 50px;
  }

  @media (max-width: 767px) {
    background-size: 319px 155px;
  }

  @media (max-width: 400px) {
    width: 100%;
    background-image: none;
  }
`;

const Shape = styled.img`
  position: absolute;
  z-index: -10;
`;

const Shape1 = styled(Shape)`
  transform: skew(75deg, -69deg);
  top: 300px;
  right: 73vw;
  width: 6%;

  @media (max-width: 1220px) {
    right: 73vw;
    top: 295px;
  }

  @media (max-width: 1120px) {
    top: 254px;
    right: 78vw;
  }

  @media (max-width: 970px) {
    top: 261px;
    right: 72vw;
  }

  @media (max-width: 880px) {
    top: 293px;
    right: 81vw;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;
