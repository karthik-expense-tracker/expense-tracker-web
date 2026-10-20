import { useState } from "react";
import {
  buildExpenseFromForm,
  toDateInputValue,
} from "../services/submitExpenses.js";

export const Form = ({ editingExpense, onSave, onCancel, isSubmitting = false }) => {
  const [submitCount, setSubmitCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(buildExpenseFromForm(e));
    setSubmitCount((count) => count + 1);
  };

  const formKey = editingExpense ? editingExpense.id : `new-${submitCount}`;

  return (
    <div>
      <h2>
        {editingExpense ? "Edit expense details" : "Enter expense details"}
      </h2>
      <form
        key={formKey}
        onSubmit={handleSubmit}
      >
        <label htmlFor="expense-category">
          category:<span className="required">*</span>
        </label>
        <input
          id="expense-category"
          type="text"
          name="category"
          defaultValue={editingExpense?.category ?? ""}
          required
        >
        </input>
        <label htmlFor="expense-amount">
          amount<span className="required">*</span>
        </label>
        <input
          id="expense-amount"
          type="number"
          name="amount"
          defaultValue={editingExpense?.amount ?? ""}
          required
        >
        </input>
        <label htmlFor="expense-date">
          Enter Date:<span className="required">*</span>
        </label>
        <input
          id="expense-date"
          type="date"
          name="date"
          defaultValue={editingExpense
            ? toDateInputValue(editingExpense.date)
            : ""}
          required
        >
        </input>
        <label htmlFor="expense-type">
          Expense type:<span className="required">*</span>
        </label>
        <select
          id="expense-type"
          name="expenseType"
          defaultValue={editingExpense?.expenseType ?? ""}
          required
        >
          <option value="">Select type</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : (editingExpense ? "Update" : "Submit")}
        </button>
        {editingExpense && (
          <button type="button" className="cancel-button" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </form>
    </div>
  );
};
