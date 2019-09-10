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
  padding-left: 30px;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const RowThird = styled.div`
  padding: 10px 0;
  display: inline-block;
  text-align: left;
  width: 32%;
  @media (max-width: 950px) {
    width: 50%;
  }
  @media (max-width: 520px) {
    width: 100%;
  }
`;

const Data = styled.p`
  font-size: 16px;
  line-height: 30px;
  margin-top: 4px;
  color: #485776;
`;

const RowDesc = styled.span`
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
  color: #485776;
  text-transform: uppercase;
`;

const RowLink = styled.a`
  font-size: 14px;
  line-height: 17px;
  font-weight: 600;
  color: #4140DF;
  text-transform: uppercase;
`;

const Header = styled.h2`
  font-family: 'Inter';
  font-size: 21px;
  font-weight: 500;
  line-height: 25px;
  position: relative;
  color: #485776;
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
  font-family: 'Inter';
  font-size: 21px;
  font-weight: 500;
  line-height: 25px;
  position: relative;
  color: #485776;
  opacity: 0.5;
  @media (min-width: 769px) {
    text-align: right;
  }
`;
