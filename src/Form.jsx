import { useState } from "react";
import { buildExpenseFromForm, toDateInputValue } from "./services/submitExpenses.js";

export const Form = ({ editingExpense, onSave, onCancel }) => {
  const [submitCount, setSubmitCount] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(buildExpenseFromForm(e));
    setSubmitCount((count) => count + 1);
  };

  const formKey = editingExpense ? editingExpense.id : `new-${submitCount}`;

  return (
    <div>
      <h2>{editingExpense ? "Edit expense details" : "Enter expense details"}</h2>
      <form
        key={formKey}
        onSubmit={handleSubmit}
      >
        <label>
          category:<span className="required">*</span>
        </label>
        <input type="text" name="category" defaultValue={editingExpense?.category ?? ""} required></input>
        <label>
          amount<span className="required">*</span>
        </label>
        <input type="number" name="amount" defaultValue={editingExpense?.amount ?? ""} required></input>
        <label>
          Enter Date:<span className="required">*</span>
        </label>
        <input type="date" name="date" defaultValue={editingExpense ? toDateInputValue(editingExpense.date) : ""} required></input>
        <label>
          Expense type:<span className="required">*</span>
        </label>
        <select name="expenseType" defaultValue={editingExpense?.expenseType ?? ""} required>
          <option value="">Select type</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>
        <button type="submit">{editingExpense ? "Update" : "Submit"}</button>
        {editingExpense && <button type="button" className="cancel-button" onClick={onCancel}>Cancel</button>}
      </form>
    </div>
  );
};