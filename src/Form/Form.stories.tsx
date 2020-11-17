import React from "react";
import Form, { FormProps } from "./Form";

import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";

export default {
  title: "Form",
  component: Form
} as Meta;

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  sexe: "male" | "female";
  birthDate: Date;
};

const Template: Story<FormProps<FormData>> = args => (
  <Form<FormData> {...args} />
);

export const Default = Template.bind({});

const submit = (data: any) => {
  action(data)(data);
};

Default.args = {
  defaultValues: {
    firstName: "Henri",
    lastName: "Dupont"
  },
  title: "Form example",
  properties: [
    {
      name: "firstName",
      label: "First Name",
      placeholder: "Type here",
      type: "text",
      options: {
        required: "This field is required",
        maxLength: { value: 10, message: "No more than 10 char" }
      }
    },
    {
      name: "lastName",
      label: "Last Name",
      placeholder: "Type Here",
      type: "text"
    },
    {
      name: "address",
      label: "Address",
      placeholder: "Type Here",
      type: "text"
    },
    {
      name: "sexe",
      label: "Sexe",
      type: "select",
      containerStyle: { width: 166 },
      options: { required: "Required field" },
      selectOptions: [
        { id: "male", label: "male" },
        { id: "female", label: "female" }
      ]
    },
    {
      name: "birthDate",
      label: "Birth Date",
      type: "date",
      options: {
        required: "This field is required"
      }
    }
  ],
  submit
};
