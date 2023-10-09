import { render, screen, fireEvent } from '@testing-library/react'
import App from './App'

test('renders the footer text', () => {
  render(<App />)
  const footerElement = screen.getByText(/clearpoint.digital/i)
  expect(footerElement).toBeInTheDocument()
})

test('it handles input correctly', () => {
  const { getByPlaceholderText } = render(<App />);
  const inputElement = getByPlaceholderText('Enter description...');

  fireEvent.change(inputElement, { target: { value: 'New Task' } });

  expect(inputElement.value).toBe('New Task');
});
