import { fireEvent } from "@testing-library/react";

export const formFields = (container) => ({
  category: container.querySelector('[name="category"]'),
  amount: container.querySelector('[name="amount"]'),
  date: container.querySelector('[name="date"]'),
  expenseType: container.querySelector('[name="expenseType"]'),
});

export const fillForm = (container, values) => {
  fireEvent.change(formFields(container).category, { target: { value: values.category } });
  fireEvent.change(formFields(container).amount, { target: { value: values.amount } });
  fireEvent.change(formFields(container).date, { target: { value: values.date } });
  fireEvent.change(formFields(container).expenseType, { target: { value: values.expenseType } });
};
