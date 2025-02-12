import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Accordion } from "./App";

// Mock data for testing
const mockQuestions = [
  { id: 1, title: "Question 1", info: "Answer 1" },
  { id: 2, title: "Question 2", info: "Answer 2" },
];

describe("Accordion Component", () => {
  test("renders accordion title", () => {
    render(<Accordion question={mockQuestions[0]} />);
    expect(screen.getByText("Question 1")).toBeInTheDocument();
  });

  test("does not show info by default", () => {
    render(<Accordion question={mockQuestions[0]} />);
    expect(screen.queryByText("Test Info")).not.toBeInTheDocument();
  });

  test("shows info when toggle button is clicked", () => {
    render(<Accordion question={mockQuestions[0]} />);
    fireEvent.click(screen.getByTestId("toogle-button"));
    expect(screen.getByText("Answer 1")).toBeInTheDocument();
  });

  test("hides info when toggle button is clicked twice", () => {
    render(<Accordion question={mockQuestions[0]} />);
    const button = screen.getByTestId("toogle-button");
    fireEvent.click(button);
    fireEvent.click(button);
    expect(screen.queryByText("Answer 1")).not.toBeInTheDocument();
  });

  test("toggle button shows correct icon", () => {
    render(<Accordion question={mockQuestions[0]} />);
    const button = screen.getByTestId("toogle-button");
    expect(button).toHaveTextContent("+");
    fireEvent.click(button);
    expect(button).toHaveTextContent("-");
  });
});

// describe("App Component", () => {
//   beforeEach(() => {
//     // Mock the questions import
//     jest.mock("./data", () => mockQuestions);
//   });

//   test("renders App title", () => {
//     render(<App />);
//     expect(screen.getByText("Accordion")).toBeInTheDocument();
//   });

//   test("renders all questions from data", () => {
//     render(<App />);
//     mockQuestions.forEach((question) => {
//       expect(screen.getByText(question.title)).toBeInTheDocument();
//     });
//   });

//   test("expands and collapses accordions independently", () => {
//     render(<App />);
//     const buttons = screen.getAllByTestId("toogle-button");

//     // Expand first accordion
//     fireEvent.click(buttons[0]);
//     expect(screen.getByText("Answer 1")).toBeInTheDocument();
//     expect(screen.queryByText("Answer 2")).not.toBeInTheDocument();

//     // Expand second accordion
//     fireEvent.click(buttons[1]);
//     expect(screen.getByText("Answer 1")).toBeInTheDocument();
//     expect(screen.getByText("Answer 2")).toBeInTheDocument();

//     // Collapse first accordion
//     fireEvent.click(buttons[0]);
//     expect(screen.queryByText("Answer 1")).not.toBeInTheDocument();
//     expect(screen.getByText("Answer 2")).toBeInTheDocument();
//   });
// });
