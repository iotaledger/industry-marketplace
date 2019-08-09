import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AssetContext } from '../../pages/dashboard';
import UserContext from '../../context/user-context';
import Card from './index.js';

const Heading = ({ id, operation, type }) => {
  const { onCancel } = useContext(AssetContext);
  return (
    <Full>
      <Link to={`/conversation/${id}`}>
        <Header>{operation}</Header>
      </Link>
      <StatusWrapper>
        <Status>
          {type}
        </Status>
        {
          onCancel && (
            <CancelHeaderButton onClick={() => onCancel(id)}>
              Remove
            </CancelHeaderButton>
          )
        }
      </StatusWrapper>
    </Full>
  );
}

const getRejectButtonText = (role, type) => {
  if (role === 'SR') {
    switch (type) {
      case 'callForProposal':
        return 'Cancel request';
      case 'proposal':
        return 'Reject proposal';
      default:
        return null;
    }
  } else if (role === 'SP') {
    switch (type) {
      case 'callForProposal':
      case 'acceptProposal':
        return 'Reject request';
      case 'rejectProposal':
        return 'Remove';
      default:
        return null;
    }
  }
  return null;
}

const getConfirmButtonText = (role, type) => {
  if (role === 'SR') {
    switch (type) {
      case 'proposal':
        return 'Accept proposal';
      case 'informConfirm':
        return 'Process payment';
      default:
        return null;
    }
  } else if (role === 'SP') {
    switch (type) {
      case 'callForProposal':
        return 'Send proposal';
      case 'acceptProposal':
        return 'Request fulfilled';
      default:
        return null;
    }
  }
  return null;
}

const Footer = ({ id, partner, type }, isConfirmButtonEnabled, price) => {
  const { user } = useContext(UserContext);
  const { onConfirm, onReject } = useContext(AssetContext);
  if (!onConfirm) return null;

  const rejectButton = getRejectButtonText(user.role, type);
  const confirmButton = getConfirmButtonText(user.role, type);

  if (!rejectButton && !confirmButton) return null;

  return (
    <React.Fragment>
      <FootRow>
        {
          rejectButton ? (
            <FooterButton onClick={() => onReject(id, partner)}>
              {rejectButton}
            </FooterButton>
          ) : <div />
        }
        {
           confirmButton && (
            <FooterButton 
              disabled={!isConfirmButtonEnabled}
              isAccept={true} 
              onClick={() => onConfirm(id, partner, price)}
            >
              {confirmButton}
            </FooterButton>
          )
        }
      </FootRow>
    </React.Fragment>
  );
}

const Asset = props => {
  const { user } = useContext(UserContext);
  const { asset } = props;
  const [price, setPrice] = useState('');
  const [isConfirmButtonEnabled, setConfirmButtonEnabled] = useState(true);

  useEffect(() => {
    if (user.role === 'SP' && asset.price === 'Pending') {
      setConfirmButtonEnabled(false);
    } else if (user.balance <= 0) {
      setConfirmButtonEnabled(false);
    } else {
      setConfirmButtonEnabled(true);
      setPrice(asset.price);
    }
  }, [user]);

  function change({ target: { value } }) {
    setPrice(Number(value));
    if (Number(value) > 0) {
      setConfirmButtonEnabled(true);
    } else {
      setConfirmButtonEnabled(false);
    }
  };

  return (
    <Card
      header={Heading(asset)}
      footer={Footer(asset, isConfirmButtonEnabled, price)}
      asset={asset}
    >
      <CardContent>
        {
          asset.params && asset.params.length > 0 ? (
            <Row>
            {
              asset.params.map(({ idShort, value }) => (
                <RowThird key={idShort}>
                  <RowDesc>{idShort}</RowDesc>
                  <Data>{value.toString()}</Data>
                </RowThird>
              ))
            }
            </Row>
          ) : null
        }
        <Row>
          <RowThird>
            <RowDesc>Coordinates</RowDesc>
            <Data>
              {asset.coordinates || '--'}
            </Data>
          </RowThird>
          <RowThird>
            <RowDesc>Location</RowDesc>
            <Data>
              {asset.location || '--'}
            </Data>
          </RowThird>
          <RowThird>
            <RowDesc>Partner ID:</RowDesc>
            <Data>{user.name}</Data>
          </RowThird>
        </Row>
        <Row>
          <RowThird>
            <RowDesc>Begin Time:</RowDesc>
            <Data>{asset.startTime}</Data>
          </RowThird>
          <RowThird>
            <RowDesc>End Time:</RowDesc>
            <Data>{asset.endTime}</Data>
          </RowThird>
          {
            user.role === 'SP' && asset.price === 'Pending' ? (
              <RowThird>
                <RowDesc>Price (IOTA):</RowDesc>
                <Input
                  type='number'
                  name="price"
                  value={price}
                  onChange={change}
                />
              </RowThird>
            ) : (
              <RowThird>
                <RowDesc>Price (IOTA):</RowDesc>
                <Data>{asset.price}</Data>
              </RowThird>
            )
          }
        </Row>
      </CardContent>
    </Card>
  );
};

