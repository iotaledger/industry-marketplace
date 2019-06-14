import React, { useContext } from 'react';
import styled from 'styled-components';
import format from 'date-fns/format';
import { Link } from 'react-router-dom';
import { AssetContext } from '../../pages/dashboard';
import Card from './index.js';

const Heading = ({ assetId, active, assetName, category }) => {
  const { deleteAsset } = useContext(AssetContext);
  return (
    <Full>
      <AssetCategory>{category.replace(/s([^s]*)$/,'')}</AssetCategory>
      <Link to={`/order/${assetId}`}>
        <AssetId>{assetName.length > 20 ? `${assetName.substr(0, 20)}...` : assetName}</AssetId>
      </Link>
      {
        active && deleteAsset ? (
          <Delete onClick={() => deleteAsset(assetId, category)}>
            <IconButton src="/static/icons/icon-delete.svg" />
          </Delete>
        ) : null
      }
    </Full>
  );
}

const Footer = ({ assetId, active, category }) => {
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

  return (
    <Card
      header={Heading(asset, props.delete)}
      footer={Footer(asset)}
      asset={asset}
      disableMargin={disableMargin}
    >
      <Row>
        <RowHalf>
          <RowDesc>Asset Type:</RowDesc>
          <Data>{asset.type}</Data>
        </RowHalf>
        <RowHalf>
          <RowDesc>
            {asset.category === 'offers' ? 'Asset' : 'Service'} Provider:
          </RowDesc>
          <Data>{asset.company}</Data>
        </RowHalf>
      </Row>
      {
        asset.startTimestamp && asset.endTimestamp ? (
          <Row>
            <RowHalf>
              <RowDesc>Begin Time:</RowDesc>
              <Data>{format(Number(asset.startTimestamp), 'HH:mm - DD.MM.YY')}</Data>
            </RowHalf>
            <RowHalf>
              <RowDesc>End Time:</RowDesc>
              <Data>{format(Number(asset.endTimestamp), 'HH:mm - DD.MM.YY')}</Data>
            </RowHalf>
          </Row>
        ) : null
      }
      <Row>
        <RowHalf>
          <RowDesc>Location</RowDesc>
          <Data>
            {asset.location.city && asset.location.country
              ? `${asset.location.city}, ${asset.location.country}`
              : '--'}
          </Data>
        </RowHalf>
        <RowHalf>
          <RowDesc>Price:</RowDesc>
          <Data>{asset.price}</Data>
        </RowHalf>
      </Row>
      {
        asset.dataTypes && asset.dataTypes.length > 0 ? (
          <Row>
          {
            asset.dataTypes.map(({ name, value }) => (
              <RowHalf key={name}>
                <RowDesc>{name}:</RowDesc>
                <Data>{value}</Data>
              </RowHalf>
            ))
          }
          </Row>
        ) : null
      }
      {
        asset.assetDescription ? (
          <RowFull>
            <RowDesc>Asset Description:</RowDesc>
            <Data>
              {
                asset.assetDescription.length > 120
                ? `${asset.assetDescription.substr(0, 120)}...`
                : asset.assetDescription
              }
            </Data>
          </RowFull>
        ) : null
      }
    </Card>
  );
};

export default Asset;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;

const RowFull = styled.div`
  padding: 5px 30px;
  display: inline-block;
  text-align: left;
  width: 100%;

  @media (max-width: 400px) {
    border: none;
    padding-left: 20px;
    padding-right: 0;
  }
`;

const RowHalf = styled.div`
  width: 50%;
  padding: 5px 30px;
  display: inline-block;
  :nth-child(even) {
    text-align: right;
  }
  :nth-child(odd) {
    text-align: left;
  }
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

const Delete = styled.span`
  position: absolute;
  display: flex;
  align-items: center;
  top: 10px;
  right: 30px;
`;

const IconButton = styled.img`
  height: 20px;
  width: 20px;
  cursor: pointer;
  opacity: 1;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.4;
  }
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

const ButtonSelect = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 16px 'Nunito Sans', sans-serif;
  letter-spacing: 0.47px;
  padding: 12px 21px;
  border-radius: 100px;
  color: ${props => (props.selected ? '#009fff' : '#ffffff')};
  background-color: ${props => (props.selected ? '#ffffff' : '#009fff')};
  border: ${props => (props.selected ? '1px solid #009fff' : 'none')};
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0.38px;
  width: 400px;
  height: 45px;

  &:hover {
    color: ${props => (props.selected ? '#ffffff' : '#009fff')};
    background-color: ${props => (props.selected ? '#009fff' : '#ffffff')};
    border: 1px solid #009fff;
  }
`;
