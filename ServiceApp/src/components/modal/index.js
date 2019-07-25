import React from 'react';
import styled from 'styled-components';

export default ({ show, error = null, callback = null }) => {
  const closeButton = (
    <Button type="button" className="btn btn-accent txt-bold modal-trigger" onClick={callback}>
      Close
    </Button>
  );

  const content = {
    heading: 'Error',
    body: 'Error',
    button: closeButton
  };

  return (
    <Modal className="access-modal-wrapper" show={show}>
      <AccessBox className="access-modal">
        <Internal>
          <Heading>{content.heading}</Heading>
          <Info>{(error && error.body) || content.body || '--'}</Info>
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
