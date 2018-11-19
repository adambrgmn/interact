/* eslint-disable import/no-extraneous-dependencies */
import { render } from 'react-testing-library';

const customRender = (node, options) => render(node, options);

export { customRender as render };
