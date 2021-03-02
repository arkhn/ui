import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Form from "./Form";

//MutationObserver fix
import "mutationobserver-shim";
global.MutationObserver = window.MutationObserver;

type FormData = {
  name: string;
};

const submit = jest.fn();

beforeEach(submit.mockClear);

describe("Form builder tests", () => {
  it("should call submit (internal submit button)", async () => {
    render(
      <Form<FormData>
        properties={[
          {
            type: "text",
            name: "name"
          }
        ]}
        submit={submit}
      />
    );

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledTimes(1);
    });
  });

  it("should call submit (external submit button)", async () => {
    render(
      <Form<FormData>
        properties={[
          {
            type: "text",
            name: "name"
          }
        ]}
        submit={submit}
        formFooter={<button type="submit">submit</button>}
      />
    );

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledTimes(1);
    });
  });

  it("should submit with data", async () => {
    const mockSubmit = jest.fn();
    render(
      <Form<FormData>
        properties={[
          {
            type: "text",
            name: "name",
            validationRules: { required: true }
          }
        ]}
        submit={mockSubmit}
      />
    );

    userEvent.type(screen.getByRole("textbox"), "hello world");
    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledTimes(1);
    });
    expect(mockSubmit).toHaveBeenCalledWith({ name: "hello world" });
  });

  it("should invalidate form", async () => {
    render(
      <Form<FormData>
        properties={[
          {
            type: "text",
            name: "name",
            validationRules: {
              required: true
            }
          }
        ]}
        submit={submit}
        displaySubmitButton
      />
    );

    userEvent.click(screen.getByRole("button"));

    const input = screen.getByRole("textbox");
    await waitFor(() => {
      expect(input).toBeInvalid;
    });
    expect(submit).toHaveBeenCalledTimes(0);
  });
});
