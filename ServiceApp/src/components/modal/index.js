import React from 'react';
import styled from 'styled-components';

export default ({ show, type = 'general', notification = null, error = null, callback = null }) => {
  const closeButton = (
    <Button type="button" className="btn btn-accent txt-bold modal-trigger" onClick={() => callback()}>
      Close
    </Button>
  );

  const cancelButton = (
    <Button type="button" onClick={() => callback()}>
      Cancel
    </Button>
  );

  const confirmButton = (
    <Button type="button" onClick={() => callback(true)}>
      Confirm
    </Button>
  );

  const notifications = {
    general: {
      heading: 'Error',
      body: 'Error',
      buttonConfirm: closeButton
    },
    confirmRemove: {
      heading: 'Remove request',
      body: notification,
      buttonReject: cancelButton,
      buttonConfirm: confirmButton
    }
  };

  const content = notifications[type];

  return (
    <Modal className="access-modal-wrapper" show={show}>
      <AccessBox className="access-modal">
        <Internal>
          <Heading>{content.heading}</Heading>
          <Info>{(error || error.body) || content.body || '--'}</Info>
          <ButtonsWrapper>
            { content.buttonReject || null }
            { content.buttonConfirm || null }
          </ButtonsWrapper>
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
  background-color: rgba(246,248,252, 0.97);
  z-index: 3;
`;

const AccessBox = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 50vh;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  height: 280px;
  padding: 30px;
  border-radius: 6px;
  background-color: rgba(195,208,228, 0.6);
  box-shadow: 0 23px 50px 0 rgba(25, 54, 80, 0.1);
`;

const Heading = styled.p`
  font-size: 28px;
  font-weight: 100;
  line-height: 42px;
  margin-bottom: 12px;
  text-align: center;
  color: #4140DF;
`;

const Info = styled.p`
  font-size: 18px;
  line-height: 28px;
  color: #485776;
  text-align: center;
  margin-bottom: auto;
  padding-bottom: 20px;
`;

const Button = styled.button`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  outline: none;
  font: 16px 'Nunito Sans', sans-serif;
  letter-spacing: 0.15px;
  line-height: 17px;
  padding: 12px 20px 10px;
  border-radius: 6px;
  color: #ffffff;
  background-color: #4140DF;
  border: none;
  font-weight: 800;
  width: 150px;
  height: 48px;
  text-transform: uppercase;

  &:hover {
    color: #4140DF;
    background-color: #ffffff;
    border: 2px solid #4140DF;
  }
`;

const Internal = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80%;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;
