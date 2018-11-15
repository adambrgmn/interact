import React from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { ReactComponent as LogotypeComp } from '../logotype.svg';

const Container = styled.header`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  padding: 1rem;
  background-color: ${p => p.theme.color.black};
  transition: flex 0.3s ease-in-out;

  ${p =>
    p.small &&
    css`
      padding: 0.5rem;
      justify-content: flex-start;
    `}
`;

const TitleContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;

  ${p =>
    p.small &&
    css`
      flex-flow: row nowrap;
    `}
`;

const Logotype = styled(LogotypeComp)`
  width: 8rem;
  height: auto;
  margin-bottom: 0.5rem;
  fill: ${p => p.theme.color.brand};
  transition: width 0.3s ease-in-out;

  ${p =>
    p.small &&
    css`
      width: 4rem;
      margin-bottom: 0;
      margin-right: 0.5rem;
    `}
`;

const Title = styled.h1`
  margin: 0;
  font-family: 'Roboto Mono', monospace;
  font-size: 1rem;
  font-weight: normal;
  line-height: 1rem;
  color: ${p => p.theme.color.white};
`;

function Header({ small }) {
  return (
    <Container small={small}>
      <TitleContainer small={small}>
        <Logotype small={small} />

        <Title small={small}>Interact</Title>
      </TitleContainer>
    </Container>
  );
}

Header.propTypes = {
  small: PropTypes.bool,
};

export default Header;
