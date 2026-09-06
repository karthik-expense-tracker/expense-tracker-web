import { filterExpenses } from "../../src/services/expenseFilters.js";

const expenses = [
  { id: 1, category: "Food", amount: 1500, date: "05-09-2026", expenseType: "credit" },
  { id: 2, category: "Travel", amount: 800, date: "06-09-2026", expenseType: "debit" },
  { id: 3, category: "Food", amount: 200, date: "07-09-2026", expenseType: "debit" },
];

test("returns the same list for the 'all' filter", () => {
  expect(filterExpenses(expenses, "all")).toBe(expenses);
});

test("filters by credit", () => {
  const result = filterExpenses(expenses, "credit");
  expect(result).toHaveLength(1);
  expect(result[0].id).toBe(1);
});

test("filters by debit", () => {
  const result = filterExpenses(expenses, "debit");
  expect(result).toHaveLength(2);
  expect(result.map((e) => e.id)).toEqual([2, 3]);
});

test("returns an empty array when nothing matches", () => {
  expect(filterExpenses(expenses, "savings")).toEqual([]);
});

test("does not mutate the original list", () => {
  const copy = [...expenses];
  filterExpenses(expenses, "debit");
  expect(expenses).toEqual(copy);
});