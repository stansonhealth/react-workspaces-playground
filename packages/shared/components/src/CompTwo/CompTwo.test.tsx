import React from 'react';
import ReactDOM from 'react-dom';
import CompTwo from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CompTwo />, div);
  ReactDOM.unmountComponentAtNode(div);
});
