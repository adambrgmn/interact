import { Children, cloneElement, useEffect } from 'react';
import PropTypes from 'prop-types';

const createTab = element => {
  if (!element) return null;
  if (!element.props.tab)
    throw new Error('Each child of <Tabs /> must have a prop "tab"');

  const { tab, children, ...props } = element.props;

  return { element, tab, children, props };
};

const pick = (tabs, currentTab) => {
  const match = tabs.find(tab => tab.tab === currentTab);
  return match;
};

function Tabs({ currentTab, children, initialFocusRef }) {
  const tabs = Children.map(children, createTab);
  const selectedTab = pick(tabs, currentTab);

  const clone = cloneElement(
    selectedTab.element,
    selectedTab.props,
    selectedTab.children,
  );

  useEffect(
    () => {
      if (initialFocusRef && initialFocusRef.current) {
        initialFocusRef.current.focus();
      } else if (initialFocusRef && initialFocusRef.focus) {
        initialFocusRef.focus();
      }
    },
    [currentTab, initialFocusRef],
  );

  return clone;
}

Tabs.propTypes = {
  currentTab: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default Tabs;
