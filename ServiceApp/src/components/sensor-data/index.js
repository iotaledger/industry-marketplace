import React from 'react';
import styled from 'styled-components';
import SensorCard from './sensor-card.js';

export default ({ schema, sensorData }) => (
  <InfoCol>
    <CardWrapper>
      {
        sensorData.length > 0 && sensorData.map((data, i) =>
            <SensorCard index={i} key={i} packet={data} schema={schema} />
        )
      }
    </CardWrapper>
  </InfoCol>
)

const InfoCol = styled.main`
  position: relative;
  width: 880px;
  padding-left: 30px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 455px;
    width: 1px;
    height: 100%;
    background-color: #738fd4;

    @media (max-width: 1195px) {
      left: 245px;
    }

    @media (max-width: 470px) {
      left: 300px;
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
    align-items: center;
  }
`;
