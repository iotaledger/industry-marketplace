import React from 'react';
import styled from 'styled-components';
import AssetNav from '../components/asset-nav';
import Loading from '../components/loading';
import List from '../components/messages-list';
import { fetch } from '../utils/mam';
import api from '../utils/api';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
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
    }
  }

  appendToMessages = message => this.setState({ messages: [...this.state.messages, message] });

  fetchComplete = () => this.setState({ loading: false });

  render() {
    const { loading, messages } = this.state;

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
              <Wrapper>
                {messages.length > 0 ? <List messages={messages} /> : null}
              </Wrapper>
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
  @media (max-width: 760px) {
    flex-direction: column;
  }
`;

const LoadingBox = styled.div`
  margin: auto;
`;
