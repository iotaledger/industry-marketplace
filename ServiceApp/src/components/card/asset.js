import React, { useContext } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { AssetContext } from '../../pages/dashboard';
import { UserContext } from '../../pages/dashboard';
import Card from './index.js';

const Heading = ({ id, operation, type }) => {
  const { onCancel } = useContext(AssetContext);
  return (
    <Full>
      <Link to={`/history/${id}`}>
        <Header>{operation}</Header>
      </Link>
      <StatusWrapper>
        <Status>
          {type}
        </Status>
        {
          onCancel && (
            <CancelHeaderButton onClick={() => onCancel(id)}>
              Cancel Request
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

const Footer = ({ id, type }) => {
  const { user } = useContext(UserContext);
  const { onConfirm, onReject } = useContext(AssetContext);
  console.log('Footer', id, type, onConfirm);
  if (!onConfirm) return null;

  const rejectButton = getRejectButtonText(user.role, type);
  const confirmButton = getConfirmButtonText(user.role, type);

  if (!rejectButton && !confirmButton) return null;
  
  console.log('Footer', rejectButton, confirmButton);
  return (
    <React.Fragment>
      <FootRow>
        {
          rejectButton && (
            <FooterButton onClick={() => onReject(id)}>
              {rejectButton}
            </FooterButton>
          )
        }
        {
          confirmButton && (
            <FooterButton onClick={() => onConfirm(id)}>
              {confirmButton}
            </FooterButton>
          )
        }
      </FootRow>
    </React.Fragment>
  );
}

const Asset = props => {
  const { asset, disableMargin } = props;
  console.log('Asset', asset);
  
  return (
    <Card
      header={Heading(asset)}
      footer={Footer(asset)}
      asset={asset}
      disableMargin={disableMargin}
    >
      <CardContent>
        {
          asset.params && asset.params.length > 0 ? (
            <Row>
            {
              asset.params.map(({ idShort, value }) => (
                <RowThird key={idShort}>
                  <RowDesc>{idShort}</RowDesc>
                  <Data>{value}</Data>
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
              {asset.location || '--'}
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
            <Data>{asset.partner}</Data>
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
          <RowThird>
            <RowDesc>Price:</RowDesc>
            <Data>{asset.price}</Data>
          </RowThird>
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
`;

const RowThird = styled.div`
  width: 33.3%;
  padding: 10px 30px;
  display: inline-block;
  text-align: left;
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const FootRow = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: default;
  &:not(:last-of-type) {
    margin-bottom: 5px;
  }
`;

const FooterButton = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 16px 'Nunito Sans', sans-serif;
  line-height: 16px;
  letter-spacing: 0.47px;
  padding: 12px 21px;
  border-radius: 100px;
  color: #009fff;
  background-color: #ffffff;
  border: 1px solid #009fff;
  font-size: 16px;
  font-weight: normal;
  letter-spacing: 0.38px;
  width: 200px;
  height: 45px;

  &:hover {
    color: #ffffff;
    background-color: #009fff;
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
  font-weight: 600;
  text-align: right;
  text-transform: uppercase;
`;

const CancelHeaderButton = styled.button`
  font: 14px 'Nunito Sans', sans-serif;
  padding: 12px 21px;
  color: #313131;
  font-size: 16px;
  text-decoration: underline;
  padding: 0;
  text-align: right;
`;
