import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import "./styles/Expense.css";
import { Form } from "./components/Form.jsx";
import { Expenses } from "./components/Expenses.jsx";
import { Filter } from "./components/Filter.jsx";
import { Sort } from "./components/Sort.jsx";
import { Summary } from "./components/Summary.jsx";
import { filterExpenses } from "./services/expenseFilters.js";
import { sortExpenses } from "./services/expenseSorter.js";
import { summarizeExpenses } from "./services/expenseSummary.js";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "./services/api.js";

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

const App = () => {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState("all");
  const [sortKey, setSortKey] = useState("none");
  const [editingExpense, setEditingExpense] = useState(null);
  const [saveError, setSaveError] = useState(null);

  const { data: expenses, isError, error } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    initialData: initialExpenses,
    retry: false,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["expenses"] });

  const createMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      setSaveError(null);
      refresh();
    },
    onError: (err) => setSaveError(err.message ?? "Failed to save expense"),
  });

  const updateMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      setSaveError(null);
      setEditingExpense(null);
      refresh();
    },
    onError: (err) => setSaveError(err.message ?? "Failed to save expense"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      setSaveError(null);
      refresh();
    },
    onError: (err) => setSaveError(err.message ?? "Failed to delete expense"),
  });

  const handleSaveExpense = (expense) => {
    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, expense });
    } else {
      createMutation.mutate(expense);
    }
  };

  const handleStartEdit = (expense) => setEditingExpense(expense);
  const handleCancelEdit = () => setEditingExpense(null);
  const handleDeleteExpense = (expense) => deleteMutation.mutate(expense.id);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const visibleExpenses = sortExpenses(
    filterExpenses(expenses ?? [], filter),
    sortKey,
  );
  const summary = summarizeExpenses(visibleExpenses);

  return (
    <div>
      {isError && <p role="alert">{error.message}</p>}
      {saveError && <p role="alert">{saveError}</p>}
      <Form
        editingExpense={editingExpense}
        isSubmitting={isSubmitting}
        onSave={handleSaveExpense}
        onCancel={handleCancelEdit}
      >
      </Form>
      <section className="expenses-panel">
        <div className="expenses-toolbar">
          <Filter value={filter} onChange={setFilter}></Filter>
          <Sort value={sortKey} onChange={setSortKey}></Sort>
        </div>
        <Summary
          totalCredit={summary.totalCredit}
          totalDebit={summary.totalDebit}
        >
        </Summary>
        <Expenses expenses={visibleExpenses} onEdit={handleStartEdit} onDelete={handleDeleteExpense}>
        </Expenses>
      </section>
    </div>
  );
};

export default App;