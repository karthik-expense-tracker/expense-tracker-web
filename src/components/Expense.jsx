export const Expense = ({ expense, onEdit }) => {
  return (
    <div className={`expense-card ${expense.expenseType}`}>
      <div className="expense-field category">{expense.category}</div>
      <div className="expense-field amount">{expense.amount}</div>
      <div className="expense-field expenseType">{expense.expenseType}</div>
      <div className="expense-field date">{expense.date}</div>
      <button className="edit-button" onClick={() => onEdit(expense)}>Edit</button>
    </div>
  );
};