import { Expense } from "./Expense.jsx";

export const Expenses = ({ expenses, onEdit }) => {
  return <div className="expense-list">
    {expenses.map(expense => <Expense key={expense.id} expense={expense} onEdit={onEdit}></Expense>)}
  </div>
}