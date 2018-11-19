import React, { useState } from 'react';
import { navigate } from '@reach/router';

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
            <label htmlFor="sessionId">
              <span>Enter session id</span>
              <input
                type="tel"
                id="sessionId"
                name="sessionId"
                value={sessionId}
                onChange={handleChange}
              />
            </label>
          </div>

          <div>
            <button type="submit" disabled={disabled} onClick={handleClick}>
              Join session
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Landing;
