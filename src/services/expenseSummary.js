export const summarizeExpenses = (expenses) => {
  const byType = (type) =>
    expenses
      .filter((e) => e.expenseType === type)
      .reduce((sum, e) => sum + Number(e.amount), 0);

  return {
    totalCredit: byType("credit"),
    totalDebit: byType("debit"),
  };
};