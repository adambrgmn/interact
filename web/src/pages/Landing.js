import React, { useState } from 'react';
import styled from 'styled-components';
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
`;

function Landing() {
  const [sessionId, setSessionId] = useState('');
  const handleChange = e => setSessionId(e.target.value);
  const handleSubmit = e => e.preventDefault();

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

          <CtaButton type="submit">Join session</CtaButton>
        </form>
      </div>
    </Main>
  );
}

export default Landing;
