import { render, screen } from '@testing-library/react';
import App from './App.jsx';

test('renders nft dashboard heading', () => {
  render(<App />);
  const linkElement = screen.getByText(/nft dashboard with live trust scoring/i);
  expect(linkElement).toBeInTheDocument();
});
