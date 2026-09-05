import { buildExpenseFromForm } from "./services/submitExpenses.js";

export const Form = ({onAddExpense}) => {
  return (
    <div>
      <h2>Enter expense details:</h2>
      <form onSubmit={(e) => {
        e.preventDefault();
        onAddExpense(buildExpenseFromForm(e));
      }}>
        <label>category:<span className="required"> *</span></label>
        <input type="text" name="category" required></input>
        <label>amount<span className="required"> *</span></label>
        <input type="number" name="amount" required></input>
        <label>Enter Date:<span className="required"> *</span></label>
        <input type="date" name="date" required></input>
        <label>Expense type:<span className="required"> *</span></label>
        <select name="expenseType">
          <option>Select type</option>
          <option value={"credit"}>Credit</option>
          <option value={"debit"}>Debit</option>
        </select>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};
