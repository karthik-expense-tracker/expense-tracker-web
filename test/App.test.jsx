import { render, screen, fireEvent, within } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "../src/App.jsx";
import { ToastProvider } from "../src/components/Toasts.jsx";
import {
  createExpense,
  deleteExpense,
  fetchExpenses,
  updateExpense,
} from "../src/services/api.js";
import { formFields, fillForm } from "./helpers/formHelpers.js";

jest.mock("../src/services/api.js", () => ({
  ...jest.requireActual("../src/services/api.js"),
  fetchExpenses: jest.fn(),
  createExpense: jest.fn(),
  updateExpense: jest.fn(),
  deleteExpense: jest.fn(),
}));

const sampleExpenses = [{
  id: 1,
  category: "Food",
  amount: 1500,
  date: "05-09-2026",
  expenseType: "debit",
}, {
  id: 2,
  category: "Food",
  amount: 1500,
  date: "05-09-2026",
  expenseType: "credit",
}];

let items = [];
let nextId = 0;

const getItems = () => items.map((expense) => ({ ...expense }));

beforeEach(() => {
  jest.clearAllMocks();
  items = sampleExpenses.map((expense) => ({ ...expense }));
  nextId = 3;
  fetchExpenses.mockImplementation(() => Promise.resolve(getItems()));
  createExpense.mockImplementation((expense) => {
    const created = { ...expense, id: nextId };
    items = [...items, created];
    nextId += 1;
    return Promise.resolve(created);
  });
  updateExpense.mockImplementation(({ id, expense }) => {
    items = items.map((e) => (e.id === id ? { ...expense, id } : e));
    return Promise.resolve({ ...expense, id });
  });
  deleteExpense.mockImplementation((id) => {
    items = items.filter((e) => e.id !== id);
    return Promise.resolve();
  });
});

const renderWithProvider = () => {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </QueryClientProvider>
  );
};

const renderApp = async () => {
  const view = renderWithProvider();
  await screen.findAllByText("Food");
  return view;
};

const submit = () => fireEvent.click(screen.getByRole("button", { name: "Submit" }));

test("renders the initial expenses and summary", async () => {
  await renderApp();
  expect(screen.getAllByText("Food")).toHaveLength(2);
  expect(screen.getAllByText("1500")).toHaveLength(2);
  expect(screen.getByText("Credit: 1500")).toBeInTheDocument();
  expect(screen.getByText("Debit: 1500")).toBeInTheDocument();
});

