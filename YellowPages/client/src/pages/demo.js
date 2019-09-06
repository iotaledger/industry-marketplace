import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import get from 'lodash-es/get';
import Map from '../components/map';
import ScrollToTop from '../components/scroll-to-top';
import Cookie from '../components/cookie';
import AssetCards from '../components/asset-cards';
import AssetList from '../components/asset-list';
import Zmq from '../components/zmq';
import { getAll, getByType, removeExpired, writeToStorage } from '../utils/storage';
import { prepareData } from '../utils/card';
import { serviceRequester, serviceProvider } from '../config.json';

// const Header = ({ changeSection }) => {
//   return (
//     <Container>
//       <Info>
//         <SubLink
//           role="button"
//           onClick={() => changeSection('callForProposal')}
//         >
//           {'Calls for proposal'.toUpperCase()}
//         </SubLink>
//         <SubLink
//           role="button"
//           onClick={() => changeSection('proposal')}
//         >
//           {'Proposals'.toUpperCase()}
//         </SubLink>
//         <SubLink
//           role="button"
//           onClick={() => changeSection('acceptProposal')}
//         >
//           {'Accepted proposals'.toUpperCase()}
//         </SubLink>
//       </Info>
//     </Container>
//   );
// };

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
    const { assets, allAssets, activeSection } = this.state;
    const externalService = activeSection === 'proposal' ? serviceProvider : serviceRequester;

    return (
      <Main id="main">
        <Zmq callback={this.newMessage} />
        <Cookie />
        {
          assets.length === 0 ? (
            <NoProposals>
              There are currently no <strong>&nbsp;{activeSection}</strong>s, create a new one
              <a
                href={externalService}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong>&nbsp;here</strong>
              </a>
            </NoProposals>
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
            </React.Fragment>
          )
        }
        <Map assets={allAssets} />
        <ScrollToTop onClick={this.onScrollToTop} />
      </Main>
    );
  }
}

const Main = styled.div`
  overflow-x: hidden;
  display: block;
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

// const Container = styled.div`
//   display: flex;
//   width: 100%;
//   max-width: 1170px;
//   padding: 0 15px;
//   margin-right: auto;
//   margin-left: auto;
//   margin-bottom: 40px;

//   @media (max-width: 820px) {
//     margin-bottom: 80px;
//   }

//   @media (max-width: 660px) {
//     background-repeat: no-repeat;
//     background-size: 448px 209px;
//     padding: 48px 0;
//     display: flex;
//     flex-direction: column;
//   }

//   @media (max-width: 550px) {
//     background-size: 289px 167px;
//     background-position-y: 50px;
//     padding: 38px 0;
//   }

//   @media (max-width: 400px) {
//     background-image: none;
//     padding-top: 0;
//   }
// `;

const NoProposals = styled.div`
  min-height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-size: 22px;
`;

// const Info = styled.div`
//   width: 40%;
//   max-width: 600px;
//   padding: 100px 0 100px 100px;
//   @media (max-width: 1220px) {
//     width: 45%;
//     padding: 90px 0 100px 50px;
//   }
//   @media (max-width: 1120px) {
//     width: 40%;
//     padding: 90px 0 100px 0px;
//   }
//   @media (max-width: 960px) {
//     padding: 60px 0 70px 20px;
//   }
//   @media (max-width: 820px) {
//     width: 55%;
//   }
//   @media (max-width: 760px) {
//     padding: 35px 0 50px 0px;
//   }
//   @media (max-width: 660px) {
//     margin-left: 105px;
//     padding-top: 10px;
//   }
//   @media (max-width: 550px) {
//     margin-left: 30px;
//     padding-top: 45px;
//     padding-bottom: 0;
//     width: 400px;
//   }
//   @media (max-width: 400px) {
//     margin-left: 0;
//     padding-top: 0;
//     width: 100%;
//     display: flex;
//     flex-direction: column;
//     align-items: center;
//   }
// `;

// const SubLink = styled.p`
//   font-size: 14px;
//   letter-spacing: 1.5px;
//   font-weight: 600;
//   line-height: 33px;
//   padding: 7px 15px 0;
//   color: rgba(78, 90, 97, 1);
//   opacity: 0.5;
//   -webkit-transition: all 0.3s ease;
//   -moz-transition: all 0.3s ease;
//   transition: all 0.3s ease;
//   cursor: pointer;
//   &:hover {
//     opacity: 1;
//   }

//   @media (max-width: 660px) {
//     color: #ffffff;
//     opacity: 0.7;
//     line-height: 20px;
//     margin: 15px 0;
//   }

//   @media (max-width: 400px) {
//     color: #4e5a61;
//   }
// `;
