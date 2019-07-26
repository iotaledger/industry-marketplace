import React from 'react';
import styled from 'styled-components';
import SensorCard from './sensor-card.js';

export default ({ sensorData }) => (
  <InfoCol>
    <CardWrapper>
      {
        sensorData && sensorData.map((data, i) =>
            <SensorCard index={i} key={i} packet={data} />
        )
      }
    </CardWrapper>
  </InfoCol>
);

const InfoCol = styled.main`
  position: relative;
  width: 880px;
  padding-left: 30px;
  @media (max-width: 760px) {
    width: 100%;
    padding: 0;
  }
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 455px;
    width: 1px;
    height: 100%;
    background-color: #738fd4;
    @media (max-width: 1195px) {
      left: 30px;
    }
    @media (max-width: 760px) {
      visibility: hidden;
    }
  }
`;

const CardWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  padding: 40px 0 200px;
  @media (max-width: 1195px) {
    flex-flow: column nowrap;
    padding-bottom: 0;
    margin-left: 30px;
  }
  @media (max-width: 760px) {
    width: 100%;
    margin-left: 0;
    align-items: center;
  }
`;
