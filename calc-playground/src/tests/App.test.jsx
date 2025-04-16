import { render, screen, waitFor, act } from '@testing-library/react';
import App from '../App';

// Create a controlled promise to mock fetch properly with act
let resolveJsonPromise;
const jsonPromise = new Promise(resolve => {
  resolveJsonPromise = resolve;
});

// Mock fetch before tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => jsonPromise
  })
);

// Sample test data
const mockData = {
  "1": {
    "colors": {"red": 1},
    "clubs": {
      "odd": true,
      "even": false
    },
    "real_world_examples": ["Single item"]
  }
};

beforeEach(() => {
  fetch.mockClear();
});

test('renders loading state initially', () => {
  render(<App />);
  expect(screen.getByText(/Loading number data/i)).toBeInTheDocument();
});

test('renders app header after loading', async () => {
  // Use act to wrap the component rendering
  let rendered;
  await act(async () => {
    rendered = render(<App />);
    // Resolve the fetch only inside act
    resolveJsonPromise(mockData);
  });
  
  // Wait for loading to complete
  await waitFor(() => {
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
  
  // Now check for the header
  const headerElement = screen.getByText(/Calc Playground/i);
  expect(headerElement).toBeInTheDocument();
});

test('loads JSON data correctly', async () => {
  await act(async () => {
    render(<App />);
    // Resolve the fetch inside act
    resolveJsonPromise(mockData);
  });
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument();
  });
  
  // Check that fetch was called with the correct URL
  expect(fetch).toHaveBeenCalledWith('/numbers-data.json');
});