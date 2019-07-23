import React from 'react';
import styled from 'styled-components';
import { Marker } from 'react-map-gl';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assets: props.assets };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.assets.length > 0) {
      this.setState({ assets: nextProps.assets });
    }
  }

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
