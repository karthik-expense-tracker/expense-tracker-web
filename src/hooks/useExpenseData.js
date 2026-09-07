import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createExpense as createExpenseApi,
  deleteExpense as deleteExpenseApi,
  fetchExpenses,
  getApiErrorMessage,
  updateExpense as updateExpenseApi,
} from "../services/api.js";
import { useToast } from "../components/Toasts.jsx";

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

export const useExpenseData = () => {
  const queryClient = useQueryClient();
  const showToast = useToast();
  const [editingExpense, setEditingExpense] = useState(null);

  const { data: expenses, isFetching, isError, error } = useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
    initialData: initialExpenses,
    retry: false,
  });

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: ["expenses"] });

  const createMutation = useMutation({
    mutationFn: createExpenseApi,
    onSuccess: () => {
      refresh();
      showToast("Expense added");
    },
    onError: (err) => showToast(getApiErrorMessage(err, "Failed to add expense"), "error"),
  });

  const updateMutation = useMutation({
    mutationFn: updateExpenseApi,
    onSuccess: () => {
      setEditingExpense(null);
      refresh();
      showToast("Expense updated");
    },
    onError: (err) => showToast(getApiErrorMessage(err, "Failed to update expense"), "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpenseApi,
    onSuccess: () => {
      refresh();
      showToast("Expense deleted");
    },
    onError: (err) => showToast(getApiErrorMessage(err, "Failed to delete expense"), "error"),
  });

  const saveExpense = (expense) => {
    if (editingExpense) {
      updateMutation.mutate({ id: editingExpense.id, expense });
    } else {
      createMutation.mutate(expense);
    }
  };

  const deleteExpense = (id) => deleteMutation.mutate(id);
  const startEdit = (expense) => setEditingExpense(expense);
  const cancelEdit = () => setEditingExpense(null);

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return {
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
  };
};