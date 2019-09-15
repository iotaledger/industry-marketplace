import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import format from 'date-fns/format'
import { trytesToAscii } from '@iota/converter';
import Mam from '@iota/mam';
import { provider } from '../../config.json';

Mam.init(provider);

const SensorCard = ({ schema, packet }) => {
  const [sensorData, setSensorData] = useState({});
  const [visible, toggleVisible] = useState(false);
  const [layoutArray, setLayoutArray] = useState([]);

  useEffect(() => {
    (async () => {
      // Organize data for layout
      const layout = [];
      let schema_json = typeof schema === 'string' ? JSON.parse(schema) : schema;
      schema_json.forEach((item, i) => {
        if (!layout[Math.floor(i / 2)]) {
          layout[Math.floor(i / 2)] = [];
        }
        layout[Math.floor(i / 2)].push(item);
      });
      setLayoutArray(layout);

      return new Promise(async (resolve, reject) => {
        try {
          const result = await Mam.fetchSingle(packet.root, 'restricted', packet.sidekey);
          const newData = await JSON.parse(trytesToAscii(result.payload));
          setSensorData(newData);
          setTimeout(() => toggleVisible(true), 300);
          return resolve();
        } catch (error) {
          console.log('MAM fetch error', error);
          return reject();
        }
      });
    })();
  }, []);

  return (
    <SensorCardWrapper visible={visible}>
      {
        sensorData.time && (
          <CardHeader>
            <HeaderRow>
              <HeaderAccent>{format(sensorData.time, 'dddd')}</HeaderAccent>{' '}
              {format(sensorData.time, 'DD MMMM, YYYY H:mm a ')}
            </HeaderRow>
          </CardHeader>
        )
      }
      {
        sensorData.data && layoutArray.map((row, i) => (
          <Row key={`sensor-${i}`}>
            {row.map((item, i) => (
              <RowHalf key={`item-${i}`}>
                <RowDesc>{item && item.name}:</RowDesc>
                <RowValue>
                  {(sensorData.data[item.id] !== typeof 'object' &&
                    (sensorData.data[item.id].toString() || sensorData.data[item.id.toLowerCase()])) ||
                    JSON.stringify(sensorData.data, null, 2)
                  }
                  <RowUnit>{item && item.unit}</RowUnit>
                </RowValue>
              </RowHalf>
            ))}
          </Row>
        ))
      }
    </SensorCardWrapper>
  );
}

export default SensorCard;

const SensorCardWrapper = styled.div`
  position: relative;
  width: 360px;
  padding-top: 20px;
  border: 1px solid #eaecee;
  border-radius: 6px;
  margin-bottom: 30px;
  background-color: #fff;
  cursor: pointer;
  transition: box-shadow 0.19s ease-out;
  width: 390px;
  border: none;
  cursor: default;
  box-shadow: 0 10px 24px 0 rgba(0, 0, 0, 0.2);
  transition: all 0.6s ease;
  opacity: ${props => (props.visible ? 1 : 0)};
  transform: ${props => (props.visible ? 'translateY(0)' : `translateY(50px)`)};
  &:nth-child(2n) {
    top: 70px;
  }
  &::before {
    content: '';
    position: absolute;
    right: -12px;
    top: 0;
    border-top: 10px solid #fff;
    border-right: 12px solid transparent;
    border-left: 12px solid transparent;
    @media (max-width: 1195px) {
      right: auto;
      left: -12px;
    }
  }
  &:nth-child(2n)::before {
    right: auto;
    left: -12px;
  }
  &::after {
    content: '';
    position: absolute;
    top: -5px;
    right: -41px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #4140DF;
    box-shadow: 0 2px 10px 0 rgba(0, 159, 255, 0.4);
    @media (max-width: 1195px) {
      left: -36px;
    }
  }
  &:nth-child(2n)::after {
    right: auto;
    left: -40px;
  }
  @media (max-width: 1195px) {
    margin-bottom: 30px;
    &:nth-child(2n) {
      top: 0;
    }
    &:nth-child(2n)::after {
      left: -36px;
    }
  }
  @media (max-width: 1120px) {
    margin-bottom: 20px;
  }
  @media (max-width: 470px) {
    width: 280px;
    padding-top: 10px;
    margin-bottom: 10px;
  }
`;

const CardHeader = styled.header`
  position: relative;
  padding: 0 30px 8px 30px;
  border-bottom: 1px solid #eaecee;
`;

const HeaderRow = styled.p`
  font: 12px/16px 'Nunito Sans', sans-serif;
  color: #808b92;
`;

const HeaderAccent = styled.span`
  font-size: 18px;
  line-height: 33px;
  margin-right: 10px;
  color: #4140DF;
  @media (max-width: 470px) {
    display: block;
  }
`;

const Row = styled.div`
  &:not(:last-of-type) {
    border-bottom: 1px solid #eaecee;
  }
  @media (max-width: 470px) {
    &:not(:last-of-type) {
      border: none;
    }
    &:first-of-type {
      padding-top: 10px;
    }
  }
  &:last-of-type {
    padding-bottom: 10px;
  }
`;

const RowHalf = styled.div`
  padding: 20px 30px 8px;
  display: inline-block;
  &:first-child {
    width: 195px;
    border-right: 1px solid #eaecee;
  }
  @media (max-width: 760px) {
    &:first-child {
      border: none;
    }
  }
  @media (max-width: 470px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0 20px;
    &:first-child {
      width: 100%;
    }
    &:not(:last-of-type) {
      border: none;
    }
  }
`;

const RowDesc = styled.span`
  font: 12px/16px 'Nunito Sans', sans-serif;
  color: #808b92;
  margin: 0;
`;

const RowValue = styled.p`
  font-size: 26px;
  font-weight: 800;
  line-height: 42px;
  @media (max-width: 470px) {
    width: 53%;
    font-size: 20px;
    line-height: 0;
  }
`;

const RowUnit = styled.span`
  font-size: 14px;
  font-weight: 400;
  line-height: 42px;
  position: relative;
  top: -8px;
  right: -4px;
  @media (max-width: 470px) {
    line-height: 30px;
    top: -4px;
  }
`;