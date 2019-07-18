import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../pages/dashboard';

const HeaderWrapper = ({ createRequest }) => {
  const { user } = useContext(UserContext);
  if (!user.role) return null;

  return (
    <Main>
      <Header>
        <Block>
          <Desc>{user.role === 'SR' ? 'Service requester' : 'Service provider'}</Desc>
          <UserID>{user.id}</UserID>
        </Block>
      </Header>
      <RightHeader>
        <Block>
          <Desc>Wallet balance</Desc>
          <UserID>{user.balance}</UserID>
        </Block>
        {
          user.role === 'SR' ? (
            <ButtonWrapper>
              <Button onClick={createRequest}>Create request</Button>
            </ButtonWrapper>
          ) : null
        }
      </RightHeader>
    </Main>
  )
}

export default HeaderWrapper;

const Main = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1000;
  height: 10vh;
  background-color: #fff;
  @media (max-width: 1195px) {
    height: 90px;
  }
  @media (max-width: 760px) {
    height: 66px;
  }
`;

const Header = styled.header`
  margin: 10px auto 0 30px;
  display: flex;
`;

const Desc = styled.span`
  font: 12px/16px 'Nunito Sans', sans-serif;
  color: #808b92;
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const UserID = styled.span`
  font-size: 24px;
  line-height: 42px;
  position: relative;
  top: -4px;
  color: #009fff;
  @media (max-width: 760px) {
    font-size: 15px;
    top: -4px;
  }
`;

const RightHeader = styled.div`
  margin: 10px 10px 0;
  display: block;
  width: 330px;
  text-align: right;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
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
