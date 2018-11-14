import React, { useState } from 'react';

const handleSubmit = e => {
  e.preventDefault();
};

function App() {
  const [sessionId, setSessionId] = useState('');
  const handleChange = e => setSessionId(Number.parseInt(e.target.value, 10));

  return (
    <div>
      <header>
        <div>
          <h1>Interact</h1>
          <h2>Let the audience ask the questions</h2>
        </div>

        <div>
          <a href="/sign-in">Sign in</a>
          {' | '}
          <a href="/sign-up">Sign up</a>
        </div>
      </header>

      <main>
        <div>
          <p>Enter an active session by providing the session number</p>
          <form onSubmit={handleSubmit}>
            <label htmlFor="sessionId">
              <span>Enter Session ID:</span>
              <span>#</span>
              <input
                type="number"
                id="sessionId"
                name="sessionId"
                value={sessionId}
                onChange={handleChange}
              />
            </label>

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
      </main>

      <footer>
        <p>
          Interact lets you engage your audience by opening up to questions but
          with the benefit of knowing the questions on beforehand.
        </p>
      </footer>
    </div>
  );
}

export default App;
