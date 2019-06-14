import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Loading from '../loading';

export default ({
  notification, 
  show, 
  error = null, 
  purchasePrice = null, 
  callback = null, 
  category = null,
  assetId = null
}) => {
  const backButton = (
    <Link to={'/dashboard'}>
      <Button type="button" className="btn btn-accent txt-bold modal-trigger">
        Go back
      </Button>
    </Link>
  );

  const ordersPageButton = (
    <Link to={'/orders'}>
      <Button type="button" className="btn btn-accent txt-bold modal-trigger">
        Go to Orders
      </Button>
    </Link>
  );

  const purchaseButton = (
    <Button type="button" className="btn btn-accent txt-bold modal-trigger" onClick={callback}>
      Purchase Access for {purchasePrice} IOTA
    </Button>
  );

  const closeButton = (
    <Button type="button" className="btn btn-accent txt-bold modal-trigger" onClick={callback}>
      Close
    </Button>
  );

  const seeMatchButton = (
    <Link to={`/order/${assetId}`}>
    <Button type="button" className="btn btn-accent txt-bold modal-trigger">
      See Match!
    </Button>
  </Link>
  )

  const icon = (
    <img
      src="/static/icons/icon-padlock.png"
      srcSet="/static/icons/icon-padlock@2x.png 2x"
      alt="Icon padlock"
    />
  );

  const notifications = {
    loading: {
      heading: 'Loading Asset',
      body: 'Fetching asset information and your purchase history.',
      loading: true
    },
    purchasing: {
      heading: 'Purchasing Asset',
      body: 'You are doing Proof of Work to attach this purchase to the network.',
      loading: true
    },
    fetching: {
      heading: 'Success!',
      body: 'Your purchase was successful',
      loading: true
    },
    noAsset: {
      heading: `Asset doesn't exist`,
      body: `The asset you are looking for doesn't exist, check the asset ID and try again`,
    },
    noWallet: {
      heading: 'Wallet does not exist',
      body: 'Setup wallet by clicking the top right, to get a prefunded IOTA wallet.',
    },
    noBalance: {
      heading: 'Not enough Balance',
      body: 'You have run out of IOTA',
    },
    assetMatchFound: {
      heading: 'Match Found!',
      body: `We found a matching asset for the ${category} you just created`,
      button: seeMatchButton,
    },
    dataReadingFailure: {
      heading: 'Data reading error',
      body: 'Asset data can not be fully retrieved.',
      button: backButton
    },
    purchaseFailed: {
      heading: 'Purchase Failed',
    },
    purchase: {
      heading: 'Purchase asset',
      body: `You can purchase this asset by clicking below.`,
      button: purchaseButton,
      icon
    },
    orderCompleted: {
      heading: 'Order completed',
      body: 'Asset was successfully purchased.',
      button: ordersPageButton
    },
    generalError: {
      heading: 'Error',
      body: 'Error',
      button: closeButton
    }
  };

  const content = notification ? notifications[notification] : {};

  return (
    <Modal className="access-modal-wrapper" show={show}>
      <AccessBox className="access-modal">
        <Internal>
          { content.icon || null }
          <Heading>{content.heading || '--'}</Heading>
          <Info>{(error && error.body) || content.body || '--'}</Info>
          { content.loading && <Loading /> }
          { content.button || null }
        </Internal>
      </AccessBox>
    </Modal>
  );
}

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  visibility: ${props => (props.show ? 'visible' : 'hidden')};
  display: ${props => (props.show ? 'block' : 'none')};
  opacity: ${props => (props.show ? 1 : 0)};
  transition: all 0.5s ease;
  background-color: rgba(14, 56, 160, 0.6);
`;

const AccessBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  height: 280px;
  padding: 30px;
  border-radius: 6px;
  background-color: rgba(10, 32, 86, 0.9);
  box-shadow: 0 23px 50px 0 rgba(25, 54, 80, 0.1);
`;

const Heading = styled.p`
  font-size: 28px;
  font-weight: 100;
  line-height: 42px;
  margin-bottom: 12px;
  text-align: center;
  color: #009fff;
`;

const Info = styled.p`
  font-size: 17px;
  line-height: 28px;
  color: #fff;
  text-align: center;
  margin-bottom: auto;
  padding-bottom: 20px;
`;

const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  font: 15px 'Nunito Sans', sans-serif;
  letter-spacing: 0.47px;
  padding: 20px 38px;
  border-radius: 100px;
  text-transform: uppercase;
  color: #fff;
  font-size: 12px;
  letter-spacing: 0.38px;
  padding: 12px 21px;
  margin: 15px 0 0;
  box-shadow: 0 10px 20px 0 #0a2056;
  font-weight: 700;
  background-color: #009fff;
`;

const Internal = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
`;
