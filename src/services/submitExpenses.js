const toStoredDate = (isoDate) => {
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};

export const toDateInputValue = (storedDate) => {
  const [day, month, year] = storedDate.split("-");
  return `${year}-${month}-${day}`;
};

export const buildExpenseFromForm = (event) => {
  const formData = new FormData(event.target);
  const { category, amount, date, expenseType } = Object.fromEntries(formData.entries());
  return {
    category,
    amount: Number(amount),
    date: toStoredDate(date),
    expenseType,
  };
};