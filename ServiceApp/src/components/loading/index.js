import React from 'react';
import styled from 'styled-components';
import Delayed from './delayed';

export default ({ color = '#4140DF', size = '80', delay = null, text = null }) => (
  <Delayed delay={delay}>
    <Wrapper>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 38 38"
        stroke={color}
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(1 1)" strokeWidth="2">
            <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
            <path d="M36 18c0-9.94-8.06-18-18-18" transform="rotate(319.698 18 18)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 18 18"
                to="360 18 18"
                dur="1s"
                repeatCount="indefinite"
              />
            </path>
          </g>
        </g>
      </svg>
      {
        text && (
          <TextWrapper>
            {text}
          </TextWrapper>
        )
      }
    </Wrapper>
  </Delayed>
);

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextWrapper = styled.div`
  color: #485776;
  font-size: 22px;
  margin-top: 40px;
  width: 335px;
  line-height: 34px;
  text-align: center;
`;