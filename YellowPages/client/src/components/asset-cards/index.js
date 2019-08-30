import React from 'react';
import styled from 'styled-components';
import AssetCard from '../card/asset';

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = { assets: [], slideIndex: 0 };

    this.shift = this.shift.bind(this);
  }

  componentDidMount() {
    this.setState({ assets: this.props.assets });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ assets: nextProps.assets });
    if (nextProps.anchor) {
      const target = document.querySelector(`#${nextProps.anchor}`);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
      <Section id="list">
        <Header>
          <Heading>Recent requests</Heading>
        </Header>
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
        <Nav>
          <Button type="button" onClick={() => slideIndex > 0 && this.shift('left')}>
            <Arrow active={slideIndex > 0}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                <polygon
                  fill="#CEDBE2"
                  fillRule="evenodd"
                  points="36.867 22.18 36.867 23.82 26.707 23.82 31.367 28.5 30.188 29.68 23.508 23 30.188 16.32 31.367 17.5 26.707 22.18"
                  transform="translate(-23 -16)"
                />
              </svg>
            </Arrow>
          </Button>
          <Button
            type="button"
            onClick={() => slideIndex < Object.keys(assets).length - 1 && this.shift('right')}>
            <Arrow
              style={{ transform: 'rotate(180deg)' }}
              active={slideIndex < Object.keys(assets).length - 1}>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14">
                <polygon
                  fill="#CEDBE2"
                  fillRule="evenodd"
                  points="36.867 22.18 36.867 23.82 26.707 23.82 31.367 28.5 30.188 29.68 23.508 23 30.188 16.32 31.367 17.5 26.707 22.18"
                  transform="translate(-23 -16)"
                />
              </svg>
            </Arrow>
          </Button>
        </Nav>
        <Shape src="/static/shapes/shape-main-2.svg" className="shape-accent-2" alt="Shape svg" />
      </Section>
    );
  }
}

const Shape = styled.img`
  position: absolute;
  top: -60px;
  left: 70vw;
  z-index: -100;
  @media (max-width: 1120px) {
    bottom: 100px;
    left: 36vw;
  }
  @media (max-width: 760px) {
    display: none;
  }
`;

const Section = styled.section`
  position: relative;
  padding-top: 90px;
  border-top: 1px solid #eaecee;
  padding-bottom: 90px;
  margin-bottom: 120px;
  overflow-y: hidden;
  overflow-x: hidden;
  min-height: 600px;

  @media (max-width: 760px) {
    padding-top: 40px;
  }

  @media (max-width: 1120px) {
    padding-top: 50px;
  }
`;

const Header = styled.header`
  margin-bottom: 30px;
  @media (max-width: 760px) {
    margin-bottom: 20px;
  }
`;

const Heading = styled.h3`
  font-size: 28px;
  font-weight: 100;
  line-height: 42px;
  margin-bottom: 12px;
  text-align: center;
  text-transform: capitalize;
  color: #009fff;
  @media (max-width: 760px) {
    font-size: 24px;
    margin-bottom: 0;
  }
`;

const SlideWrapper = styled.div`
  position: relative;
  height: auto;
  transition: all 0.4s ease;
  overflow-x: hidden;
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
  margin: 30px 0;
  text-align: center;
  @media (max-width: 1120px) {
    margin-top: 20px;
  }
`;

const Button = styled.button`
  position: relative;
  width: 60px;
  height: 46px;
  border-radius: 100px;
  margin: 0 5px;
  border: none;
  padding: 0;
  outline: none;
  cursor: pointer;
  &:active {
    background-color: #009fff;
    box-shadow: 0 16px 25px 0 rgba(0, 159, 255, 0.27);
    svg {
      polygon {
        fill: #fff;
      }
    }
  }
  border: 1px solid #eaecee;
  color: #808b92;
  background-color: #fff;
`;

const Arrow = styled.div`
  polygon {
    fill: ${props => (props.active ? '#009fff' : '#cedbe2')};
  }
`;
