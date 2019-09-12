import React, { useContext } from 'react';
import styled from 'styled-components';
import UserContext from '../../context/user-context';
import configIcon from '../../assets/img/config.svg';
import cActive from '../../assets/img/circleActive.svg';
import cNormal from '../../assets/img/circleNormal.svg';
import createRequestBtn from '../../assets/img/createRequest.svg';
import { domain } from '../../config.json';

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

const Sidebar = ({ badges, currentPage, showMenu, callback, handleConfigModal, isSideBarOpen, handleSidebar, createRequest }) => {
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

  return (
    <SidebarWrapper isSideBarOpen={isSideBarOpen}>
      <Upper>
        <ButtonWrapper>
          <Button onClick={() => handleAndClose(createRequest, handleSidebar)}>
            <img src={createRequestBtn} alt="Create request"/>
          </Button>
        </ButtonWrapper>
        <SideBarTitle>Request Stage</SideBarTitle>
          {
            showMenu ? (
              <MenuFix>
                {
                  user.role && menu[user.role].map(({ id, label }, index) => (
                    <Item key={id}>
                      <img src={currentPage === id ? cActive : cNormal} alt="menu" />
                      <ItemText
                        index={index}
                        role="button"
                        onClick={() => handleAndClose(() => switchMenu(id), handleSidebar)}
                        active={currentPage === id}
                      >
                        <span>{ label }</span>
                        {
                          currentPage !== id && badges[id] > 0 && <Badge>{ badges[id] } new</Badge>
                        }
                      </ItemText>
                    </Item>
                  ))
                }
              </MenuFix>
            ) : null
          }
      </Upper>
      <ModifyConfiguration
        onClick={() => handleAndClose(() => handleConfigModal(true), handleSidebar)}
        displayMode={domain.startsWith('http://localhost') ? 'flex' : 'none'}
      >
        <img src={configIcon} alt="Modify configuration"/>
        <ConfigText>Modify Configurations</ConfigText>
      </ModifyConfiguration>
    </SidebarWrapper>
  );
}

export default Sidebar;

const Item = styled.div`
  display: flex;
`;

const Upper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const SideBarTitle = styled.div`
  font-weight: 600;
  color: #485776;
  font-size: 24px;
  width: 100%;

  @media (min-width: 840px) {
    position: relative;
    font-size: 28px;
  }
  @media (min-width: 1440px) {
    font-size: 31px;
  }
`;

const ModifyConfiguration = styled.div`
  display: ${p => p.displayMode};
  justify-content: flex-start;

  @media (min-width: 840px) {
    left: 35px;
  }
  align-items: center;
  width: auto;
  position: absolute;
  bottom: 50px;
  cursor: pointer;
`;

const ConfigText = styled.div`
  margin-left: 20px;
  font-size: 22px;
  color: #8493AD;
`;

const SidebarWrapper = styled.aside`
  position: absolute;
  min-height: 540px;
  width: 100%;
  height: calc(100% - 92px); 
  overflow-y: auto;
  padding: 20px;
  border-top: 1px solid #F2F5FB;
  transition: transform 0.5s;
  transform: ${p => p.isSideBarOpen ? 'translateX(0%)' : 'translateX(100vw)'};
  display: ${p =>  p.isSideBarOpen ? 'flex' : 'none'};
  background: #FFFFFF;
  flex-direction: column;
  justify-content: space-between;
  z-index: 3;

  @media (min-width: 840px) {
    min-height: calc(100% - 92px); 
    height: 100%;
    display: flex;
    position: relative;
    left: -100%;
    width: 420px;
    padding-left: 45px;
  }
`;

const MenuFix = styled.div`
  width: 100%;
  margin-top: 20px;
`;

const ItemText = styled.div`
  white-space: nowrap;
  font-size: 46px;
  font-weight: 600;
  padding: 0 10px 0 20px;
  cursor: pointer;
  color: ${props => (props.active ? '#4140DF' : '#C3D0E4')};
  position: relative;
  :before {
    content: '';
    position: absolute;
    background-color: #C3D0E4;
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
  @media (min-width: 840px) {
    & > span {
      font-size: 22px;
    }
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  display: flex;
  margin: 20px 0 35px;
  @media (min-width: 840px) {
    display: none;
  }
`;

const Button = styled.button`
  outline: none;
  appearance: none;

  &:hover {
    opacity: 0.9;
  }
`;

const Badge = styled.span`
  color: #FFFFFF;
  background: #4140DF;
  border-radius: 6px;
  width: 52px;
  height: 25px;
  font-weight: 600;
  font-size: 12px !important;
  padding: 3px 9px;
  margin-left: 15px;
`;