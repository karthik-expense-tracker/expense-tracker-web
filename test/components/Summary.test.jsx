import { render, screen } from "@testing-library/react";
import { Summary } from "../../src/components/Summary.jsx";

test("renders credit and debit totals", () => {
  render(<Summary totalCredit={1500} totalDebit={250} />);
  expect(screen.getByText("Credit: 1500")).toBeInTheDocument();
  expect(screen.getByText("Debit: 250")).toBeInTheDocument();
});

test("renders zero totals", () => {
  render(<Summary totalCredit={0} totalDebit={0} />);
  expect(screen.getByText("Credit: 0")).toBeInTheDocument();
  expect(screen.getByText("Debit: 0")).toBeInTheDocument();
});