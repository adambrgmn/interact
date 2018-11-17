import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    position: relative;

    margin: 0;
    padding: 0;

    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    text-rendering: optimizeLegibility;

    -webkit-tap-highlight-color: transparent;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: ${p => p.theme.font.family};
    color: ${p => p.theme.color.black};
  }

`;

export default GlobalStyle;
