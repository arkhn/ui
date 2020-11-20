import React from "react";
import Form, { FormProps } from "./Form";

import { action } from "@storybook/addon-actions";
import { Meta, Story } from "@storybook/react/types-6-0";
import { Typography, Button } from "@material-ui/core";

export default {
  title: "Form",
  component: Form
} as Meta;

type FormData = {
  firstName: string;
  lastName: string;
  address: string;
  age: number;
  sexe: { id: string; label: string };
  birthDate: Date;
  country: { id: string; label: string; toto: string };
  colors: { id: string; label: string; html: string }[];
  mark: number;
  ageRange: [number, number];
};

const Template: Story<FormProps<FormData>> = args => (
  <Form<FormData> {...args} />
);

export const Default = Template.bind({});

const getCountries = async () => {
  const response = await fetch(
    "https://country.register.gov.uk/records.json?page-size=5000"
  );
  const countries = await response.json();
  return Object.keys(countries).map(key => ({
    id: key,
    label: countries[key].item[0].name
  }));
};

const submit = (data: any) => {
  action(data)(data);
};

Default.args = {
  defaultValues: {
    firstName: "Henri",
    lastName: "Dupont",
    colors: [
      {
        id: "1",
        label: "blue",
        html: "#BABABA"
      }
    ],
    mark: 50,
    ageRange: [35, 40]
  },
  formHeader: <Typography variant="h3">Form Header</Typography>,
  formFooter: (
    <>
      <Button>Cancel</Button>
      <Button type="submit">Submit</Button>
    </>
  ),
  title: "Form example",
  properties: [
    {
      type: "section",
      name: "section-1",
      title: "1st Section",
      properties: [
        {
          name: "firstName",
          label: "First Name",
          placeholder: "Type here",
          type: "text",
          validationRules: {
            required: "This field is required",
            maxLength: { value: 10, message: "No more than 10 char" }
          }
        },
        {
          name: "lastName",
          label: "Last Name",
          placeholder: "Type Here",
          variant: "outlined",
          type: "text"
        },
        {
          name: "address",
          label: "Address",
          placeholder: "Type Here",
          type: "text",
          variant: "filled"
        },
        {
          type: "section",
          name: "1st-sub-section",
          title: "#1 Subsection",
          properties: [
            {
              name: "country",
              label: "Country",
              type: "autocomplete",
              validationRules: {
                required: "This field is required"
              },
              autocompleteOptions: [
                { toto: "bidule", id: "machin", label: "struc" }
              ],
              getAutocompleteOptions: getCountries
            },
            {
              name: "colors",
              label: "Prefered colors",
              selectOptions: [
                {
                  id: "1",
                  label: "blue",
                  html: "#BABABA"
                },
                {
                  id: "2",
                  label: "red",
                  html: "#B0B0B0"
                },
                {
                  id: "3",
                  label: "yellow",
                  html: "#010101"
                }
              ],
              type: "multiSelect",
              validationRules: {
                validate: {
                  notEmpty: (
                    data: { id: string; label: string; html: string }[] | null
                  ) => {
                    if (!data || data.length === 0) {
                      return "This field is required";
                    } else return true;
                  }
                }
              }
            }
          ]
        }
      ]
    },
    {
      type: "section",
      name: "section-2",
      title: "2nd Section",
      properties: [
        {
          name: "age",
          label: "Age",
          placeholder: "Type Here",
          type: "number",
          validationRules: {
            min: { value: 1, message: "No negative or null number" },
            pattern: {
              value: /^\d+$/,
              message: "No decimal values"
            }
          }
        },
        {
          name: "sexe",
          label: "Sexe",
          type: "select",
          variant: "filled",
          defaultValue: "male",
          selectOptions: [
            { id: "1", label: "male" },
            { id: "2", label: "female" }
          ]
        },
        {
          name: "birthDate",
          label: "Birth Date",
          type: "date",
          variant: "outlined"
        }
      ]
    },
    {
      type: "slider",
      name: "mark",
      label: "Mark",
      valueLabelDisplay: "on",
      validationRules: {
        validate: {
          no50Value: (data: number | null) =>
            data === 50 ? "No 50 Value" : true
        }
      }
    },
    {
      type: "slider",
      name: "ageRange",
      label: "Age Range",
      defaultValue: [0, 100],
      min: 0,
      max: 100,
      valueLabelDisplay: "auto"
    }
  ],
  submit
};
