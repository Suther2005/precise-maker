import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Precision Baking heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/precision baking/i);
  expect(headingElement).toBeInTheDocument();
});
