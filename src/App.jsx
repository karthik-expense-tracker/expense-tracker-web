import { useState } from "react";
import "./Expense.css";
import { Form } from "./Form";
import { Expenses } from "./components/Expenses.jsx";
import { Filter } from "./components/Filter.jsx";
import { Sort } from "./components/Sort.jsx";
import { Summary } from "./components/Summary.jsx";
import { filterExpenses } from "./services/expenseFilters.js";
import { sortExpenses } from "./services/expenseSorter.js";
import { summarizeExpenses } from "./services/expenseSummary.js";

const App = () => {
  const initialExpenses = [{
    "id": 1,
    "category": "Food",
    "amount": 1500,
    "date": "05-09-2026",
    "expenseType": "debit",
  }, {
    "id": 2,
    "category": "Food",
    "amount": 1500,
    "date": "05-09-2026",
    "expenseType": "credit",
  }];
  const [expenses, setExpenses] = useState(initialExpenses);
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("none");
  const [editingExpense, setEditingExpense] = useState(null);

  const visibleExpenses = sortExpenses(filterExpenses(expenses, filter), sortKey);
  const summary = summarizeExpenses(visibleExpenses);

  const handleSaveExpense = (expense) => {
    setExpenses((prevExpenses) =>
      editingExpense
        ? prevExpenses.map((e) => e.id === editingExpense.id ? { ...expense, id: editingExpense.id } : e)
        : [...prevExpenses, { ...expense, id: crypto.randomUUID() }]
    );
    setEditingExpense(null);
  };

  const handleStartEdit = (expense) => setEditingExpense(expense);
  const handleCancelEdit = () => setEditingExpense(null);

  return <div>
    <Form editingExpense={editingExpense} onSave={handleSaveExpense} onCancel={handleCancelEdit}></Form>
    <section className="expenses-panel">
      <div className="expenses-toolbar">
        <Filter value={filter} onChange={setFilter}></Filter>
        <Sort value={sortKey} onChange={setSortKey}></Sort>
      </div>
      <Summary totalCredit={summary.totalCredit} totalDebit={summary.totalDebit}></Summary>
      <Expenses expenses={visibleExpenses} onEdit={handleStartEdit}></Expenses>
    </section>
  </div>
};

export default App;