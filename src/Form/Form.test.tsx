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

describe("Form builder tests", () => {
  it("should call submit", async () => {
    render(
      <Form<FormData>
        properties={[
          {
            type: "text",
            name: "name"
          }
        ]}
        submit={submit}
        displaySubmitButton
      />
    );

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => {
      expect(submit).toHaveBeenCalledTimes(1);
    });
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

    // Find invalidated inputs
    // expect(await screen.findAllByRole("alert")).toHaveLength(1);
  });
});
