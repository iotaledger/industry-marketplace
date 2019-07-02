import React from 'react';
import styled from 'styled-components';

const HeaderWrapper = ({ createRequest }) => (
  <Main>
    <RightHeader>
      {
        createRequest ? (
          <ButtonWrapper>
            <Button onClick={createRequest}>Create request</Button>
          </ButtonWrapper>
        ) : null
      }
    </RightHeader>
  </Main>
);

export default HeaderWrapper;

const Main = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
  height: 100px;
  background-color: #fff;
  @media (max-width: 1195px) {
    height: 90px;
  }
  @media (max-width: 760px) {
    height: 66px;
  }
`;

const RightHeader = styled.div`
  margin: 0 30px;
  display: block;
  width: ${props => (props.createOffer ? '500px' : '150px')};
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  @media (max-width: 760px) {
    margin: 10px 20px 0 30px;
    width: 120px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`;

const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 15px 'Nunito Sans', sans-serif;
  letter-spacing: 0.47px;
  padding: 20px 38px;
  border-radius: 100px;
  color: #fff;
  font-size: 16px;
  letter-spacing: 0.38px;
  padding: 12px 21px;
  margin: 1px 13px 0;
  font-weight: 700;
  background-color: #009fff;
  width: 160px;

  &:hover {
    color: #009fff;
    background-color: #ffffff;
    border: 1px solid #009fff;
  }
`;
