export const Summary = ({ totalCredit, totalDebit }) => {
  return (
    <div className="summary">
      <div className="summary-field credit">Credit: {totalCredit}</div>
      <div className="summary-field debit">Debit: {totalDebit}</div>
    </div>
  );
};