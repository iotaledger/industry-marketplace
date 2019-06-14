import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router';

class UserSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { message: '' };
    this.alert = this.alert.bind(this);
    this.switchMenu = this.switchMenu.bind(this);
  }

  alert(text) {
    this.setState({ message: text }, () =>
      setTimeout(() => this.setState({ message: '' }), 1500)
    );
  };

  switchMenu(nextPage) {
    const currentPage = this.props.location.pathname;
    if (nextPage === currentPage) return;
    this.props.history.push(nextPage);
  }

  render() {
    const { user, userData, menu, location: { pathname } } = this.props;
    const { message } = this.state;

    return (
      <Sidebar>
        {
          menu ? (
            <MenuWrapper>
              <Menu
                role="button"
                onClick={() => this.switchMenu('/dashboard')}
                active={pathname === '/dashboard'}
              >
                My Dashboard
              </Menu>
              <Menu
                role="button"
                onClick={() => this.switchMenu('/orders')}
                active={pathname === '/orders'}
              >
                Order History
              </Menu>
            </MenuWrapper>
          ) : null
        }
      </Sidebar>
    );
  }
}

export default withRouter(UserSidebar);

const Sidebar = styled.aside`
  background: rgba(240, 240, 240, 1);
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  min-width: 350px;
  width: 350px;
  padding: 40px 0 0 0;
  z-index: 1;
`;

const Details = styled.div`
  width: 230px;
  position: relative;
  padding-bottom: 30px;
  margin-bottom: 30px;
  @media (max-width: 760px) {
    width: 100%;
  }
  &::before {
    content: '';
    position: absolute;
    right: -30px;
    bottom: 0;
    height: 1px;
    width: 100vw;
    background-color: rgba(115, 143, 212, 0.15);
  }
`;

const DetailRow = styled.div`
  @media (max-width: 760px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const DetailKey = styled.p`
  font-size: 12px;
  line-height: 16px;
  color: #738fd4;
`;

const DetailValue = styled.p`
  font-size: 16px;
  line-height: 32px;
  color: #595959ff;
`;

const Alert = styled.span`
  font-size: 16px;
  line-height: 32px;
  color: #595959;
  opacity: ${props => (props.message ? 1 : 0)};
  transition: all 0.5s ease;
`;

const CopyBox = styled(DetailValue)`
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.6;
  }
`;

const MenuWrapper = styled.div`
  margin-left: 30px;
  width: 320px;
  position: relative;
  padding-bottom: 30px;
  margin-bottom: 30px;
`;

const Menu = styled.h3`
  font-size: 25px;
  font-weight: 300;
  padding: 20px 20px 20px 30px;
  cursor: pointer;
  color: ${props => (props.active ? '#ffffff' : '#595959')};
  background-color: ${props => (props.active ? '#061b70' : '#f0f0f0')};
`;
