import { render, screen, fireEvent } from "@testing-library/react";
import { Form } from "../../src/components/Form.jsx";
import { fillForm } from "../helpers/formHelpers.js";

test("renders add-mode form with no cancel button", () => {
  render(<Form onSave={() => {}} onCancel={() => {}} />);
  expect(screen.getByRole("heading", { name: "Enter expense details" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Cancel" })).not.toBeInTheDocument();
});

test("submits normalized expense data", () => {
  const onSave = jest.fn();
  const { container } = render(<Form onSave={onSave} onCancel={() => {}} />);

  fillForm(container, {
    category: "Food",
    amount: "1500",
    date: "2026-09-05",
    expenseType: "credit",
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  expect(onSave).toHaveBeenCalledWith({
    category: "Food",
    amount: 1500,
    date: "05-09-2026",
    expenseType: "credit",
  });
});

test("clears the form after a successful submit", () => {
  const { container } = render(<Form onSave={() => {}} onCancel={() => {}} />);

  fillForm(container, {
    category: "Food",
    amount: "1500",
    date: "2026-09-05",
    expenseType: "debit",
  });
  fireEvent.click(screen.getByRole("button", { name: "Submit" }));

  expect(container.querySelector("[name=\"category\"]").value).toBe("");
  expect(container.querySelector("[name=\"amount\"]").value).toBe("");
  expect(container.querySelector("[name=\"date\"]").value).toBe("");
  expect(container.querySelector("[name=\"expenseType\"]").value).toBe("");
});

test("renders edit-mode form with prefilled values", () => {
  const editingExpense = {
    id: 7,
    category: "Travel",
    amount: 800,
    date: "06-09-2026",
    expenseType: "debit",
  };
  const { container } = render(<Form editingExpense={editingExpense} onSave={() => {}} onCancel={() => {}} />);

  expect(screen.getByRole("heading", { name: "Edit expense details" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Update" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  expect(container.querySelector("[name=\"category\"]").value).toBe("Travel");
  expect(container.querySelector("[name=\"amount\"]").value).toBe("800");
  expect(container.querySelector("[name=\"date\"]").value).toBe("2026-09-06");
  expect(container.querySelector("[name=\"expenseType\"]").value).toBe("debit");
});

test("submits edits via onSave with normalized data", () => {
  const editingExpense = {
    id: 7,
    category: "Travel",
    amount: 800,
    date: "06-09-2026",
    expenseType: "debit",
  };
  const onSave = jest.fn();
  const { container } = render(<Form editingExpense={editingExpense} onSave={onSave} onCancel={() => {}} />);

  fillForm(container, {
    category: "Hotels",
    amount: "900",
    date: "2026-09-08",
    expenseType: "credit",
  });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));

  expect(onSave).toHaveBeenCalledWith({
    category: "Hotels",
    amount: 900,
    date: "08-09-2026",
    expenseType: "credit",
  });
});

test("cancels without saving", () => {
  const onSave = jest.fn();
  const onCancel = jest.fn();
  render(<Form editingExpense={{ id: 7, category: "Travel", amount: 800, date: "06-09-2026", expenseType: "debit" }} onSave={onSave} onCancel={onCancel} />);

  fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
  expect(onCancel).toHaveBeenCalled();
  expect(onSave).not.toHaveBeenCalled();
});