import React, { useState } from 'react';
import { navigate } from '@reach/router';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';
import Input from '../components/Input';

const Main = styled.main`
  width: 100%;
  max-width: 25rem;
  padding: 0 0.5rem;
`;

const Message = styled.p`
  text-align: center;
  margin: 0;
  margin-bottom: 2rem;
`;

const CtaButton = styled.button`
  display: block;
  margin: 1.5rem auto 0;
  border: 1px solid ${p => p.theme.color.black};
  border-radius: 4px;
  padding: 0 2rem;
  background: transparent;
  font-family: ${p => p.theme.font.family};
  font-size: 1rem;
  line-height: 2;
  text-transform: capitalize;
  color: ${p => p.theme.color.black};

  ${p =>
    p.disabled &&
    css`
      border-color: ${lighten(0.3, p.theme.color.black)};
      color: ${lighten(0.3, p.theme.color.black)};
      pointer-events: none;
    `}
`;

function Landing() {
  const [sessionId, setSessionId] = useState('');
  const handleChange = e => setSessionId(e.target.value);
  const handleSubmit = e => e.preventDefault();

  const disabled = sessionId.length < 1;
  const handleClick = () => {
    const url = `/session/${sessionId}`;
    navigate(url);
  };

  return (
    <Main>
      <div>
        <Message>Join an active session</Message>

        <form onSubmit={handleSubmit}>
          <div>
            <Input
              type="tel"
              id="sessionId"
              name="sessionId"
              label="Enter session id"
              prefix="#"
              value={sessionId}
              onChange={handleChange}
            />
          </div>

          <CtaButton type="submit" disabled={disabled} onClick={handleClick}>
            Join session
          </CtaButton>
        </form>
      </div>
    </Main>
  );
}

export default Landing;
