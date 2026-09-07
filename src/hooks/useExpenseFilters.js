import { useState } from "react";
import { filterExpenses } from "../services/expenseFilters.js";
import { sortExpenses } from "../services/expenseSorter.js";
import { summarizeExpenses } from "../services/expenseSummary.js";

export const useExpenseFilters = (expenses) => {
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("none");

  const visibleExpenses = sortExpenses(
    filterExpenses(expenses, filter),
    sortKey,
  );
  const summary = summarizeExpenses(visibleExpenses);

  return { filter, setFilter, sortKey, setSortKey, visibleExpenses, summary };
};