import React, { useContext, useState, useEffect } from 'react';
import styled from 'styled-components';
import Clipboard from 'react-clipboard.js';
import { Link } from 'react-router-dom';
import { AssetContext } from '../../pages/dashboard';
import UserContext from '../../context/user-context';
import searchIcon from '../../assets/img/search.svg';
import removeIcon from '../../assets/img/remove.svg';
import mapIcon from '../../assets/img/map.svg';
import Card from './index.js';
import { eClassCatalog, googleMaps } from '../../config.json';

const Heading = ({ id, partner, operation, type }) => {
  const { onCancel } = useContext(AssetContext);
  return (
    <Full>
      <LinkWrapper to={`/conversation/${id}`}>
        <Header>{operation}</Header>
        <Img
          width={25}
          src={searchIcon}
          title="Inspect request transaction history"
          alt="Inspect request transaction history"
        />
      </LinkWrapper>
      <StatusWrapper>
        <Status>
          {type}
        </Status>
        {
          onCancel && (
            <CancelHeaderButton onClick={() => onCancel(id, partner, type)}>
              <Img
                width={17}
                src={removeIcon}
                title="Delete this card from view"
                alt="Delete this card from view"
              />
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
  const [message, setMessage] = useState('');
  const [isConfirmButtonEnabled, setConfirmButtonEnabled] = useState(true);

  useEffect(() => {
    if (user.role === 'SP' && asset.price === 'Pending') {
      setConfirmButtonEnabled(false);
    } else if (user.balance <= 0) {
      setConfirmButtonEnabled(false);
    } if (user.role === 'SR' && asset.type === 'proposal' &&  Date.parse(asset.startTime) < Date.now()) {
      setConfirmButtonEnabled(false);
    } else {
      setConfirmButtonEnabled(true);
      setPrice(asset.price);
    }
  }, [user]);

  function change({ target: { value } }) {
    setPrice(Number(value));
    if (asset.startTimestamp > Date.now() && Number(value) > 0) {
      setConfirmButtonEnabled(true);
    } else {
      setConfirmButtonEnabled(false);
    }
  };

  function alert(text) {
    setMessage(text);
    setTimeout(() => setMessage(''), 1500);
  };

  function isValidGPS(gps) {
    const [lat, lon] = gps.split(',');
    const latRegex = /^(-?[1-8]?\d(?:\.\d{1,18})?|90(?:\.0{1,18})?)$/;
    const lonRegex = /^(-?(?:1[0-7]|[1-9])?\d(?:\.\d{1,18})?|180(?:\.0{1,18})?)$/;
    
    if (latRegex.test(Number(lat)) && lonRegex.test(Number(lon))) {
        return true;
    }
    return false;
  }

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
                asset.params
                  .filter(({ idShort }) => !['preis', 'price'].includes(idShort))
                  .map(({ idShort, semanticId, value }) => (
                    <RowThird key={idShort}>
                      <RowLink
                        href={`${eClassCatalog}${semanticId.replace(/#/g, '%23')}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Go to eCl@ss to see property specs"
                      >
                        {idShort}
                      </RowLink>
                      <Data>
                        {
                          typeof value === 'string' && isValidGPS(value)
                          ? ( <React.Fragment>
                                { value.toString() }
                                <a 
                                  href={`${googleMaps}${value}`} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Img
                                    width={20}
                                    src={mapIcon}
                                    title="View on Google Maps"
                                    alt="View on Google Maps"
                                  />
                                </a>
                              </React.Fragment>
                            )
                          : value.toString()
                        }
                      </Data>
                    </RowThird>
                ))
              }
            </Row>
          ) : null
        }
        <Row>
          <RowThird>
            <RowDesc>Requester Location</RowDesc>
            <Data>
              {asset.location || '--'}
              <a 
                href={`${googleMaps}${asset.location}`} 
                target="_blank"
                rel="noopener noreferrer"
              >
                <Img
                  width={20}
                  src={mapIcon}
                  title="View on Google Maps"
                  alt="View on Google Maps"
                />
              </a>
            </Data>
          </RowThird>
          <RowThird>
            <RowDesc>Partner:</RowDesc>
            {
              asset.partnerName === 'Pending'
                ? (<Data>{asset.partnerName}</Data>)
                : (
                  <Data>
                    <Clipboard
                      style={{ background: 'none', display: 'block' }}
                      data-clipboard-text={asset.partnerName}
                      onSuccess={() => alert('Successfully Copied')}
                    >
                      <CopyBox>
                        { asset.partnerName && asset.partnerName.indexOf('did:iota:') === 0 
                          ? `${asset.partnerName.substr(9, 15)}...` 
                          : asset.partnerName
                        }
                      </CopyBox>
                    </Clipboard>
                    <Alert message={message}>{message}</Alert>
                  </Data>
                )
            }
          </RowThird>
        </Row>
        <Row>
          <RowThird>
            <RowDesc>Contract begin:</RowDesc>
            <Data>{asset.startTime}</Data>
          </RowThird>
          <RowThird>
            <RowDesc>Contract end:</RowDesc>
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

const RowLink = styled.a`
  font: 16px 'Nunito Sans', sans-serif;
  font-weight: 600;
  color: #529FF8;
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
  flex-direction: row;
  justify-content: space-between;
`;

const Status = styled.h3`
  color: #313131;
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

const Img = styled.img`
  cursor: pointer;
  margin-left: 20px;
`;

const LinkWrapper = styled(Link)`
  display: flex;
  flex-direction: row;
`;

const CopyBox = styled(Data)`
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    opacity: 0.6;
  }
`;

const Alert = styled.span`
  font-size: 16px;
  line-height: 32px;
  color: #808b92;
  opacity: ${props => (props.message ? 1 : 0)};
  transition: all 0.5s ease;
`;
