import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../src/components/ErrorBoundary.jsx";

const Boom = () => {
  throw new Error("boom");
};

test("renders a fallback when a child throws", () => {
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <Boom />
    </ErrorBoundary>
  );

  expect(screen.getByRole("alert")).toHaveTextContent("Something went wrong");
  consoleSpy.mockRestore();
});

test("renders children when nothing throws", () => {
  render(
    <ErrorBoundary>
      <p>All good</p>
    </ErrorBoundary>
  );

  expect(screen.getByText("All good")).toBeInTheDocument();
});