test("adds a new expense and updates the summary", async () => {
  const { container } = await renderApp();

  fillForm(container, {
    category: "Travel",
    amount: "500",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  expect(await screen.findByText("Travel")).toBeInTheDocument();
  expect(createExpense).toHaveBeenCalledTimes(1);
  expect(createExpense.mock.calls[0][0]).toEqual({
    category: "Travel",
    amount: 500,
    date: "10-09-2026",
    expenseType: "debit",
  });
  expect(screen.getByText("Debit: 2000")).toBeInTheDocument();
  expect(screen.getByText("Credit: 1500")).toBeInTheDocument();
  expect(formFields(container).category.value).toBe("");
});

test("disables the submit button while saving", async () => {
  let resolveCreate;
  createExpense.mockImplementation((expense) => {
    const created = { ...expense, id: nextId };
    items = [...items, created];
    nextId += 1;
    return new Promise((resolve) => { resolveCreate = resolve; });
  });

  const { container } = await renderApp();
  fillForm(container, {
    category: "Travel",
    amount: "500",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  expect(await screen.findByRole("button", { name: "Saving..." })).toBeDisabled();

  resolveCreate();
  expect(await screen.findByText("Travel")).toBeInTheDocument();
});

test("filters expenses by type", async () => {
  const { container } = await renderApp();
  const selects = container.querySelectorAll("select");
  const filterSelect = selects[1];

  fireEvent.change(filterSelect, { target: { value: "credit" } });
  expect(screen.getAllByText("Food")).toHaveLength(1);

  fireEvent.change(filterSelect, { target: { value: "debit" } });
  expect(screen.getAllByText("Food")).toHaveLength(1);

  fillForm(container, {
    category: "Travel",
    amount: "500",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  fireEvent.change(filterSelect, { target: { value: "debit" } });
  expect(screen.getAllByText("Food")).toHaveLength(1);
  expect(await screen.findByText("Travel")).toBeInTheDocument();
});

test("sorts expenses by amount", async () => {
  const { container } = await renderApp();
  const selects = container.querySelectorAll("select");
  const sortSelect = selects[2];

  fillForm(container, {
    category: "Small",
    amount: "300",
    date: "2026-09-11",
    expenseType: "debit",
  });
  submit();
  await screen.findByText("Small");

  fillForm(container, {
    category: "Big",
    amount: "900",
    date: "2026-09-12",
    expenseType: "debit",
  });
  submit();
  await screen.findByText("Big");

  const firstCardAmount = () => container.querySelectorAll(".expense-card")[0].textContent;

  fireEvent.change(sortSelect, { target: { value: "amount-asc" } });
  expect(firstCardAmount()).toContain("300");

  fireEvent.change(sortSelect, { target: { value: "amount-desc" } });
  expect(firstCardAmount()).toContain("1500");
});

test("edits an existing expense", async () => {
  const { container } = await renderApp();

  fireEvent.click(screen.getAllByRole("button", { name: "Edit" })[0]);
  expect(screen.getByRole("heading", { name: "Edit expense details" })).toBeInTheDocument();
  expect(formFields(container).category.value).toBe("Food");

  fireEvent.change(formFields(container).category, { target: { value: "Groceries" } });
  fireEvent.click(screen.getByRole("button", { name: "Update" }));

  expect(await screen.findByText("Groceries")).toBeInTheDocument();
  expect(updateExpense).toHaveBeenCalledTimes(1);
  expect(updateExpense.mock.calls[0][0]).toEqual({
    id: 1,
    expense: expect.objectContaining({
      category: "Groceries",
      amount: 1500,
      expenseType: "debit",
    }),
  });
  expect(screen.getByRole("heading", { name: "Enter expense details" })).toBeInTheDocument();
  expect(screen.getAllByText("Food")).toHaveLength(1);
});

test("deletes an expense after confirmation", async () => {
  await renderApp();

  expect(screen.getAllByText("Food")).toHaveLength(2);
  expect(screen.getByText("Debit: 1500")).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

  const dialog = screen.getByRole("dialog");
  expect(dialog).toHaveTextContent("Delete \"Food\"?");
  fireEvent.click(within(dialog).getByRole("button", { name: "Delete" }));

  expect(await screen.findByText("Debit: 0")).toBeInTheDocument();
  expect(deleteExpense.mock.calls.map(([id]) => id)).toEqual([1]);
  expect(screen.getAllByText("Food")).toHaveLength(1);

  fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Delete" })
  );

  expect(await screen.findByText("Credit: 0")).toBeInTheDocument();
  expect(deleteExpense.mock.calls.map(([id]) => id)).toEqual([1, 2]);
  expect(screen.queryAllByText("Food")).toHaveLength(0);
});

test("canceling delete keeps the expense", async () => {
  await renderApp();

  fireEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);
  fireEvent.click(
    within(screen.getByRole("dialog")).getByRole("button", { name: "Cancel" })
  );

  expect(deleteExpense).not.toHaveBeenCalled();
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(screen.getAllByText("Food")).toHaveLength(2);
});

test("shows a success toast after adding an expense", async () => {
  const { container } = await renderApp();

  fillForm(container, {
    category: "Travel",
    amount: "500",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  expect(await screen.findByText("Expense added")).toBeInTheDocument();
});

test("shows an error toast when saving fails", async () => {
  createExpense.mockImplementation(() => Promise.reject(new Error("save failed")));
  const { container } = await renderApp();

  fillForm(container, {
    category: "Travel",
    amount: "500",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  expect(await screen.findByText("save failed")).toBeInTheDocument();
  expect(screen.queryByText("Travel")).not.toBeInTheDocument();
});

test("shows the backend error message in the toast", async () => {
  createExpense.mockImplementation(() =>
    Promise.reject({
      message: "Request failed with status code 400",
      response: { data: "Invalid amount in expense" },
    })
  );
  const { container } = await renderApp();

  fillForm(container, {
    category: "Food",
    amount: "0",
    date: "2026-09-10",
    expenseType: "debit",
  });
  submit();

  expect(await screen.findByText("Invalid amount in expense")).toBeInTheDocument();
  expect(screen.queryByText("Request failed with status code 400")).not.toBeInTheDocument();
});

test("shows a spinner while loading expenses", async () => {
  let resolveFetch;
  fetchExpenses.mockImplementation(
    () => new Promise((resolve) => { resolveFetch = resolve; })
  );

  renderWithProvider();
  expect(await screen.findByText("Loading expenses...")).toBeInTheDocument();

  resolveFetch([]);
  expect(await screen.findByText("Credit: 0")).toBeInTheDocument();
  expect(screen.queryByText("Loading expenses...")).not.toBeInTheDocument();
});

test("loads expenses from the server on mount", async () => {
  const serverExpenses = [{
    id: 3,
    category: "Travel",
    amount: 900,
    date: "05-09-2026",
    expenseType: "debit",
  }];
  fetchExpenses.mockImplementation(() => Promise.resolve(serverExpenses));

  renderWithProvider();
  expect(await screen.findByText("Travel")).toBeInTheDocument();
  expect(screen.getByText("Debit: 900")).toBeInTheDocument();
});

test("shows an error when loading expenses fails", async () => {
  fetchExpenses.mockImplementation(() => Promise.reject(new Error("Failed to fetch")));

  renderWithProvider();
  expect(await screen.findByRole("alert")).toHaveTextContent("Failed to fetch");
});