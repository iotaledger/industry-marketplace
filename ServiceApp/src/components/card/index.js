import React from 'react';
import styled from 'styled-components';

export default props => {
  return (
    <Card
      data-component="AssetCard"
      disableMargin={props.disableMargin}
    >
      {props.header ? <CardHeader>{props.header}</CardHeader> : null}
      {props.children}
      {props.footer ? <CardFooter>{props.footer}</CardFooter> : null}
    </Card>
  );
}

const Card = styled.div`
  max-width: 1030px;
  color: inherit;
  text-decoration: none;
  margin-bottom: 54px;
  border-radius: 6px;
  background-color: #fff;
  cursor: default;
  transition: box-shadow 0.19s ease-out;

  height: 100%;
  width: 100%;
  border: ${props => (props.ownAsset ? '1px solid #009fff' : '1px solid #eaecee')};
  @media (min-width: 769px) {
  }
  &:hover {
    box-shadow: 0 23px 50px 0 rgba(25, 54, 80, 0.1);
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
