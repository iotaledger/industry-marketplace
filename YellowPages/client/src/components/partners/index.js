import React from 'react';
import styled from 'styled-components';
import upperFirst from 'lodash-es/upperFirst';

const partners = [
  { src: 'eclass.png', alt: 'eCl@ss' },
  { src: 'hamburg.png', alt: 'Helmut Schmidt Universität Hamburg' },
  { src: 'ovgu.png', alt: 'Otto-von-Guericke-Universität Magdeburg' },
  { src: 'neoception.png', alt: 'neoception' },
  { src: 'wewash.png', alt: 'WeWash' },
  { src: 'i40.png', alt: 'Industrie 4.0' }
];

export default class extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.anchor) {
      const target = document.querySelector(`#${nextProps.anchor}`);
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  render() {
    return (
      <Section id="participants">
        <Div>
          <P>Selected Participants</P>
          <Ul>
            {partners.map(({ alt, src, height = null, width = null }) => (
              <Li key={alt}>
                <Img
                  src={`/static/logotypes/${src}`}
                  srcSet={`/static/logotypes/${src} 2x`}
                  alt={upperFirst(alt)}
                  height={height}
                  width={width}
                />
              </Li>
            ))}
          </Ul>
        </Div>
      </Section>
    );
  }
}

const Section = styled.section`
  background-image: linear-gradient(-189deg, #eaf0f4 1%, #f3f8fa 95%);
  padding: 40px 0 20px;
  margin: 50px 0 -50px;
  @media (max-width: 760px) {
    padding-bottom: 20px;
  }
`;

const Div = styled.div`
  width: 100%;
  max-width: 1440px;
  padding: 0 15px;
  margin-right: auto;
  margin-left: auto;
`;

const P = styled.p`
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.84px;
  text-align: center;
  text-transform: uppercase;
  color: rgba(137, 156, 166, 1);

  @media (max-width: 760px) {
    margin-bottom: 40px;
  }
`;

const Ul = styled.ul`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 40px auto;
  width: 80%;
  list-style: none;
  @media (max-width: 1120px) {
    justify-content: space-around;
  }
  @media (max-width: 760px) {
    flex-flow: row wrap;
    margin: 0 auto;
  }
`;

const Li = styled.li`
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  vertical-align: baseline;
  @media (max-width: 1120px) {
    &:not(:last-of-type) {
      margin-right: 0;
    }
  }
  @media (max-width: 760px) {
    margin-bottom: 40px;
  }
`;

const Img = styled.img`
  max-width: ${props => (props.width ? `${props.width}px` : '200px')};
  max-height: ${props => (props.height ? `${props.height}px` : '120px')};
  padding: 10px 15px;
`;
