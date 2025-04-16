import { render, screen, fireEvent } from '@testing-library/react';
import ControlPanel from '../ControlPanel';

describe('ControlPanel Component', () => {
  // Mock functions
  const mockAddBlocks = jest.fn();
  const mockColorChange = jest.fn();

  beforeEach(() => {
    mockAddBlocks.mockClear();
    mockColorChange.mockClear();
    
    // Mock window.calcPlaygroundAPI
    window.calcPlaygroundAPI = {
      reset: jest.fn()
    };
  });

  test('renders color selector with options', () => {
    const { container } = render(<ControlPanel onAddBlocks={mockAddBlocks} onColorChange={mockColorChange} />);
    
    // Check for the color selector label
    expect(screen.getByText(/Block Color:/i)).toBeInTheDocument();
    
    // Check for color options using DOM query
    const colorOptions = container.querySelectorAll('.color-option');
    
    // There should be 7 color options (red, orange, yellow, green, blue, indigo, violet)
    expect(colorOptions.length).toBe(7);
  });

  test('renders number buttons', () => {
    render(<ControlPanel onAddBlocks={mockAddBlocks} onColorChange={mockColorChange} />);
    
    // Check for the add blocks label
    expect(screen.getByText(/Add Blocks:/i)).toBeInTheDocument();
    
    // Check for all number buttons (1, 2, 3, 4, 5, 10)
    expect(screen.getByRole('button', { name: '1' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '4' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '5' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '10' })).toBeInTheDocument();
  });

  test('clicking color option calls onColorChange', () => {
    const { container } = render(<ControlPanel onAddBlocks={mockAddBlocks} onColorChange={mockColorChange} />);
    
    // Find color options using DOM query
    const colorOptions = container.querySelectorAll('.color-option');
    
    // Click the first color option (red)
    fireEvent.click(colorOptions[0]);
    
    // Check if onColorChange was called with the correct color
    expect(mockColorChange).toHaveBeenCalledTimes(1);
    expect(mockColorChange).toHaveBeenCalledWith('#FF0000');
  });

  test('clicking number button calls onAddBlocks', () => {
    render(<ControlPanel onAddBlocks={mockAddBlocks} onColorChange={mockColorChange} />);
    
    // Click on the button for adding 5 blocks
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    
    // Check if onAddBlocks was called with the correct number
    expect(mockAddBlocks).toHaveBeenCalledTimes(1);
    expect(mockAddBlocks).toHaveBeenCalledWith(5, '#FF5252'); // Default color is #FF5252
  });

  test('clicking reset button calls reset API', () => {
    render(<ControlPanel onAddBlocks={mockAddBlocks} onColorChange={mockColorChange} />);
    
    // Find and click the reset button
    fireEvent.click(screen.getByRole('button', { name: /reset blocks/i }));
    
    // Check if the API reset function was called
    expect(window.calcPlaygroundAPI.reset).toHaveBeenCalledTimes(1);
  });

  test('changing color updates selected color for adding blocks', () => {
    const { container } = render(<ControlPanel onAddBlocks={mockAddBlocks} onColorChange={mockColorChange} />);
    
    // Get all color options
    const colorOptions = container.querySelectorAll('.color-option');
    
    // Click on the green color option (index 3)
    fireEvent.click(colorOptions[3]); // Green
    
    // Then add blocks with the new color
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    
    // Check if onAddBlocks was called with the right color
    expect(mockAddBlocks).toHaveBeenCalledWith(3, '#008000'); // Green color
  });
}); 