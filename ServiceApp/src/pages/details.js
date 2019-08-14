import React from 'react';
import axios from 'axios';
import styled from 'styled-components';
import isEmpty from 'lodash-es/isEmpty';
import { stringify } from 'query-string';
import AssetNav from '../components/asset-nav';
import Loading from '../components/loading';
import List from '../components/messages-list';
import SensorData from '../components/sensor-data';
import Cookie from '../components/cookie';
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
      schema: {},
      loading: true,
      loadingText: 'Fetching data from the Tangle. This will take a couple of seconds, do not close the window'
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

      const card = await readFromStorage(conversationId);
      if (!isEmpty(card.sensorData)) {
        const { sensorData: { deviceId, userId, schema }} = card;
        const querystring = `${stringify({ deviceId, userId })}`;
        const result = await axios.get(`${sensorDataDomain}${querystring}`);
        if (result.data.length > 0) {
          this.setState({ schema, sensorData: result.data });
        };
      }
    }
  }

  appendToMessages = message => this.setState({ messages: [...this.state.messages, message] });

  fetchComplete = () => this.setState({ loading: false });
  
  render() {
    const { loading, loadingText, messages, schema, sensorData } = this.state;

    return (
      <Main id="main">
        <AssetNav back />
        <Data>
          {
            loading ? (
              <LoadingBox>
                <Loading text={loadingText} delay={1500} />
              </LoadingBox>
            ) : (
              <React.Fragment>
                <Wrapper>
                  <Header>
                    Transaction history / Audit log
                  </Header>
                  { 
                    messages.length > 0 
                      ? <List messages={messages} /> 
                      : null
                  }
                </Wrapper>
                <Wrapper>
                  {
                    sensorData.length > 0
                      ? <SensorData sensorData={sensorData} schema={schema} /> 
                      : null
                  }
                </Wrapper>
              </React.Fragment>
            )
          }
        </Data>
        <Cookie />
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

const Header = styled.div`
  color: #ffffff;
  font-size: 24px;
  margin-bottom: 40px;
  text-align: left;
  width: 80%;
  margin-left: 30px;
`;