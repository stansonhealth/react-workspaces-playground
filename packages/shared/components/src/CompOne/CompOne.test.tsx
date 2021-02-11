import React from 'react';
import ReactDOM from 'react-dom';
import CompOne from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<CompOne />, div);
  ReactDOM.unmountComponentAtNode(div);
});
