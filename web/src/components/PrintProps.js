import React from 'react';
import PropTypes from 'prop-types';

function PrintProps({ indent, props }) {
  return (
    <div
      style={{
        maxWidth: '100%',
        padding: '1rem',
        overflowX: 'scroll',
      }}
    >
      <pre>{JSON.stringify(props, null, indent)}</pre>
    </div>
  );
}

PrintProps.defaultProps = {
  indent: 2,
};

PrintProps.propTypes = {
  indent: PropTypes.number,
  props: PropTypes.any.isRequired, // eslint-disable-line
};

export default PrintProps;
