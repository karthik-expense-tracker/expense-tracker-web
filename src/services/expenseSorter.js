const parseDate = (date) => {
  const [day, month, year] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const sortExpenses = (expenses, sortKey) => {
  if (!sortKey || sortKey === "none") {
    return expenses;
  }
  const [by, order] = sortKey.split("-");
  const sorted = [...expenses];
  sorted.sort((a, b) => {
    const result = by === "amount"
      ? Number(a.amount) - Number(b.amount)
      : parseDate(a.date) - parseDate(b.date);
    return order === "desc" ? -result : result;
  });
  return sorted;
};