import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App.jsx";

const formFields = (container) => ({
  category: container.querySelector('[name="category"]'),
  amount: container.querySelector('[name="amount"]'),
  date: container.querySelector('[name="date"]'),
  expenseType: container.querySelector('[name="expenseType"]'),
});

const fillForm = (container, values) => {
  fireEvent.change(formFields(container).category, { target: { value: values.category } });
  fireEvent.change(formFields(container).amount, { target: { value: values.amount } });
  fireEvent.change(formFields(container).date, { target: { value: values.date } });
  fireEvent.change(formFields(container).expenseType, { target: { value: values.expenseType } });
};

const submit = () => fireEvent.click(screen.getByRole("button", { name: "Submit" }));

test("renders the initial expenses and summary", () => {
  render(<App />);
  expect(screen.getAllByText("Food")).toHaveLength(2);
  expect(screen.getAllByText("1500")).toHaveLength(2);
  expect(screen.getByText("Credit: 1500")).toBeInTheDocument();
  expect(screen.getByText("Debit: 1500")).toBeInTheDocument();
});

test("adds a new expense and updates the summary", () => {
  const { container } = render(<App />);

  fillForm(container, {
    category: "Travel",
    amount: "500",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  expect(screen.getByText("Travel")).toBeInTheDocument();
  expect(screen.getByText("Debit: 2000")).toBeInTheDocument();
  expect(screen.getByText("Credit: 1500")).toBeInTheDocument();
  expect(formFields(container).category.value).toBe("");
});

test("filters expenses by type", () => {
  const { container } = render(<App />);
  const selects = container.querySelectorAll("select");
  const filterSelect = selects[1];

  fireEvent.change(filterSelect, { target: { value: "credit" } });
  expect(screen.getAllByText("Food")).toHaveLength(1);

  fireEvent.change(filterSelect, { target: { value: "debit" } });
  expect(screen.getAllByText("Food")).toHaveLength(1);

  fillForm(container, {
    category: "Travel",
    amount: "500",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  fireEvent.change(filterSelect, { target: { value: "debit" } });
  expect(screen.getAllByText("Food")).toHaveLength(1);
  expect(screen.getByText("Travel")).toBeInTheDocument();
});

test("sorts expenses by amount", () => {
  const { container } = render(<App />);
  const selects = container.querySelectorAll("select");
  const sortSelect = selects[2];

  fillForm(container, {
    category: "Small",
    amount: "300",
    date: "2026-09-11",
    expenseType: "debit",
  });
  submit();

  fillForm(container, {
    category: "Big",
    amount: "900",
    date: "2026-09-12",
    expenseType: "debit",
  });
  submit();

  const firstCardAmount = () => container.querySelectorAll(".expense-card")[0].textContent;

  fireEvent.change(sortSelect, { target: { value: "amount-asc" } });
  expect(firstCardAmount()).toContain("300");

  fireEvent.change(sortSelect, { target: { value: "amount-desc" } });
  expect(firstCardAmount()).toContain("1500");
});

test("edits an existing expense", () => {
  const { container } = render(<App />);

  fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
  expect(screen.getByRole("heading", { name: "Edit expense details" })).toBeInTheDocument();
  expect(formFields(container).category.value).toBe("Food");

  fireEvent.change(formFields(container).category, { target: { value: "Groceries" } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));

  expect(screen.getByRole("heading", { name: "Enter expense details" })).toBeInTheDocument();
  expect(screen.getAllByText("Food")).toHaveLength(1);
  expect(screen.getByText("Groceries")).toBeInTheDocument();
});