import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import Too from './index';

describe('<Too />', () => {
  it('render Too with dumi', () => {
    const msg = 'dumi';

    render(<Too title={msg} />);
    expect(screen.queryByText(msg)).toBeInTheDocument();
  });
});
