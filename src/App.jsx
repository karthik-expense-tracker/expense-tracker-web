import "./Expense.css";
import { Form } from "./Form";

const Expense = ({expense}) => {
  return <div className={`expense-card ${expense.expenseType}`}>
    <div className="expense-field category">{expense.category}</div>
    <div className="expense-field amount">{expense.amount}</div>
    <div className="expense-field expenseType">{expense.expenseType}</div>
    <div className="expense-field date">{expense.date}</div>
  </div>
}

const Expenses = ({expenses}) => {
  console.log(expenses);
  return <div className="expense-list">
    {expenses.map(expense => <Expense id={expense.id} expense={expense}></Expense>)}
  </div>
}

const App = () => {
  const expenses = [{
    "id": 1,
    "category": "Food",
    "amount": 1500,
    "date": "05-09-2026,  Saturday",
    "expenseType": "debit",
  }, {
    "id": 2,
    "category": "Food",
    "amount": 1500,
    "date": "05-09-2026,  Saturday",
    "expenseType": "credit",
  }];

  return <div>
    <Form></Form>
    <Expenses expenses={expenses}></Expenses>
    </div>
};

export default App;
