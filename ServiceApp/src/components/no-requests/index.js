import React from 'react';
import styled from 'styled-components';

export default ({ callback }) => (
  <NoAssetsOuterWrapper>
    <NoAssetsInnerWrapper>
      {
        callback ? (
          <React.Fragment>
            <Heading>You have no active requests</Heading>
            <Text>Why not create a new one?</Text>
            <ButtonWrapper>
              <Button onClick={callback}>Create request</Button>
            </ButtonWrapper>
          </React.Fragment>
        ) : <Heading>There are no requests in this category</Heading>
      }
    </NoAssetsInnerWrapper>
  </NoAssetsOuterWrapper>
);

const NoAssetsOuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const NoAssetsInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10%;
`

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 15px 'Nunito Sans', sans-serif;
  letter-spacing: 0.47px;
  padding: 20px 38px;
  border-radius: 100px;
  text-transform: uppercase;
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.38px;
  padding: 12px 21px;
  margin: 15px 0 0;
  box-shadow: 0 10px 20px 0 #0a2056;
  font-weight: 700;
  background-color: #009fff;
  width: 160px;
`;

const Heading = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  color: #ffffff;
  padding-top: 50px;
  margin: 0 40px;
`;

const Text = styled.h4`
  font-size: 1.3rem;
  font-weight: 300;
  color: #ffffff;
  padding: 20px 0;
`;
