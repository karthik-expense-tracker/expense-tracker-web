export const filterExpenses = (expenses, filter) =>
  filter === "all" ? expenses : expenses.filter((e) => e.expenseType === filter);