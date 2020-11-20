import { ValidationRules, FieldValues } from "react-hook-form";
import { Grid } from "@material-ui/core";

export type FormInputProperty<
  T extends FieldValues,
  K extends keyof T = keyof T
> =
  | {
      type: "section";
      title: string;
      name: string;
      properties: FormInputProperty<T, K>[];
      gridContainerProps?: React.ComponentProps<typeof Grid>;
    }
  | ({
      name: K;
      label?: string;
      validationRules?: ValidationRules;
      gridContainerProps?: React.ComponentProps<typeof Grid>;
      disabled?: boolean;
      variant?: "standard" | "outlined" | "filled";
    } & (
      | TextInput
      | SelectInput<T[K]>
      | DateInput
      | AutoComplete<T[K]>
      | MultiSelectInput<T[K]>
      | SliderInput<T[K]>
    ));

type TextInput = {
  type: "number" | "text";
  placeholder?: string;
};

type SelectInput<T> = {
  type: "select";
  defaultValue?: string;
  selectOptions: OptionType<T>[];
};
type MultiSelectInput<T extends OptionType<FieldValues>[]> = {
  type: "multiSelect";
  defaultValue?: string[];
  selectOptions: T;
};

type SliderInput<T extends number | [number, number]> = {
  type: "slider";
  max?: number;
  min?: number;
  defaultValue?: T;
  valueLabelDisplay?: "on" | "off" | "auto";
};

type DateInput = {
  type: "date";
};

export type OptionType<T> = T & { id: string; label: string };

type AutoComplete<T> = {
  type: "autocomplete";
  autocompleteOptions: OptionType<T>[];
  multiple?: boolean;
  getAutocompleteOptions?: () => Promise<OptionType<T>[]>;
};