export default Asset;

const CardContent = styled.div`
  padding: 20px 0 15px;
`;

const Row = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
  @media (min-width: 769px) {
    flex-direction: row;
  }
`;

const RowThird = styled.div`
  padding: 10px 30px;
  display: inline-block;
  text-align: left;
  @media (min-width: 426px) {
    width: 50%;
  }
  @media (min-width: 950px) {
    width: 33.3%;
  }
`;

const Data = styled.p`
  font-size: 18px;
  line-height: 30px;
  margin-top: 4px;
  color: #313131;
`;

const RowDesc = styled.span`
  font: 16px 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: #B8B8B8;
  text-transform: uppercase;
`;

const Header = styled.h2`
  font-size: 24px;
  font-weight: 600;
  position: relative;
  color: #009fff;
  text-transform: uppercase;
  text-decoration: underline;
`;

const Full = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  @media (min-width: 769px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const FootRow = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  cursor: default;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;

const FooterButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  margin: 5px;
  @media (min-width: 920px) {
    width: 200px;
  }
  font: 16px 'Nunito Sans', sans-serif;
  line-height: 16px;
  letter-spacing: 0.47px;
  padding: 12px 21px;
  border-radius: 100px;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0.38px;
  width: 100%;
  height: 45px;
  cursor: ${p => p.disabled ? 'default' : 'pointer'};

  color: ${p => p.isAccept ? '#ffffff' : '#009fff'};
  background-color: ${p => p.isAccept ? (p.disabled ? '#C4C4C4' : '#009fff') : '#ffffff'};
  border: ${p => p.isAccept ? 'unset' : '1px solid #009fff'};

  &:hover {
    color: ${p => p.isAccept && !p.disabled ? '#009fff' : '#ffffff'};
    background-color: ${p => p.isAccept ? (p.disabled ? '#C4C4C4' : '#ffffff') : '#009fff'};
    border: ${p => p.isAccept && !p.disabled ? '1px solid #009fff' : 'unset'};
  }
`;

const StatusWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Status = styled.h3`
  color: #529FF8;
  font: 18px 'Nunito Sans', sans-serif;
  text-transform: uppercase;
  @media (min-width: 769px) {
    text-align: right;
  }
`;

const CancelHeaderButton = styled.a`
  font: 14px 'Nunito Sans', sans-serif;
  padding: 12px 21px;
  color: #313131;
  text-decoration: underline;
  padding: 0;
  @media (min-width: 769px) {
    text-align: right;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding: 3px 10px 3px 0;
  margin: 0px 5px 10px 0;
  border-bottom: 2px solid #eee;
  background: transparent;
  font-size: 18px;
`;