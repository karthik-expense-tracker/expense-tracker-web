import { summarizeExpenses } from "../../src/services/expenseSummary.js";

test("returns zeros for an empty list", () => {
  expect(summarizeExpenses([])).toEqual({ totalCredit: 0, totalDebit: 0 });
});

test("totals mixed credit and debit expenses", () => {
  const expenses = [
    { amount: 1000, expenseType: "credit" },
    { amount: 250, expenseType: "debit" },
    { amount: 500, expenseType: "credit" },
  ];
  expect(summarizeExpenses(expenses)).toEqual({ totalCredit: 1500, totalDebit: 250 });
});

test("totals only credit expenses", () => {
  const expenses = [
    { amount: 300, expenseType: "credit" },
    { amount: 700, expenseType: "credit" },
  ];
  expect(summarizeExpenses(expenses)).toEqual({ totalCredit: 1000, totalDebit: 0 });
});

test("totals only debit expenses", () => {
  const expenses = [
    { amount: 400, expenseType: "debit" },
    { amount: 600, expenseType: "debit" },
  ];
  expect(summarizeExpenses(expenses)).toEqual({ totalCredit: 0, totalDebit: 1000 });
});

test("handles string amounts", () => {
  const expenses = [{ amount: "1500", expenseType: "credit" }];
  expect(summarizeExpenses(expenses)).toEqual({ totalCredit: 1500, totalDebit: 0 });
});