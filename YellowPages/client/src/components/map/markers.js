import React from 'react';
import styled from 'styled-components';
import { Marker } from 'react-map-gl';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assets: props.assets };
  }

  componentDidUpdate(prevProps) {
    if (this.props.assets.length !== prevProps.assets.length) {
      this.setState({ assets: this.props.assets });
    }
  }

  render() {
    const { assets } = this.state;

    return (
      <div>
        {assets &&
          assets.map((asset, i) => (
            <Marker latitude={asset.latitude} longitude={asset.longitude} key={`marker-${i}`}>
              <Pin
                onClick={() => this.props.openPopup(asset)} 
                type={asset.type}
              >
                { asset.type === 'callForProposal' && <I className="fas fa-euro-sign"></I> }
                { asset.type === 'proposal' && <I className="fas fa-exclamation"></I> }
                { asset.type === 'acceptProposal' && <I className="fas fa-check"></I> }
              </Pin>
            </Marker>
          ))}
      </div>
    );
  }
}

const Pin = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case 'proposal':
        return '#009fff';
      case 'acceptProposal':
        return '#53aca8';
      case 'callForProposal':
      default:
        return '#184490';
    }
  }};
  position: absolute;
  height: 40px;
  width: 40px;
  top: -30px;
  right: -15px;
  transform: rotate(-45deg);
  border-radius: 50% 50% 50% 0;
  cursor: pointer !important;
  box-shadow: -10px 9px 12px 0 rgba(10, 32, 87, 0.12);
`;

const I = styled.i`
  position: absolute;
  height: 40px;
  right: 0px;
  transform: rotate(45deg);
  color: #ffffff;

  &.fa-euro-sign {
    width: 38px;
    top: 18px;
  }
  &.fa-exclamation {
    width: 37px;
    top: 21px;
  }
  &.fa-check {
    width: 40px;
    top: 18px;
  }
`;