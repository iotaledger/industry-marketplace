import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../pages/dashboard';
import burgerIcon from './../../assets/img/burger.svg';
import closeIcon from './../../assets/img/close.svg';


const HeaderWrapper = ({ createRequest, handleSidebar, isSideBarOpen }) => {
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
      <BurgerIconWrap>
        <BurgerIcon
          src={isSideBarOpen ? closeIcon : burgerIcon}
          style={isSideBarOpen ? { width: '45px', position: 'relative', left: '6px' } : {}}
          onClick={handleSidebar}
        />
      </BurgerIconWrap>
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

const BurgerIconWrap = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`
const BurgerIcon = styled.img`
  @media (min-width: 769px) {
    display: none;
  }
`
const Main = styled.nav`
  padding: 17px;
  display: flex;
`;

const Header = styled.header`
  display: flex;
  width: 100%;
`;

const Desc = styled.div`
  font: 15px 'Nunito Sans', sans-serif;
  color: #808b92;
`;

const Block = styled.div`
  display: block;
`;

const UserID = styled.span`
  color: #529FF8;
  font-size: 28px;
`;

const RightHeader = styled.div`
  display: none;
  @media (min-width: 769px) {
    display: flex;
  }
`;

const ButtonWrapper = styled.div`

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
