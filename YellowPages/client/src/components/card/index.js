import React from 'react';
import styled from 'styled-components';

export default props => {
  return (
    <Card data-component="AssetCard">
      {props.header ? <CardHeader>{props.header}</CardHeader> : null}
      {props.children}
      {props.footer ? <CardFooter>{props.footer}</CardFooter> : null}
    </Card>
  );
}

const Card = styled.div`
  color: inherit;
  text-decoration: none;
  position: relative;
  border-radius: 6px;
  background-color: #FFFFFF;
  cursor: default;
  width: 850px;
  height: 100%;
  border: 1px solid #F2F5FB;
  @media (max-width: 1120px) {
    margin-bottom: 20px;
  }
  @media (max-width: 890px) {
    width: 90%;
  }
  @media (max-width: 400px) {
    width: 280px;
  }
`;

const CardHeader = styled.header`
  position: relative;
  padding: 20px 30px;
  border-bottom: 1px solid #eaecee;
`;

const CardFooter = styled.footer`
  padding: 20px 30px;
  background-color: rgba(206, 218, 226, 0.2);
  border-top: 1px solid #eaecee;
  cursor: default;
`;
