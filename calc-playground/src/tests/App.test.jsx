import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';

test('renders app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Calc Playground/i);
  expect(headerElement).toBeInTheDocument();
});

test('loads JSON data', async () => {
  render(<App />);
  await waitFor(() => {
    expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
  }, { timeout: 5000 });
});