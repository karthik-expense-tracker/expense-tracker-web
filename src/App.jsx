import { useState } from "react";
import "./styles/Expense.css";
import { Form } from "./components/Form.jsx";
import { Expenses } from "./components/Expenses.jsx";
import { Filter } from "./components/Filter.jsx";
import { Sort } from "./components/Sort.jsx";
import { Summary } from "./components/Summary.jsx";
import { Spinner } from "./components/Spinner.jsx";
import { ConfirmDialog } from "./components/ConfirmDialog.jsx";
import { useExpenseData } from "./hooks/useExpenseData.js";
import { useExpenseFilters } from "./hooks/useExpenseFilters.js";

const App = () => {
  const {
    expenses,
    isFetching,
    isError,
    error,
    isSubmitting,
    editingExpense,
    startEdit,
    cancelEdit,
    saveExpense,
    deleteExpense,
  } = useExpenseData();

  const { filter, setFilter, sortKey, setSortKey, visibleExpenses, summary } =
    useExpenseFilters(expenses ?? []);

  const [pendingDelete, setPendingDelete] = useState(null);

  const handleRequestDelete = (expense) => setPendingDelete(expense);
  const handleConfirmDelete = () => {
    deleteExpense(pendingDelete.id);
    setPendingDelete(null);
  };
  const handleCancelDelete = () => setPendingDelete(null);

  return (
    <div>
      {isFetching && <Spinner />}
      {isError && <p role="alert">{error.message}</p>}
      <Form
        editingExpense={editingExpense}
        isSubmitting={isSubmitting}
        onSave={saveExpense}
        onCancel={cancelEdit}
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
        <Expenses expenses={visibleExpenses} onEdit={startEdit} onDelete={handleRequestDelete}>
        </Expenses>
      </section>
      {pendingDelete && (
        <ConfirmDialog
          title="Delete expense"
          message={`Delete "${pendingDelete.category}"?`}
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        >
        </ConfirmDialog>
      )}
    </div>
  );
};

export default App;