import { sortExpenses } from "../../src/services/expenseSorter.js";

const expenses = [
  { id: 1, category: "Food", amount: 1500, date: "05-09-2026", expenseType: "credit" },
  { id: 2, category: "Travel", amount: 800, date: "06-09-2026", expenseType: "debit" },
  { id: 3, category: "Food", amount: 200, date: "07-09-2026", expenseType: "debit" },
];

test("returns the original list for 'none'", () => {
  expect(sortExpenses(expenses, "none")).toBe(expenses);
});

test("returns the original list for a falsy key", () => {
  expect(sortExpenses(expenses, undefined)).toBe(expenses);
  expect(sortExpenses(expenses, "")).toBe(expenses);
});

test("sorts by date ascending", () => {
  expect(sortExpenses(expenses, "date-asc").map((e) => e.id)).toEqual([1, 2, 3]);
});

test("sorts by date descending", () => {
  expect(sortExpenses(expenses, "date-desc").map((e) => e.id)).toEqual([3, 2, 1]);
});

test("sorts by amount ascending", () => {
  expect(sortExpenses(expenses, "amount-asc").map((e) => e.id)).toEqual([3, 2, 1]);
});

test("sorts by amount descending", () => {
  expect(sortExpenses(expenses, "amount-desc").map((e) => e.id)).toEqual([1, 2, 3]);
});

test("does not mutate the original list", () => {
  const copy = [...expenses];
  const sorted = sortExpenses(expenses, "amount-desc");
  expect(sorted).not.toBe(expenses);
  expect(expenses).toEqual(copy);
});