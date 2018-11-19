import React, { useState } from 'react';
import { navigate } from '@reach/router';
import Input from '../components/Input';

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
    <main>
      <div>
        <p>Join an active session</p>

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

          <button type="submit" disabled={disabled} onClick={handleClick}>
            Join session
          </button>
        </form>
      </div>
    </main>
  );
}

export default Landing;
