import React from 'react';
import styled from 'styled-components';
import createRequest from '../../assets/img/createRequest.svg';

export default ({ callback }) => (
  <NoAssetsOuterWrapper>
    <NoAssetsInnerWrapper>
      {
        callback ? (
          <React.Fragment>
            <Heading>You have no active requests</Heading>
            <Text>Why not create a new one?</Text>
            <ButtonWrapper>
              <Button onClick={callback}>
                <img src={createRequest} alt="Create request"/>
              </Button>
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
  appearance: none;
  outline: none;

  &:hover {
    opacity: 0.9;
  }
`;

const Heading = styled.h2`
  font-size: 2rem;
  font-weight: 300;
  color: #485776;
  padding-top: 50px;
  margin: 0 40px;
`;

const Text = styled.h4`
  font-size: 1.3rem;
  font-weight: 300;
  color: #485776;
  padding: 20px 0;
`;
