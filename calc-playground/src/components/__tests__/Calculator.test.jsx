import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../Calculator';

describe('Calculator Component', () => {
  test('renders calculator display', () => {
    const { container } = render(<Calculator onResultChange={() => {}} />);
    const displayElement = container.querySelector('.calculator-display');
    expect(displayElement).toHaveTextContent('0');
  });

  test('updates display when digits are clicked', () => {
    const { container } = render(<Calculator onResultChange={() => {}} />);
    const display = container.querySelector('.calculator-display');
    
    // Click on digit 1
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    expect(display).toHaveTextContent('1');
    
    // Click on digit 2
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    expect(display).toHaveTextContent('12');
  });

  test('performs addition correctly', () => {
    const mockResultChange = jest.fn();
    const { container } = render(<Calculator onResultChange={mockResultChange} />);
    const display = container.querySelector('.calculator-display');
    
    // Input 5 + 3 = 8
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    expect(display).toHaveTextContent('8');
    expect(mockResultChange).toHaveBeenCalledWith(8);
  });

  test('performs subtraction correctly', () => {
    const mockResultChange = jest.fn();
    const { container } = render(<Calculator onResultChange={mockResultChange} />);
    const display = container.querySelector('.calculator-display');
    
    // Input 9 - 4 = 5
    fireEvent.click(screen.getByRole('button', { name: '9' }));
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    expect(display).toHaveTextContent('5');
    expect(mockResultChange).toHaveBeenCalledWith(5);
  });

  test('performs multiplication correctly', () => {
    const mockResultChange = jest.fn();
    const { container } = render(<Calculator onResultChange={mockResultChange} />);
    const display = container.querySelector('.calculator-display');
    
    // Input 6 * 7 = 42
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    fireEvent.click(screen.getByRole('button', { name: '×' }));
    fireEvent.click(screen.getByRole('button', { name: '7' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    expect(display).toHaveTextContent('42');
    expect(mockResultChange).toHaveBeenCalledWith(42);
  });

  test('performs division correctly', () => {
    const mockResultChange = jest.fn();
    const { container } = render(<Calculator onResultChange={mockResultChange} />);
    const display = container.querySelector('.calculator-display');
    
    // Input 8 ÷ 2 = 4
    fireEvent.click(screen.getByRole('button', { name: '8' }));
    fireEvent.click(screen.getByRole('button', { name: '÷' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    expect(display).toHaveTextContent('4');
    expect(mockResultChange).toHaveBeenCalledWith(4);
  });

  test('clears display when C button is clicked', () => {
    const { container } = render(<Calculator onResultChange={() => {}} />);
    const display = container.querySelector('.calculator-display');
    
    // Input some numbers
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '6' }));
    expect(display).toHaveTextContent('56');
    
    // Clear the display
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    expect(display).toHaveTextContent('0');
  });

  test('can handle decimal numbers', () => {
    const { container } = render(<Calculator onResultChange={() => {}} />);
    const display = container.querySelector('.calculator-display');
    
    // Input 3.14
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    
    expect(display).toHaveTextContent('3.14');
  });

  test('ignores multiple decimals in the same number', () => {
    const { container } = render(<Calculator onResultChange={() => {}} />);
    const display = container.querySelector('.calculator-display');
    
    // Try to input 3.1.4 (should become 3.14)
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '.' })); // Second decimal should be ignored
    fireEvent.click(screen.getByRole('button', { name: '4' }));
    
    expect(display).toHaveTextContent('3.14');
  });

  test('performs operations with decimal numbers', () => {
    const mockResultChange = jest.fn();
    const { container } = render(<Calculator onResultChange={mockResultChange} />);
    const display = container.querySelector('.calculator-display');
    
    // Input 1.5 + 2.5 = 4
    fireEvent.click(screen.getByRole('button', { name: '1' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '.' }));
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    expect(display).toHaveTextContent('4');
    expect(mockResultChange).toHaveBeenCalledWith(4);
  });

  test('handles chain operations correctly', () => {
    const mockResultChange = jest.fn();
    const { container } = render(<Calculator onResultChange={mockResultChange} />);
    const display = container.querySelector('.calculator-display');
    
    // Input 5 + 3 - 2 = 6
    fireEvent.click(screen.getByRole('button', { name: '5' }));
    fireEvent.click(screen.getByRole('button', { name: '+' }));
    fireEvent.click(screen.getByRole('button', { name: '3' }));
    fireEvent.click(screen.getByRole('button', { name: '−' }));
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    fireEvent.click(screen.getByRole('button', { name: '=' }));
    
    expect(display).toHaveTextContent('6');
    expect(mockResultChange).toHaveBeenCalledWith(6);
  });
}); 