import React from 'react';
import styled from 'styled-components';
import Card from './index.js';

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
  
  return (
    <Card header={Heading(asset)} asset={asset}>
      <CardContent>
        {
          asset.params && asset.params.length > 0 ? (
            <Row>
            {
              asset.params.map(({ idShort, value }) => (
                <RowThird key={idShort}>
                  <RowDesc>{idShort}</RowDesc>
                  <Data>{value}</Data>
                </RowThird>
              ))
            }
            </Row>
          ) : null
        }
        <Row>
          <RowThird>
            <RowDesc>Coordinates</RowDesc>
            <Data>
              {asset.latitude.toFixed(5)}, {asset.longitude.toFixed(5)}
            </Data>
          </RowThird>
          <RowThird>
            <RowDesc>Location</RowDesc>
            <Data>
              {asset.location || '--'}
            </Data>
          </RowThird>
          <RowThird>
            <RowDesc>Sender:</RowDesc>
            <Data>{asset.sender}</Data>
          </RowThird>
        </Row>
        <Row>
          <RowThird>
            <RowDesc>Begin Time:</RowDesc>
            <Data>{asset.startTime}</Data>
          </RowThird>
          <RowThird>
            <RowDesc>End Time:</RowDesc>
            <Data>{asset.endTime}</Data>
          </RowThird>
          <RowThird>
            <RowDesc>Receiver:</RowDesc>
            <Data>{asset.receiver}</Data>
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
`;

const RowThird = styled.div`
  width: 33.3%;
  padding: 10px 30px;
  display: inline-block;
  text-align: left;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Status = styled.h3`
  color: #529FF8;
  font: 18px 'Nunito Sans', sans-serif;
  font-weight: 600;
  text-align: right;
  text-transform: uppercase;
`;
