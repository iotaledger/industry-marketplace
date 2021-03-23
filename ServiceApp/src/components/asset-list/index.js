import React from 'react';
import styled from 'styled-components';
import AssetCard from '../card/asset';
import NoRequests from '../no-requests';

export default props => {
  const assets = props.assets;

  return (
    <React.Fragment>
      <CountTrustWrapper>
        <CountWrapper>
          Active: {assets.length}
        </CountWrapper>
      </CountTrustWrapper>
      {
        assets && assets.length ? (
          <InfoCol>
            <CardWrapper>
              {
                assets && assets.map(asset => (
                  <AssetCard key={asset.storageId ? asset.storageId : asset.id} asset={asset} />
                ))
              }
            </CardWrapper>
          </InfoCol>
        ) : <NoRequests />
      }
    </React.Fragment>
  )
}

const CountTrustWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 40px 40px 0;
`;

const CountWrapper = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #485776;
`;

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
  padding: 40px;
  @media (max-width: 1195px) {
    flex-flow: column nowrap;
    padding-bottom: 0;
  }
  @media (max-width: 760px) {
    width: 100%;
    align-items: center;
  }
`;
