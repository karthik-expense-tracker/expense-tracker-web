import axios from "axios";

const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8080",
});

export const fetchExpenses = () =>
  client.get("/all-expenses").then((res) => res.data);

export const createExpense = (expense) =>
  client.post("/create-expense", expense).then((res) => res.data);

export const updateExpense = ({ id, expense }) =>
  client.post(`/update-expense/${id}`, expense).then((res) => res.data);

export const deleteExpense = (id) =>
  client.delete(`/delete-expense/${id}`).then((res) => res.data);