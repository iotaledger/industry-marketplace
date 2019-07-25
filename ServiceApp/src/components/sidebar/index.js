import React, { useContext } from 'react';
import styled from 'styled-components';
import UserContext from '../../context/user-context';
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

const Sidebar = ({ currentPage, showMenu, callback, handleLocationModal }) => {
  const { user } = useContext(UserContext);

  function switchMenu(nextPage) {
    if (nextPage === currentPage) return;
    callback(nextPage);
  }

  return (
    <SidebarWrapper>
      {
        showMenu ? (
          <MenuWrapper>
            {
              user.role && menu[user.role].map(({ id, label }) => (
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

      <ModifyConfiguration onClick={() => handleLocationModal(true)}>
        <ConfigIcon src={configIcon} />
        <ConfigText>MODIFY CONFIGURATION</ConfigText>
      </ModifyConfiguration>
    </SidebarWrapper>
  );
}

export default Sidebar;

const ModifyConfiguration = styled.div`
  position: absolute;
  display: flex;
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
  background: rgba(240, 240, 240, 1);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  min-width: 400px;
  width: 400px;
  padding: 40px 0 0 0;
  z-index: 1;
`;

const MenuWrapper = styled.ul`
  margin-left: 150px;
  width: 400px;
  position: relative;
`;

const Menu = styled.li`
  font-size: 46px;
  font-weight: 600;
  padding: 0 10px;
  cursor: pointer;
  color: ${props => (props.active ? '#529FF8' : '#595959')};

  & > span {
    font-size: 26px;
    line-height: 68px;
    vertical-align: text-bottom;
  }
`;
