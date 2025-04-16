import { render, screen, fireEvent, act } from '@testing-library/react';
import BlocksArea from '../BlocksArea';
import { createRef } from 'react';

// Mock the react-dnd hooks
jest.mock('react-dnd', () => ({
  useDrag: () => [{ isDragging: false }, jest.fn()],
  useDrop: () => [{ isOver: false }, jest.fn()],
  DndProvider: ({ children }) => children
}));

// Mock react-dnd backends
jest.mock('react-dnd-html5-backend', () => ({
  HTML5Backend: {}
}));

jest.mock('react-dnd-touch-backend', () => ({
  TouchBackend: {}
}));

// Mock device detection
jest.mock('react-device-detect', () => ({
  isMobile: false
}));

describe('BlocksArea Component', () => {
  const mockNumberData = {
    "5": {
      "colors": {
        "red": 3,
        "blue": 2
      },
      "clubs": {
        "step_squad": true,
        "super_rectangle": true
      },
      "real_world_examples": ["Five fingers on a hand"]
    }
  };

  test('renders with no blocks when number data is not available', () => {
    render(<BlocksArea number="1" numberData={{}} activeColor="red" />);
    const blocksContainer = screen.getByTestId('blocks-container');
    expect(blocksContainer).toBeInTheDocument();
    expect(blocksContainer.children.length).toBe(0);
  });

  test('renders blocks based on number data', () => {
    render(<BlocksArea number="5" numberData={mockNumberData} activeColor="red" />);
    
    // Should render 5 blocks total (3 red + 2 blue)
    const blocks = screen.getAllByTestId('block');
    expect(blocks.length).toBe(5);
  });

  test('renders club buttons when clubs data is available', () => {
    render(<BlocksArea number="5" numberData={mockNumberData} activeColor="red" />);
    
    // Should render club buttons
    const stepSquadButton = screen.getByText(/step squad/i);
    const superRectangleButton = screen.getByText(/super rectangle/i);
    
    expect(stepSquadButton).toBeInTheDocument();
    expect(superRectangleButton).toBeInTheDocument();
  });

  test('renders examples when available', () => {
    render(<BlocksArea number="5" numberData={mockNumberData} activeColor="red" />);
    
    // Should render examples
    const exampleText = screen.getByText(/Five fingers on a hand/i);
    expect(exampleText).toBeInTheDocument();
  });

  test('addBlocks method adds blocks', async () => {
    const ref = createRef();
    render(<BlocksArea ref={ref} number="5" numberData={mockNumberData} activeColor="red" />);
    
    // Initial number of blocks
    const initialBlocks = screen.getAllByTestId('block');
    const initialCount = initialBlocks.length;
    
    // Add 3 blocks
    await act(async () => {
      ref.current.addBlocks(3, 'red');
    });
    
    // Should have 3 more blocks
    const updatedBlocks = screen.getAllByTestId('block');
    expect(updatedBlocks.length).toBe(initialCount + 3);
  });

  test('reset method clears all blocks', async () => {
    const ref = createRef();
    render(<BlocksArea ref={ref} number="5" numberData={mockNumberData} activeColor="red" />);
    
    // Verify blocks are rendered
    const initialBlocks = screen.getAllByTestId('block');
    expect(initialBlocks.length).toBeGreaterThan(0);
    
    // Reset blocks
    await act(async () => {
      ref.current.reset();
    });
    
    // Should have no blocks
    const blocksContainer = screen.getByTestId('blocks-container');
    expect(blocksContainer.children.length).toBe(0);
  });

  test('arranges blocks when club button is clicked', async () => {
    render(<BlocksArea number="5" numberData={mockNumberData} activeColor="red" />);
    
    // Find the step squad button
    const stepSquadButton = screen.getByText(/step squad/i);
    
    // Click the button
    await act(async () => {
      fireEvent.click(stepSquadButton);
    });
    
    // Blocks should still be there
    const blocks = screen.getAllByTestId('block');
    expect(blocks.length).toBe(5);
    
    // Positions would be updated, but we can't easily test exact positions
    // since the DOM doesn't update styles in JSDOM
  });
}); 