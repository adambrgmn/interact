import React from 'react';
import styled from 'styled-components';
import { borderRadius } from 'polished';

const Label = styled.label`
  display: flex;
  width: 100%;
  flex-flow: row wrap;
`;

const LabelText = styled.span``;

const InputContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
  max-width: 22rem;
`;

const InputPrefix = styled.span`
  display: block;
  border-right: none;
  border: 1px solid ${p => p.theme.color.black};
  ${borderRadius('left', '4px')};
  padding: 0 0.5rem;
  font-size: 1.5rem;
  line-height: 1.5;
  text-align: center;
`;

const InputComp = styled.input`
  flex: 1;
  ${borderRadius('right', '4px')};
  border: 1px solid ${p => p.theme.color.black};
  padding: 0;
  font-size: 1.5rem;
  font-family: ${p => p.theme.font.family};
  line-height: 1.5;
`;

function Input({ id, label, prefix, className, ...props }) {
  return (
    <Label htmlFor={id}>
      <LabelText>{label}</LabelText>
      <InputContainer>
        {prefix && <InputPrefix>{prefix}</InputPrefix>}
        <InputComp id={id} {...props} />
      </InputContainer>
    </Label>
  );
}

export default Input;
