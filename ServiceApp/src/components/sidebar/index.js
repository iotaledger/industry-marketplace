import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../pages/dashboard';
import configIcon from './../../assets/img/config.svg';

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

  if (!user.role) return null;

  return (
    <SidebarWrapper isSideBarOpen={isSideBarOpen}>
    <SideBarTitle>Request Stage</SideBarTitle>
      {
        showMenu ? (
          <MenuWrapper>
            {
              menu[user.role].map(({ id, label }) => (
                <Menu
                  key={id}
                  role="button"
                  onClick={() => switchMenu(id)}
                  active={currentPage === id}
                >
                  <span>{ label }</span>
                </Menu>
              ))
            }
          </MenuWrapper>
        ) : null
      }

      <ButtonWrapper style={{ }}>
        <Button onClick={createRequest}>Create request</Button>
      </ButtonWrapper>
      <ModifyConfiguration style={{ }} onClick={(e) => {
        handleLocationModal(true);
        //handleSidebar();
      }}>
        <ConfigIcon src={configIcon} />
        <ConfigText>MODIFY CONFIGURATION</ConfigText>
      </ModifyConfiguration>

    </SidebarWrapper>
  );
}

export default Sidebar;

const SideBarTitle = styled.div`
  font-weight: 600;
  color: #15286D;
  font-size: 24px;
  width: 100%;
  position: relative;
  margin-bottom: 35px;
  right: 36px;
  @media (min-width: 769px) {
    font-size: 32px;
  }
`
const ModifyConfiguration = styled.div`
  display: flex;
  position: static;
  position: relative;
  right: 40px;
  margin-bottom: 93px;
  margin-top: 40px;
  @media (min-width: 769px) {
  // code here
  }
  align-items: center;
  width: 400px;
  position: absolute;
  left: 52px;
  bottom: 50px;
  cursor: pointer;
  z-index: 2;
`;

const ConfigIcon = styled.img`
`
const ConfigText = styled.div`
  margin-left: 25px;
  font-size: 18px;
  color: #15286D;
`

const SidebarWrapper = styled.aside`
  position: fixed;
  min-height: 540px;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  transition: transform 0.5s;
  transform: ${(p) => p.isSideBarOpen ? 'translateX(0%)' : 'translateX(100vw)'};
  padding: 51px 70px 51px 70px;
  background: rgba(240, 240, 240, 1);
  display: flex;
  flex-flow: column nowrap;
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

const MenuWrapper = styled.ul`
  position: relative;
`;

const Menu = styled.li`
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
    left: -30px;
    top: -27px;
    z-index: -1;
  }
  :first-child:before{
    display: none;
  }
  & > span {
    font-size: 20px;
    line-height: 68px;
    vertical-align: text-bottom;
  }
  @media (min-width: 769px) {
    & > span {
      font-size: 26px;
    }
  }
`;

const ButtonWrapper = styled.div`
  /* position: absolute; */
  width: calc(100vw - 70px);
  position: relative;
  left: -55px;
  /* left: -50px;
  bottom: -60px; */
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
  margin: 1px 13px 0;
  font-weight: 700;
  background-color: #009fff;
  width: 100%;

  &:hover {
    color: #009fff;
    background-color: #ffffff;
    border: 1px solid #009fff;
  }
`;
