import React from 'react';
import styled from 'styled-components';
import { Marker } from 'react-map-gl';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assets: [] };

    this.sanitiseCoordinates = this.sanitiseCoordinates.bind(this);
    this.sanatiseAsset = this.sanatiseAsset.bind(this);
  }

  componentDidMount() {
    const assets = [];
    this.props.assets.forEach(async asset => {
      const coordinates = asset.coordinates;
      assets.push({ ...asset, latitude: coordinates[0], longitude: coordinates[1] });
    });
    this.setState({ assets });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.assets.length > 0) return;
    const assets =
      nextProps.assets.length > 0
        ? [
            ...nextProps.assets.filter(asset => this.sanatiseAsset(asset)).map(asset => {
              asset.latitude = this.sanitiseCoordinates(asset.latitude);
              asset.longitude = this.sanitiseCoordinates(asset.longitude);
              return asset;
            }),
          ]
        : [];
    this.setState({ assets });
  }

  sanitiseCoordinates(coordinate) {
    return typeof coordinate === 'number' ? coordinate : Number(coordinate.replace(/[^0-9.]/g, ''));
  }

  sanatiseAsset(asset) {
    if (!asset.longitude || !asset.latitude) return false;
    if (asset.latitude >= 90 || asset.latitude <= -90) return false;
    if (asset.longitude >= 180 || asset.longitude <= -180) return false;
    return true;
  };

  render() {
    const { assets } = this.state;
    return (
      <div>
        {assets &&
          assets.map((asset, i) => (
            <Marker latitude={asset.latitude} longitude={asset.longitude} key={`marker-${i}`}>
              <Pin onClick={() => this.props.openPopup(asset)} />
            </Marker>
          ))}
      </div>
    );
  }
}

const Pin = styled.div`
  background-image: linear-gradient(-140deg, #184490 0%, #0a2056 100%);
  position: absolute;
  height: 20px;
  width: 20px;
  top: -20px;
  right: -10px;
  transform: rotate(-45deg);
  border-radius: 50% 50% 50% 0;
  cursor: pointer !important;
  box-shadow: -10px 9px 12px 0 rgba(10, 32, 87, 0.12);
`;
