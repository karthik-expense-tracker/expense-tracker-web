import { Expense } from "./Expense.jsx";

export const Expenses = ({ expenses, onEdit, onDelete }) => {
  return <div className="expense-list">
    {expenses.map(expense => <Expense key={expense.id} expense={expense} onEdit={onEdit} onDelete={onDelete}></Expense>)}
  </div>
}