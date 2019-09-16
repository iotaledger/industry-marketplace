import React from 'react';
import ReactGA from 'react-ga';
import styled from 'styled-components';
import MapGL, { Popup, NavigationControl } from 'react-map-gl';
import '../../assets/styles/mapbox.scss';
import Controls from './controls';
import Markers from './markers';
import Text from '../Text'
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
      mapHeight: 640,
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

  componentDidUpdate(prevProps) {
    if (this.props.assets.length !== prevProps.assets.length) {
      this.setState({ assets: this.props.assets });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  resize() {
    const mapHeight = window.innerWidth < 760 ? 440 : 640;

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
        <div className="popup-card">
          <div className="popup-header">
            <span className="type">
              {popupInfo.type}{' '}
            </span>
            <span className="operation">
              {popupInfo.operation}
            </span>
          </div>
          <div className="popup-body">
            <div className="popup-data">
              <span className="key">Owner</span>
              <span className="value">{popupInfo.partnerName}</span>
            </div>
            <div className="popup-data">
              <span className="key">Location</span>
              <span className="value">{popupInfo.location}</span>
            </div>
            <div className="popup-data">
              <span className="key">Price</span>
              <span className="value">{popupInfo.price}</span>
            </div>
          </div>
        </div>
      </Popup>
    )
  }

  openPopup(asset) {
    this.setState({ popupInfo: asset });
  }

  render() {
    const { assets, viewport, mapHeight, popupInfo } = this.state;

    return (
      <Main className="map">
        {
          window.location && window.location.pathname === '/demo' && (
            <div className="header">
              <Text className="title">Request map</Text>
              <Text className="info">Click on a pin to view the request information.</Text>
            </div>
          )
        }
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
