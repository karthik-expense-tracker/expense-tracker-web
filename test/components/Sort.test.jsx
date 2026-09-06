import { render, screen, fireEvent } from "@testing-library/react";
import { Sort } from "../../src/components/Sort.jsx";

const labels = [
  "Default order",
  "Date (newest first)",
  "Date (oldest first)",
  "Amount (high to low)",
  "Amount (low to high)",
];

test("renders all sort options", () => {
  render(<Sort value="none" onChange={() => {}} />);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
  for (const label of labels) {
    expect(screen.getByRole("option", { name: label })).toBeInTheDocument();
  }
});

test("reflects the provided value", () => {
  render(<Sort value="amount-desc" onChange={() => {}} />);
  expect(screen.getByRole("combobox")).toHaveValue("amount-desc");
});

test("calls onChange with the selected value", () => {
  const onChange = jest.fn();
  render(<Sort value="none" onChange={onChange} />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "date-asc" } });
  expect(onChange).toHaveBeenCalledWith("date-asc");
});