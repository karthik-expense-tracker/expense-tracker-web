export const Form = () => {
  return <div>
    <h2>Enter expense details: </h2>
    <label>category: </label>
    <input type="text"></input>
    <label>amount</label>
    <input type="text"></input>
    <label>Enter Date:</label>
    <input type="date"></input>
    <label>Expense type:</label>
    <select>
      <option>Select type</option>
      <option>Credit</option>
      <option>Debit</option>
    </select>
    <button>Submit</button>
  </div>
}