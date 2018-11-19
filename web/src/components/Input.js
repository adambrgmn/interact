import React from 'react';

function Input({ id, label, ...props }) {
  return (
    <label htmlFor={id}>
      <span>{label}</span>
      <input id={id} {...props} style={{ border: '1px solid black' }} />
    </label>
  );
}

export default Input;
