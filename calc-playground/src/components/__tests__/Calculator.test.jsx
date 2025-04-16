import { render, screen, fireEvent } from '@testing-library/react';
import Calculator from '../Calculator';

describe('Calculator Component', () => {
  test('renders calculator display', () => {
    render(<Calculator onResultChange={() => {}} />);
    const displayElement = screen.getByText('0');
    expect(displayElement).toBeInTheDocument();
  });

  test('updates display when digits are clicked', () => {
    render(<Calculator onResultChange={() => {}} />);
    
    // Click on digit 1
    fireEvent.click(screen.getByText('1'));
    expect(screen.getByText('1')).toBeInTheDocument();
    
    // Click on digit 2
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  test('performs addition correctly', () => {
    const mockResultChange = jest.fn();
    render(<Calculator onResultChange={mockResultChange} />);
    
    // Input 5 + 3 = 8
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(mockResultChange).toHaveBeenCalledWith(8);
  });

  test('clears display when C button is clicked', () => {
    render(<Calculator onResultChange={() => {}} />);
    
    // Input some numbers
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('6'));
    expect(screen.getByText('56')).toBeInTheDocument();
    
    // Clear the display
    fireEvent.click(screen.getByText('C'));
    expect(screen.getByText('0')).toBeInTheDocument();
  });
}); 