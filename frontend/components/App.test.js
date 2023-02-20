import React from 'react';
import AppFunctional from './AppFunctional';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

test('sanity', () => {
  expect(true).toBe(true)
})

test('renders the coordinates header ', () => {
  render(<AppFunctional/>);

  const coordinatesHeader = screen.queryByText(/coordinates/i);

  expect(coordinatesHeader).toBeInTheDocument();

});

test('renders the steps header ', () => {
  render(<AppFunctional/>);

    const stepsHeader = screen.queryByText(/moved/i);

    expect (stepsHeader).toBeInTheDocument();

  
});

test('renders left and right buttons', () => {
  render(<AppFunctional/>);

    const leftButton = screen.queryByText('LEFT');
    const rightButton = screen.queryByText('RIGHT');
    
    
    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
    

});

test('renders reset button', () => {
  render(<AppFunctional/>);

    const resetButton = screen.queryByText('reset');
    
    expect(resetButton).toBeInTheDocument();

});

test('renders up and down buttons', () => {
  render(<AppFunctional/>);

    const upButton = screen.queryByText('UP');
    const downButton = screen.queryByText('DOWN');
    
    expect(upButton).toBeInTheDocument();
    expect(downButton).toBeInTheDocument();
    

});













