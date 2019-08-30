import React from 'react';
import styled from 'styled-components';
import Card from './index.js';
import { eClassCatalog } from '../../config.json';

const Heading = ({ operation, type }) => {
  return (
    <Full>
      <Header>{operation}</Header>
      <StatusWrapper>
        <Status>
          {type}
        </Status>
      </StatusWrapper>
    </Full>
  );
}

const Asset = props => {
  const { asset } = props;
  
  function isValidGPS(gps) {
    const [lat, lon] = gps.split(',');
    const latRegex = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const lonRegex = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    
    if (latRegex.test(Number(lat)) && lonRegex.test(Number(lon))) {
        return true;
    }
    return false;
  }

  return (
    <Card
      header={Heading(asset)}
      asset={asset}
    >
      <CardContent>
        {
          asset.params && asset.params.length > 0 ? (
            <Row>
              {
                asset.params
                  .filter(({ idShort }) => !['preis', 'price'].includes(idShort))
                  .map(({ idShort, semanticId, value }) => (
                    <RowThird key={idShort}>
                      <RowLink
                        href={`${eClassCatalog}${semanticId.replace(/#/g, '%23')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Go to eCl@ss to see property specs"
                      >
                        {idShort}
                      </RowLink>
                      <Data>
                        {
                          typeof value === 'string' && isValidGPS(value)
                          ? ( <React.Fragment>
                                { value.toString() }
                              </React.Fragment>
                            )
                          : value.toString()
                        }
                      </Data>
                    </RowThird>
                ))
              }
            </Row>
          ) : null
        }
        <Row>
          <RowThird>
            <RowDesc>Requester Location</RowDesc>
            <Data>
              {asset.location || '--'}
            </Data>
          </RowThird>
          <RowThird>
            <RowDesc>Partner:</RowDesc>
              <Data>
                  { asset.partnerName && asset.partnerName.indexOf('did:iota:') === 0 
                    ? `${asset.partnerName.substr(9, 15)}...` 
                    : asset.partnerName
                  }
              </Data>
          </RowThird>
        </Row>
        <Row>
          <RowThird>
            <RowDesc>Contract begin:</RowDesc>
            <Data>{asset.startTime}</Data>
          </RowThird>
          <RowThird>
            <RowDesc>Contract end:</RowDesc>
            <Data>{asset.endTime}</Data>
          </RowThird>
          <RowThird>
            <RowDesc>Price (IOTA):</RowDesc>
            <Data>{asset.price}</Data>
          </RowThird>
        </Row>
      </CardContent>
    </Card>
  );
};

export default Asset;

const CardContent = styled.div`
  padding: 20px 0 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const RowThird = styled.div`
  padding: 10px 30px;
  display: inline-block;
  text-align: left;
  @media (min-width: 426px) {
    width: 50%;
  }
  @media (min-width: 950px) {
    width: 33.3%;
  }
`;

const Data = styled.p`
  font-size: 18px;
  line-height: 30px;
  margin-top: 4px;
  color: #313131;
`;

const RowDesc = styled.span`
  font: 16px 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: #B8B8B8;
  text-transform: uppercase;
`;

const RowLink = styled.a`
  font: 16px 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: #529FF8;
  text-transform: uppercase;
`;

const Header = styled.h2`
  font-size: 24px;
  font-weight: 600;
  position: relative;
  color: #009fff;
  text-transform: uppercase;
  text-decoration: underline;
`;

const Full = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Status = styled.h3`
  color: #313131;
  font: 18px 'Nunito Sans', sans-serif;
  text-transform: uppercase;
  @media (min-width: 769px) {
    text-align: right;
  }
`;
