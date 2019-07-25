import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import MapGL, { Popup, NavigationControl } from 'react-map-gl';
import '../../assets/scss/mapbox.scss';
import Controls from './controls';
import Markers from './markers';
import { mapboxApiAccessToken, mapboxStyles } from '../../config.json';

const mapControls = new Controls();

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewport: {
        latitude: 52.23,
        longitude: 11.16,
        zoom: 3.74,
        bearing: 0,
        pitch: 15,
        width: 800,
        height: 900,
      },
      popupInfo: null,
      mapHeight: 900,
      assets: props.assets
    };

    this.openPopup = this.openPopup.bind(this);
    this.resize = this.resize.bind(this);
    this.renderPopup = this.renderPopup.bind(this);
    this.updateViewport = this.updateViewport.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.anchor) {
      const target = document.querySelector(`#${nextProps.anchor}`);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    if (nextProps.assets) {
      this.setState({ assets: nextProps.assets });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    const mapHeight = window.innerWidth < 760 ? 500 : 900;

    this.setState({
      viewport: {
        ...this.state.viewport,
        width: this.props.width || window.innerWidth,
        height: this.props.height || window.innerHeight,
      },
      mapHeight,
    });
  }

  trackRedirect = sensorId => {
    ReactGA.event({
      category: 'Map sensor redirect',
      action: 'Map sensor redirect',
      label: `Sensor ID ${sensorId}`
    });
  }

  updateViewport(viewport) {
    this.setState({
      viewport: { ...this.state.viewport, ...viewport },
    });
  }

  renderPopup() {
    const { popupInfo } = this.state;
    if (!popupInfo) return null;
    
    return (
      <Popup
        tipSize={10}
        anchor="bottom-left"
        offsetTop={-5}
        offsetLeft={5}
        closeButton={true}
        longitude={Number(popupInfo.longitude)}
        latitude={Number(popupInfo.latitude)}
        closeOnClick={false}
        onClose={() => this.setState({ popupInfo: null })}
      >
        <SensorCard>
          <CardHeader>
            <SensorType>
              {popupInfo.type}{' '}
              <LocationIcon
                src="/static/icons/icon-small-location-dark.svg"
                alt="Icon location pin"
              />{' '}
              <span>{popupInfo.location}</span>
            </SensorType>
            <SensorId>
              {popupInfo.operation}
            </SensorId>
          </CardHeader>
          <CardFooter>
            <FootRow>
              <InfoKey>Owner:</InfoKey>
              <InfoValue>{popupInfo.partner}</InfoValue>
            </FootRow>
            <FootRow>
              <InfoKey>Irdi:</InfoKey>
              <InfoValue>{popupInfo.irdi}</InfoValue>
            </FootRow>
            <FootRow>
              <InfoKey>Price:</InfoKey>
              <InfoValue>{popupInfo.price}</InfoValue>
            </FootRow>
          </CardFooter>
        </SensorCard>
      </Popup>
    )
  }

  openPopup(asset) {
    this.setState({ popupInfo: asset });
  }

  render() {
    const { assets, viewport, mapHeight, popupInfo } = this.state;

    return (
      <Main id="map">
        <Header>
          <div>
            <Heading>Sensor map</Heading>
            <Subtitle>Click on a pin to view the sensor information.</Subtitle>
          </div>
        </Header>
        <MapGL
          scrollZoom={false}
          controller={mapControls}
          maxZoom={11.5}
          {...viewport}
          height={mapHeight}
          mapStyle={mapboxStyles}
          onViewportChange={this.updateViewport}
          onClick={() => (popupInfo ? this.setState({ popupInfo: null }) : null)}
          mapboxApiAccessToken={mapboxApiAccessToken}>
          <div style={{ position: 'absolute', right: 20, top: 10 }}>
            <NavigationControl onViewportChange={this.updateViewport} />
          </div>
          <Markers assets={assets} openPopup={this.openPopup} />
          {this.renderPopup()}
        </MapGL>

        <HeaderBg
          src="/static/shapes/shape-main-1.svg"
          className="shape-accent-1 mobile-hidden"
          alt="Shape accent"
        />
        <HeaderBgMobile
          src="/static/shapes/shape-main-1-mobile.svg"
          className="shape-accent-1 desktop-hidden shape-mobile"
          alt="Shape accent"
        />
      </Main>
    );
  }
}

