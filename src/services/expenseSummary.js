  const byType = (expenses, type) =>
    expenses
      .filter((e) => e.expenseType === type)
      .reduce((sum, e) => sum + Number(e.amount), 0);

export const summarizeExpenses = (expenses) => {
  return {
    totalCredit: byType(expenses, "credit"),
    totalDebit: byType(expenses, "debit"),
  };
};