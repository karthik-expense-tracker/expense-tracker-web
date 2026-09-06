import { buildExpenseFromForm, toDateInputValue } from "../../src/services/submitExpenses.js";

const createFormEvent = (values) => {
  const form = document.createElement("form");
  for (const [name, value] of Object.entries(values)) {
    const input = document.createElement(name === "expenseType" ? "select" : "input");
    input.name = name;
    if (name === "expenseType") {
      const option = document.createElement("option");
      option.value = value;
      option.selected = true;
      input.appendChild(option);
    } else {
      input.value = value;
    }
    form.appendChild(input);
  }
  return { target: form };
};

test("toDateInputValue converts DD-MM-YYYY to YYYY-MM-DD", () => {
  expect(toDateInputValue("05-09-2026")).toBe("2026-09-05");
});

test("buildExpenseFromForm maps and normalizes form values", () => {
  const event = createFormEvent({
    category: "Food",
    amount: "1500",
    date: "2026-09-05",
    expenseType: "credit",
  });

  expect(buildExpenseFromForm(event)).toEqual({
    category: "Food",
    amount: 1500,
    date: "05-09-2026",
    expenseType: "credit",
  });
});

test("buildExpenseFromForm converts amount to a number", () => {
  const event = createFormEvent({
    category: "Travel",
    amount: "800.50",
    date: "2026-09-06",
    expenseType: "debit",
  });

  expect(buildExpenseFromForm(event)).toMatchObject({ amount: 800.5 });
});