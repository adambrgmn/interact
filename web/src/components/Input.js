import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { lighten } from 'polished';

const Label = styled.label`
  width: 100%;
`;

const LabelText = styled.span``;

const InputContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: flex-start;
  align-items: center;
  border: 1px solid ${p => p.theme.color.black};
  border-radius: 4px;

  ${p =>
    p.inFocus &&
    css`
      border-color: ${p.theme.color.brand};
    `}
`;

const InputPrefix = styled.span`
  padding: 0 0.25rem 0 0.75rem;
  font-size: 1.5rem;
  line-height: 1.5;
  text-align: center;
  vertical-align: middle;
  color: ${p => lighten(0.3, p.theme.color.black)};
`;

const InputComp = styled.input`
  flex: 1;
  width: 1px;
  border: none;
  padding: 0 0.75rem 0 0;
  font-size: 1.5rem;
  font-family: ${p => p.theme.font.family};
  line-height: 1.5;
  vertical-align: middle;
  color: ${p => p.theme.color.black};

  &:focus {
    outline: none;
  }
`;

function Input({ id, label, prefix, className, onFocus, onBlur, ...props }) {
  const [inFocus, setFocus] = useState(false);

  const handleFocus = e => {
    setFocus(true);
    if (onFocus) onFocus(e);
  };
  const handleBlur = e => {
    setFocus(false);
    if (onBlur) onBlur(e);
  };

  return (
    <Label htmlFor={id}>
      <LabelText>{label}</LabelText>
      <InputContainer inFocus={inFocus}>
        {prefix && <InputPrefix>{prefix}</InputPrefix>}
        <InputComp
          id={id}
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </InputContainer>
    </Label>
  );
}

export default Input;
