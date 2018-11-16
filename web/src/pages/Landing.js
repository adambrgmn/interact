import React, { useState } from 'react';
import styled from 'styled-components';
import Input from '../components/Input';

const Main = styled.main`
  width: 100%;
  max-width: 25rem;
  padding: 0.5rem;
`;

function Landing() {
  const [sessionId, setSessionId] = useState('');
  const handleChange = e => setSessionId(e.target.value);
  const handleSubmit = e => e.preventDefault();

  return (
    <Main>
      <div>
        <p>Join an active session by providing the session number</p>
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

          <button type="submit">Join session</button>
        </form>
      </div>

      <div>
        <p>Or create your own session</p>
        <div>
          <a href="/create">Create session</a>
        </div>
        <div>
          <a href="/manage">Manage your sessions</a>
        </div>
      </div>
    </Main>
  );
}

export default Landing;
