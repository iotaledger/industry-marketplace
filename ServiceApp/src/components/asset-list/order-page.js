import React from 'react';
import styled from 'styled-components';
import AssetCard from '../card/asset';

export default ({ assets, category }) => (
  <InfoCol>
    <CardWrapper id={category}>
      {
        assets && assets.map(asset => (
          <AssetCard key={asset.assetId} asset={asset} />
        ))
      }
    </CardWrapper>
  </InfoCol>
);

const InfoCol = styled.div`
  position: relative;

  @media (max-width: 760px) {
    width: 100%;
    padding: 0;
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  @media (max-width: 1195px) {
    flex-flow: column nowrap;
    padding-bottom: 0;
  }
  @media (max-width: 760px) {
    width: 100%;
    align-items: center;
  }
`;
