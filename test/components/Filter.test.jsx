import { render, screen, fireEvent } from "@testing-library/react";
import { Filter } from "../../src/components/Filter.jsx";

test("renders all filter options", () => {
  render(<Filter value="all" onChange={() => {}} />);
  expect(screen.getByRole("combobox")).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "All" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Credit" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "Debit" })).toBeInTheDocument();
});

test("reflects the provided value", () => {
  render(<Filter value="debit" onChange={() => {}} />);
  expect(screen.getByRole("combobox")).toHaveValue("debit");
});

test("calls onChange with the selected value", () => {
  const onChange = jest.fn();
  render(<Filter value="all" onChange={onChange} />);
  fireEvent.change(screen.getByRole("combobox"), { target: { value: "credit" } });
  expect(onChange).toHaveBeenCalledWith("credit");
});