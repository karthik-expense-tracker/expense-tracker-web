import { render, screen, fireEvent } from "@testing-library/react";
import { Expenses } from "../../src/components/Expenses.jsx";

const expenses = [
  { id: 1, category: "Food", amount: 1500, date: "05-09-2026", expenseType: "credit" },
  { id: 2, category: "Travel", amount: 800, date: "06-09-2026", expenseType: "debit" },
];

test("renders one card per expense with all fields", () => {
  render(<Expenses expenses={expenses} onEdit={() => {}} onDelete={() => {}} />);
  expect(screen.getByText("Food")).toBeInTheDocument();
  expect(screen.getByText("1500")).toBeInTheDocument();
  expect(screen.getByText("credit")).toBeInTheDocument();
  expect(screen.getByText("05-09-2026")).toBeInTheDocument();
  expect(screen.getByText("Travel")).toBeInTheDocument();
  expect(screen.queryByText("600")).not.toBeInTheDocument();
});

test("calls onEdit with the expense when Edit is clicked", () => {
  const onEdit = jest.fn();
  render(<Expenses expenses={expenses} onEdit={onEdit} onDelete={() => {}} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[1]);
  expect(onEdit).toHaveBeenCalledWith(expenses[1]);
});

test("calls onDelete with the expense when Delete is clicked", () => {
  const onDelete = jest.fn();
  render(<Expenses expenses={expenses} onEdit={() => {}} onDelete={onDelete} />);
  fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
  expect(onDelete).toHaveBeenCalledWith(expenses[0]);
});