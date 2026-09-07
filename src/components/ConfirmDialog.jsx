export const ConfirmDialog = ({
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) => (
  <div className="dialog-backdrop">
    <div role="dialog" aria-modal="true" aria-labelledby="confirm-dialog-title" className="dialog">
      <h2 id="confirm-dialog-title">{title}</h2>
      <p>{message}</p>
      <div className="dialog-actions">
        <button className="danger-button" onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button className="cancel-button" onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </div>
  </div>
);