import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "./App";

describe("Data Grid", () => {
  beforeEach(() => {
    render(<App />);
  });

  test("renders initial grid structure", () => {
    expect(screen.getByTestId("data-grid-container")).toBeInTheDocument();
    expect(screen.getByTestId("grid-header")).toBeInTheDocument();
    expect(screen.getByTestId("grid-table")).toBeInTheDocument();
    expect(screen.getByTestId("grid-pagination")).toBeInTheDocument();
  });

  test("sorts data when clicking column header", async () => {
    const nameColumn = screen.getByTestId("column-name", {});
    fireEvent.click(nameColumn);

    const cells = screen.getAllByTestId(/cell-name-/);
    expect(cells[0].textContent).toBe("Alice Brown"); // Alphabetically first
  });

  test("filters data based on search input", async () => {
    const searchInput = screen.getByTestId("search-input");
    await userEvent.type(searchInput, "John");
    await waitFor(() => {
      const rows = screen.getAllByTestId(/row-/);
      expect(rows).toHaveLength(2);
      expect(rows[0]).toHaveTextContent("John Doe");
    });
  });

  test("paginates data correctly", () => {
    const nextButton = screen.getByTestId("next-page");
    fireEvent.click(nextButton);

    const pageInfo = screen.getByTestId("page-info");
    console.log(pageInfo, "Page Info");
    expect(pageInfo).toHaveTextContent("Page 2");
  });
});
