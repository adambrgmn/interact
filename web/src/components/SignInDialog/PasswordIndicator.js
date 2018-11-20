/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import zxcvbn from 'zxcvbn';

function PasswordIndicator({ password, email, name }) {
  const [strength, setStrength] = useState(0);
  const [warning, setWarning] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(
    () => {
      const { score, feedback } = zxcvbn(password, [email, name]);
      setStrength(score);

      if (feedback) {
        setWarning(feedback.warning);
        setSuggestions(feedback.suggestions);
      } else {
        setWarning('');
        setSuggestions([]);
      }
    },
    [password, email, name],
  );

  return (
    <div>
      <div
        style={{
          width: '400px',
          display: 'flex',
          flexFlow: 'row no-wrap',
          justifyContent: 'space-between',
        }}
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              height: '5px',
              width: '95px',
              background: strength > i ? 'black' : 'grey',
            }}
          />
        ))}
      </div>
      <div>{warning && <p>Warning: {warning}</p>}</div>
      <div>
        {suggestions.length > 0 &&
          suggestions.map(sug => <p key={sug}>{sug}</p>)}
      </div>
    </div>
  );
}

PasswordIndicator.propTypes = {
  password: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default PasswordIndicator;
