import React, { useContext } from 'react';
import styled from 'styled-components';
import upperFirst from 'lodash-es/upperFirst'; 
// import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import { AssetContext } from '../../pages/dashboard';
import Card from './index.js';

const Heading = ({ id, operation }) => {
  return (
    <Full>
      <AssetCategory>{operation}</AssetCategory>
      <Link to={`/history/${id}`}>
        <AssetId>{operation}</AssetId>
      </Link>
    </Full>
  );
}

const Footer = ({ assetId }) => {
  const { history } = useContext(AssetContext);
  if (!history) return null;

  return (
    <React.Fragment>
      <FootRow>
        {
          history && (
            <FooterButton onClick={() => history(assetId)}>
              History
            </FooterButton>
          )
        }
      </FootRow>
    </React.Fragment>
  );
}

const Asset = props => {
  const { asset, disableMargin } = props;
  console.log('Asset', asset);
  
  return (
    <Card
      header={Heading(asset, props.cancel)}
      footer={Footer(asset)}
      asset={asset}
      disableMargin={disableMargin}
    >
      {
        asset.params && asset.params.length > 0 ? (
          <Row>
          {
            asset.params.map(({ idShort, value }) => (
              <RowThird key={idShort}>
                <RowDesc>{upperFirst(idShort)}:</RowDesc>
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
            {asset.location || '--'}
          </Data>
        </RowThird>
        <RowThird>
          <RowDesc>Location</RowDesc>
          <Data>
            {asset.location || '--'}
          </Data>
        </RowThird>
        <RowThird>
          <RowDesc>Partner ID:</RowDesc>
          <Data>{asset.partner}</Data>
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
          <RowDesc>Price:</RowDesc>
          <Data>{asset.price}</Data>
        </RowThird>
      </Row>
    </Card>
  );
};

export default Asset;

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
  padding: 5px 30px;
  display: inline-block;
  text-align: left;
`;

const Data = styled.p`
  font-size: 18px;
  line-height: 30px;
  margin-top: 4px;
`;

const RowDesc = styled.span`
  font: 12px/16px 'Nunito Sans', sans-serif;
  color: #808b92;
`;

const AssetCategory = styled.span`
  font: 16px 'Nunito Sans', sans-serif;
  text-transform: uppercase;
  position: absolute;
  top: -8px;
  color: #808b92;
`;

const AssetId = styled.span`
  font-size: 24px;
  top: 6px;
  line-height: 42px;
  position: relative;
  color: #009fff;
`;

const Full = styled.div`
  width: 100%;
`;

const FootRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: default;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;

const FooterButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 16px 'Nunito Sans', sans-serif;
  letter-spacing: 0.47px;
  padding: 12px 21px;
  border-radius: 100px;
  color: #009fff;
  background-color: #ffffff;
  border: 1px solid #009fff;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0.38px;
  width: 150px;
  height: 45px;

  &:hover {
    color: #ffffff;
    background-color: #009fff;
  }
`;

