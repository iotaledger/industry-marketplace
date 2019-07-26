import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { stringify } from 'query-string';
import AssetNav from '../components/asset-nav';
import Loading from '../components/loading';
import List from '../components/messages-list';
import SensorData from '../components/sensor-data';
import { fetch } from '../utils/mam';
import api from '../utils/api';
import { readFromStorage } from '../utils/storage';
import { sensorDataDomain } from '../config.json';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      sensorData: [],
      loading: false,
    };
  }

  async componentDidMount() {
    const { match: { params: { conversationId } } } = this.props;
    if (conversationId) {
      const data = await api.get('mam', { conversationId });
      if (data.root) {
        this.setState({ loading: true });
        fetch(data.root, data.side_key, this.appendToMessages, this.fetchComplete);
      }

      const { sensorData: { deviceId, userId }} = await readFromStorage(conversationId);
      const querystring = `${stringify({ deviceId, userId })}`;
      const result = await axios.get(`${sensorDataDomain}${querystring}`);
      const sensorDataSources = result.data;
      if (sensorDataSources.length > 0) {
        this.setState({ loading: true });
        sensorDataSources.forEach(async ({ root, sidekey }) =>
          await fetch(root, sidekey, this.appendToSensorData, this.fetchComplete)
        );
      };
    }
  }

  appendToMessages = message => this.setState({ messages: [...this.state.messages, message] });
  appendToSensorData = data => {
    const sensorData = [...this.state.sensorData, data]
      .sort((a, b) => b.time - a.time);
    this.setState({ sensorData })
  };

  fetchComplete = () => this.setState({ loading: false });

  render() {
    const { loading, messages, sensorData } = this.state;

    return (
      <Main>
        <AssetNav back />
        <Data>
          {
            loading ? (
              <LoadingBox>
                <Loading />
              </LoadingBox>
            ) : (
              <React.Fragment>
                <Wrapper>
                  {messages.length > 0 ? <List messages={messages} /> : null}
                </Wrapper>
                <Wrapper>
                  {sensorData.length > 0 ? <SensorData sensorData={sensorData} /> : null}
                </Wrapper>
              </React.Fragment>
            )
          }
        </Data>
      </Main>
    );
  }
}

export default Details;

const Main = styled.main`
  height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1092px;
  width: 100%;
  margin: 20px auto 50px;

  @media (max-width: 1092px) {
    .content {
      padding: 0 20px;
    }
  }

  @media (max-width: 500px) {
    .content {
      margin-top: 0;
      padding: 0 10px;
    }
  }
`;

const Data = styled.section`
  background-image: linear-gradient(-189deg, #06236c 1%, #1449c6 95%);
  min-height: 90vh;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const LoadingBox = styled.div`
  margin: auto;
`;
