import { render, screen, fireEvent, act } from "@testing-library/react";
import { ToastProvider, useToast } from "../../src/components/Toasts.jsx";

const ShowToast = ({ message = "Saved" }) => {
  const showToast = useToast();
  return (
    <button type="button" onClick={() => showToast(message)}>
      show
    </button>
  );
};

test("shows a toast without relying on crypto.randomUUID", () => {
  const originalRandomUUID = globalThis.crypto.randomUUID;
  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: undefined,
    configurable: true,
    writable: true,
  });
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ToastProvider>
      <ShowToast />
    </ToastProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: "show" }));

  expect(screen.getByText("Saved")).toBeInTheDocument();
  expect(consoleSpy).not.toHaveBeenCalled();

  Object.defineProperty(globalThis.crypto, "randomUUID", {
    value: originalRandomUUID,
    configurable: true,
    writable: true,
  });
  consoleSpy.mockRestore();
});

test("gives each toast a distinct key so multiple toasts render", () => {
  render(
    <ToastProvider>
      <ShowToast message="First" />
      <ShowToast message="Second" />
    </ToastProvider>
  );

  fireEvent.click(screen.getAllByRole("button", { name: "show" })[0]);
  fireEvent.click(screen.getAllByRole("button", { name: "show" })[1]);

  expect(screen.getByText("First")).toBeInTheDocument();
  expect(screen.getByText("Second")).toBeInTheDocument();
});

test("dismisses a toast when clicked", () => {
  jest.useFakeTimers();
  render(
    <ToastProvider>
      <ShowToast />
    </ToastProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: "show" }));
  fireEvent.click(screen.getByText("Saved"));
  expect(screen.queryByText("Saved")).not.toBeInTheDocument();

  act(() => jest.runOnlyPendingTimers());
  jest.useRealTimers();
});
