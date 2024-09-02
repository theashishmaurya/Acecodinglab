import App from "./App";
import "@testing-library/jest-dom";
import { render } from "@testing-library/react";

// describe('App Component', () => {
//   test('renders welcome message and tagline (should pass)', () => {
//     render(<App />);
    
//     const welcomeElement = screen.getByText(/Welcome/i);
//     expect(welcomeElement).toBeInTheDocument();
    
//     const taglineElement = screen.getByText(/Enhance your Frontend skills and achieve your goals!/i);
//     expect(taglineElement).toBeInTheDocument();
//   });

//   test('renders incorrect number of features (should fail)', () => {
//     render(<App />);
    
//     const featureElements = screen.getAllByRole('heading', { level: 3 });
//     expect(featureElements).toHaveLength(3); 
//   });
// });


test('renders component', () => {
  const { debug } = render(<App />);
  debug();
});