export default Map;

const Main = styled.div`
  position: relative;
  &::before {
    content: '';
    position: absolute;
    top: 74px;
    left: 0;
    height: 1px;
    width: 100vw;
    background-color: #eaecee;
    @media (max-width: 760px) {
      top: 0;
    }
  }
`;

const Header = styled.div`
  max-width: 1170px;
  padding: 0 15px;
  margin-right: auto;
  margin-left: auto;
  display: flex;
  justify-contents: center;
  width: 300px;
  position: absolute;
  z-index: 900;
  padding-top: 140px;
  @media (max-width: 760px) {
    padding-top: 50px;
  }
  @media (max-width: 520px) {
    width: 200px;
  }
  @media (max-width: 400px) {
    padding-top: 0;
    margin-top: -100px;
  }
`;

const Heading = styled.h3`
  text-transform: capitalize;
  text-align: left;
  color: #009fff;
  font-size: 28px;
  font-weight: 100;
  line-height: 42px;
  margin-bottom: 12px;
  @media (max-width: 760px) {
    font-size: 24px;
    margin-bottom: 0;
    margin-bottom: 10px;
  }
`;

const Subtitle = styled.h4`
  font-size: 19px;
  font-weight: 400;
  line-height: 33px;
  margin-bottom: 60px;
  max-width: 265px;
  color: #fff;
  text-align: left;
  @media (max-width: 1120px) {
    max-width: 215px;
  }
  @media (max-width: 760px) {
    font-size: 18px;
    line-height: 28px;
  }
`;

const HeaderBg = styled.img`
  position: absolute;
  top: -120px;
  right: 75vw;
  z-index: 800;
  @media (max-width: 1120px) {
    right: 67vw;
  }
  @media (max-width: 760px) {
    display: none;
  }
`;

const HeaderBgMobile = styled.img`
  position: absolute;
  top: -20px;
  right: 70vw;
  z-index: 800;
  display: none;
  @media (max-width: 1120px) {
    right: 67vw;
  }
  @media (max-width: 760px) {
    top: -100px;
    right: 55vw;
    display: block;
  }
  @media (max-width: 400px) {
    top: -250px;
    right: 50vw;
  }
`;

const SensorCard = styled.span`
  display: block;
  border-radius: 6px;
  transition: box-shadow 0.19s ease-out;
  position: relative;
  user-select: none;
  cursor: default;
  color: inherit;
  text-decoration: none;
  width: 280px;
  height: 150px;
  padding-top: 19px;
  border: none;
  background-color: #0e38a0;
  box-shadow: 0 14px 28px 0 rgba(10, 32, 87, 0.24);
  @media (max-width: 760px) {
    margin-bottom: 10px;
  }
`;

const CardHeader = styled.header`
  position: relative;
  padding: 0 30px 8px 30px;
  border-bottom: 1px solid rgba(115, 143, 212, 0.2);
`;

const CardFooter = styled.footer`
  padding: 20px 30px;
  padding: 8px 30px;
  border-top: none;
  background-color: transparent;
`;

const FootRow = styled.div`
  display: flex;
  justify-content: space-between;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;

const InfoKey = styled.span`
  color: #738fd4;
  text-transform: capitalize;
  font: 12px/16px 'Nunito Sans', sans-serif;
`;

const InfoValue = styled.span`
  font-size: 12px;
  line-height: 16px;
  font-weight: 400;
  color: #fff;
`;

const LocationIcon = styled.img`
  margin: 0 6px 0 13px;
`;

const SensorType = styled.span`
  font: 12px/16px 'Nunito Sans', sans-serif;
  position: absolute;
  top: -8px;
  color: #738fd4;
`;

const SensorId = styled.span`
  font-size: 20px;
  top: 4px;
  color: #fff;
  line-height: 42px;
  position: relative;
`;
