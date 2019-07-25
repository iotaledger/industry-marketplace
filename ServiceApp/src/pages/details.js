import React, { useState } from 'react';
import styled from 'styled-components';
import AssetNav from '../components/asset-nav';
import Loading from '../components/loading';

class Details extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      user: {},
      loading: false,
    };
  }

  async componentDidMount() {
    const { match: { params: { conversationId } } } = this.props;
    console.log('componentDidMount', conversationId);
  }


  render() {
    const { loading } = this.state;

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
                Hello
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
  width: 100%;
  margin: 50px;
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
