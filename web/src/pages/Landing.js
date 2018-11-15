import React, { useState } from 'react';
import Input from '../components/Input';

function Landing() {
  const [sessionId, setSessionId] = useState('');
  const handleChange = e => {
    const num = Number.parseInt(e.target.value, 10);
    if (!Number.isNaN(num)) setSessionId(num);
  };
  const handleSubmit = e => e.preventDefault();

  return (
    <main>
      <div>
        <p>Join an active session by providing the session number</p>
        <form onSubmit={handleSubmit}>
          <div>
            <Input
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

        <div>
          <p>Or create your own session</p>
          <div>
            <a href="/create">Create session</a>
          </div>
          <div>
            <a href="/manage">Manage your sessions</a>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Landing;
