import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import UserContext from '../../context/user-context';
import backIcon from '../../assets/img/icon-arrow-back-dark.svg';
import createRequestBtn from '../../assets/img/createRequest.svg';
import logo from '../../assets/img/logo.svg';

const HeaderWrapper = ({ back, createRequest, handleSidebar, history, isSideBarOpen }) => {
  const { user } = useContext(UserContext);
  if (!user.role) return null;

  return (
    <Main>
      {
        back && (
          <Back to={'/'} onClick={history.goBack}>
            <img src={backIcon} alt="Icon arrow" />
          </Back>
        )
      }
      <Header>
        <img src={logo} alt="logo"/>
      </Header>
      <BurgerIconWrap>
        <span 
          className={`menu ${isSideBarOpen ? 'toggled' : ''}`}
          onClick={handleSidebar}
        >
          <span></span>
          <span></span>
          <span></span>
        </span>
      </BurgerIconWrap>
      <RightHeader>
        <Block>
          <Desc>{user.role === 'SR' ? 'Service requester' : 'Service provider'}</Desc>
          <Value>{user.name}</Value>
        </Block>
        <Block>
          <Desc>Wallet balance</Desc>
          <WalletValue>{user.balance}</WalletValue>
        </Block>
        {
          user.role === 'SR' && !back ? (
            <Block>
              <Button onClick={createRequest}>
                <img src={createRequestBtn} alt="Create request"/>
              </Button>
            </Block>
          ) : null
        }
      </RightHeader>
    </Main>
  )
}

export default withRouter(HeaderWrapper);

const BurgerIconWrap = styled.div`
  position: absolute;
  top: 20px;
  right: 30px;

  @media (min-width: 840px) {
    display: none;
  }

  .menu {
    border-radius: 3px;
    cursor: pointer;
    user-select: none;

    display: block;
    padding: 15px 0;

    span {
      background: #485776;
      display: block;
      width: 24px;
      height: 3px;
      border-radius: 3px;
      transform-origin: center;
      transition: 300ms all cubic-bezier(.4,0,.2,1);

      :nth-child(2) {
        margin: 4px 0;
      }
    }

    &.toggled {
      span {
        background: #4140DF !important;

        &:first-child {
          transform: translateY(6px) rotate(45deg);
        }

        &:nth-child(2) {
          opacity: 0;
        }

        &:last-child {
          transform: translateY(-8px) rotate(-45deg);
        }
      }
    }
  }
`

const Main = styled.nav`
  padding: 20px 30px;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
  height: auto;
  background-color: #FFFFFF;
  position: relative;

  @media (min-width: 840px) {
    flex-wrap: unset;
    padding: 20px 15px;
    flex-direction: row;
    justify-content: space-between;
    height: 90px;
  }

  @media (min-width: 920px) {
    padding: 20px 30px;
  }
`;

const Header = styled.header`
  display: flex;
  width: 100%;
`;

const Desc = styled.div`
  font: 14px 'Nunito Sans', sans-serif;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: #808b92;
  text-transform: uppercase;
`;

const Block = styled.div`
  display: block;
  white-space: nowrap;
  margin: 0 10px 0 70px;

  &:first-child {
    margin-left: 10px;
  }

  @media (max-width: 1000px) {
    margin: 0 10px 0 40px;
  }

  @media (max-width: 920px) {
    margin: 0 10px;
  }

  @media (max-width: 839px) {
    margin: 20px 0 0;
  }
`;

const Value = styled.span`
  color: #485776;
  font-size: 28px;
`;

const WalletValue = styled(Value)`
  color: #4140DF;
`;

const RightHeader = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
  margin-top: 10px;
  
  @media (min-width: 840px) {
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 0;
  }
`;

const Button = styled.button`
  display: none;
  @media (min-width: 840px) {
    display: block;
    appearance: none;
    outline: none;

    &:hover {
      opacity: 0.9;
    }
  }
`;

const Back = styled(Link)`
  display: flex;
  justify-content: center;
  height: 100%;
  width: 90px;
  margin-right: 30px;
  padding-right: 20px;
  cursor: pointer;
  border-right: 1px solid #eaecee;
  
  @media (max-width: 760px) {
    width: 46px;
    border: none;
  }
`;
