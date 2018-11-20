import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';

const useForm = (initial = {}) => {
  const [values, setState] = useState(initial);
  const onChange = e => {
    const { name, value } = e.target;
    setState(curr => ({ ...curr, [name]: value }));
  };

  return [values, onChange];
};

const Form = forwardRef(({ onSubmit, fields, title }, forwardedRef) => {
  const [values, onChange] = useForm({ name: '', email: '', password: '' });

  const handleSubmit = e => {
    e.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{title}</h2>
      <div>
        {fields.map((field, i) => {
          const ref = i === 0 ? forwardedRef : null;
          return (
            <label key={field} htmlFor={field}>
              <span>{field}</span>
              <input
                ref={ref}
                type={field === 'name' ? 'text' : field}
                id={field}
                name={field}
                value={values[field]}
                onChange={onChange}
              />
            </label>
          );
        })}
      </div>

      <button type="submit">{title}</button>
    </form>
  );
});

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  fields: PropTypes.arrayOf(PropTypes.oneOf(['name', 'email', 'password']))
    .isRequired,
  title: PropTypes.string.isRequired,
};

export default Form;
