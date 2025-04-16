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
}); 