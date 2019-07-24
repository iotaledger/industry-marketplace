import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../pages/dashboard';
import configIcon from './../../assets/img/config.svg';
import cActive from './../../assets/img/cercleActive.svg';
import cNormal from './../../assets/img/cercleNormal.svg';


const menu = {
  SR: [
    { id: 'callForProposal', label: 'Awaiting proposal' },
    { id: 'proposal', label: 'Proposal received' },
    { id: 'acceptProposal', label: 'Awaiting fulfilment' },
    { id: 'informConfirm', label: 'Awaiting payment' },
    { id: 'informPayment', label: 'Completed' }
  ],
  SP: [
    { id: 'callForProposal', label: 'Received requests' },
    { id: 'proposal', label: 'Proposal sent' },
    { id: 'acceptProposal', label: 'Awaiting fulfilment' },
    { id: 'informConfirm', label: 'Awaiting payment' },
    { id: 'informPayment', label: 'Completed' }
  ]
}

const Sidebar = ({ currentPage, showMenu, callback, handleLocationModal, isSideBarOpen, handleSidebar, createRequest }) => {
  const { user } = useContext(UserContext);

  function switchMenu(nextPage) {
    if (nextPage === currentPage) return;
    callback(nextPage);
  }
  function handleAndClose(handle, closeCallback) {
    handle()
    if(window.innerWidth < '769') {
      closeCallback()
    }
  }

  if (!user.role) return null;

  return (
    <SidebarWrapper isSideBarOpen={isSideBarOpen}>
      <Upper>
        <SideBarTitle>Request Stage</SideBarTitle>
          {
            showMenu ? (
              <MenuFix><MenuWrapper>
                {
                  menu[user.role].map(({ id, label }, index) => (
                    <Item>
                      <img src={currentPage === id ? cActive : cNormal} />
                      <ItemText
                        index={index}
                        key={id}
                        role="button"
                        onClick={(e) => handleAndClose(e => switchMenu(id), handleSidebar)}
                        active={currentPage === id}
                      >
                        <span>{ label }</span>
                      </ItemText>
                    </Item>
                  ))
                }
              </MenuWrapper></MenuFix>
            ) : null
          }

        <ButtonWrapper>
          <Button
            onClick={(e) => handleAndClose(createRequest, handleSidebar)}
          >Create request</Button>
        </ButtonWrapper>
      </Upper>
      <Lower>
        <ModifyConfiguration
          onClick={(e) => handleAndClose(e => handleLocationModal(true), handleSidebar)}
        >
          <ConfigIcon src={configIcon} />
          <ConfigText>MODIFY CONFIGURATION</ConfigText>
        </ModifyConfiguration>
      </Lower>
    </SidebarWrapper>
  );
}

export default Sidebar;

const Item = styled.div`
  display: flex;
`
const Upper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`
const Lower = styled.div``

const SideBarTitle = styled.div`
  font-weight: 600;
  color: #15286D;
  font-size: 24px;
  width: 100%;
  @media (min-width: 769px) {
    position: relative;
    left: 27px;
    font-size: 28px;
  }
  @media (min-width: 1440px) {
    font-size: 31px;
  }
`
const ModifyConfiguration = styled.div`
  display: flex;
  justify-content: start;
  @media (min-width: 769px) {
  }
  align-items: center;
  width: 400px;
  position: absolute;
  left: 52px;
  bottom: 50px;
  cursor: pointer;
`;

const ConfigIcon = styled.img`
`
const ConfigText = styled.div`
  margin-left: 25px;
  font-size: 18px;
  color: #15286D;
`

const SidebarWrapper = styled.aside`
  position: absolute;
  min-height: 540px;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding: 20px;
  transition: transform 0.5s;
  transform: ${(p) => p.isSideBarOpen ? 'translateX(0%)' : 'translateX(100vw)'};
  display: ${(p) =>  p.isSideBarOpen ? 'flex' : 'none'};
  background: rgba(240, 240, 240, 1);
  flex-direction: column;
  justify-content: space-between;
  z-index: 3;
  @media (min-width: 769px) {
    min-height: 100vh;
    height: 100%;
    display: flex;
    position: relative;
    left: -100%;
    width: 420px;
  }
`;

const MenuWrapper = styled.div`

`;

const MenuFix = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const ItemText = styled.div`
  white-space: nowrap;
  font-size: 46px;
  font-weight: 600;
  padding: 0 10px;
  cursor: pointer;
  color: ${props => (props.active ? '#529FF8' : '#C4C4C4')};
  position: relative;
  :before {
    content: '';
    position: absolute;
    background-color: #C4C4C4;
    width: 1px;
    height: 68px;
    left: -9px;
    top: -30px;
    z-index: -1;
    display: ${(p) => p.index === 0 ? 'none': 'block'}
  }
  & > span {
    font-size: 20px;
    line-height: 68px;
    vertical-align: text-bottom;
  }
  @media (min-width: 769px) {
    & > span {
      font-size: 22px;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  margin-top: 15px;
  @media (min-width: 769px) {
    display: none;
  }
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
  margin: 1px 0px 0;
  font-weight: 700;
  background-color: #009fff;
  width: 100%;

  &:hover {
    color: #009fff;
    background-color: #ffffff;
    border: 1px solid #009fff;
  }
`;
