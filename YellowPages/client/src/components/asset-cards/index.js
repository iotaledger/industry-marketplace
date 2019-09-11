import React from 'react';
import styled from 'styled-components';
import AssetCard from '../card/asset';
import prev from '../../assets/img/demo/prev.svg';
import next from '../../assets/img/demo/next.svg';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assets: [], slideIndex: 0 };

    this.shift = this.shift.bind(this);
  }

  componentDidMount() {
    this.setState({ assets: this.props.assets });
  }

  componentDidUpdate(prevProps) {
    if (this.props.assets.length !== prevProps.assets.length) {
      this.setState({ assets: this.props.assets });
    }
  }

  shift(direction) {
    if (direction === 'right') {
      this.setState({ slideIndex: this.state.slideIndex + 1 });
    } else {
      this.setState({ slideIndex: this.state.slideIndex - 1 });
    }
  }

  render() {
    const { assets, slideIndex } = this.state;
    return (
      <React.Fragment>
        <Section id="list">
          <SlideWrapper index={slideIndex}>
            {assets && assets.map((asset, i) => (
              <Slide 
                index={i} 
                slide={slideIndex} 
                key={`${asset.storageId ? asset.storageId : asset.id}-${i}`}
              >
                <AssetCard asset={asset} />
              </Slide>
            ))}
          </SlideWrapper>
        </Section>
        <Nav>
          <Button 
            type="button" 
            onClick={() => slideIndex > 0 && this.shift('left')}
          >
            <img src={prev} alt="" />
          </Button>
          <Button
            type="button"
            onClick={() => slideIndex < Object.keys(assets).length - 1 && this.shift('right')}
          >
            <img src={next} alt="" />
          </Button>
        </Nav>
      </React.Fragment>
    );
  }
}

const Section = styled.section`
  position: relative;
  padding-top: 90px;
  overflow-y: hidden;
  overflow-x: hidden;

  @media (max-width: 760px) {
    padding-top: 40px;
  }

  @media (max-width: 1120px) {
    padding-top: 50px;
  }
`;

const SlideWrapper = styled.div`
  position: relative;
  height: auto;
  transition: all 0.4s ease;
`;

const slide = (index, slide) => {
  if (index === slide) {
    return '50%';
  }
  if (index > slide) {
    return '150%';
  } else {
    return '-150%';
  }
};

const Slide = styled.div`
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  justify-content: space-around;
  position: ${props => (props.index === props.slide ? 'relative' : 'absolute')};
  top: 0;
  left: ${props => slide(props.index, props.slide)};
  transform: translateX(-50%);
  transition: all 0.4s ease-out;
  width: 100%;
  max-width: 1170px;
  padding: 0 15px;
  @media (max-width: 1420px) {
    justify-content: space-around;
  }
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const Nav = styled.nav`
  margin: 10px 0 30px;
  text-align: center;
  @media (max-width: 890px) {
    position: absolute;
    bottom: 0;
    transform: translate(-50%, -50%);
    left: 50%;
  }
  @media (max-width: 1120px) {
    margin-top: 20px;
  }
`;

const Button = styled.button`
  outline: none;
  cursor: pointer;
  background: unset;
`;
