import React, { useContext } from 'react';
import styled from 'styled-components';
import { UserContext } from '../../pages/dashboard';

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

const Sidebar = ({ currentPage, showMenu, callback }) => {
  const { user } = useContext(UserContext);

  function switchMenu(nextPage) {
    if (nextPage === currentPage) return;
    this.props.callback(nextPage);
  }

  if (!user.role) return null;

  return (
    <SidebarWrapper>
      {
        showMenu ? (
          <MenuWrapper>
            {
              menu[user.role].map(({ id, label }) => (
                <Menu
                  key={id}
                  role="button"
                  onClick={() => switchMenu(`/${id}`)}
                  active={currentPage === `/${id}`}
                >
                  { label }
                </Menu>
              ))
            }
          </MenuWrapper>
        ) : null
      }
    </SidebarWrapper>
  );
}

export default Sidebar;

const SidebarWrapper = styled.aside`
  background: rgba(240, 240, 240, 1);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  min-width: 350px;
  width: 350px;
  padding: 40px 0 0 0;
  z-index: 1;
`;

const MenuWrapper = styled.div`
  margin-left: 30px;
  width: 320px;
  position: relative;
  padding-bottom: 30px;
  margin-bottom: 30px;
`;

const Menu = styled.h5`
  font-size: 20px;
  font-weight: 300;
  padding: 20px 20px 20px 30px;
  cursor: pointer;
  color: ${props => (props.active ? '#ffffff' : '#595959')};
  background-color: ${props => (props.active ? '#061b70' : '#f0f0f0')};
`;
