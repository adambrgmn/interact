import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 100%;
  padding: 1rem;
  overflow-x: scroll;
`;

const Pre = styled.pre`
  font-family: ${p => p.theme.font.family};
  font-size: 0.75rem;
`;

function PrintProps({ className, indent, props }) {
  return (
    <Container>
      <Pre className={className}>{JSON.stringify(props, null, indent)}</Pre>
    </Container>
  );
}

PrintProps.defaultProps = {
  indent: 2,
  className: null,
};

PrintProps.propTypes = {
  className: PropTypes.string,
  indent: PropTypes.number,
  props: PropTypes.any.isRequired, // eslint-disable-line
};

export default PrintProps;
