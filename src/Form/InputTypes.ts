import { ValidationRules, FieldValues, FieldName } from "react-hook-form";

export type FormInputProperty<
  T extends FieldValues,
  K extends keyof T = keyof T
> =
  | {
      type: "custom";
      name: K;
      validationRules?: ValidationRules;
      renderInput: (inputProps: {
        onChange: (...event: any[]) => void;
        onBlur: () => void;
        value: any;
        name: FieldName<T>;
        ref: React.MutableRefObject<any>;
      }) => JSX.Element;
    }
  | {
      type: "section";
      title: string;
      name: string;
      properties: FormInputProperty<T, K>[];
      containerStyle?: React.CSSProperties;
    }
  | ({
      name: K;
      label?: string;
      validationRules?: ValidationRules;
      containerStyle?: React.CSSProperties;
      disabled?: boolean;
      variant?: "standard" | "outlined" | "filled";
    } & (
      | TextInput
      | SelectInput<T[K]>
      | DateInput
      | AutoComplete<T[K]>
      | MultiSelectInput<T[K]>
      | SliderInput<T[K]>
      | RadioInput<T[K]>
    ));

type TextInput = {
  type: "number" | "text";
  placeholder?: string;
  password?: boolean;
};

type RadioInput<T> = {
  type: "radio";
  defaultValue?: string;
  radioOptions: OptionType<T>[];
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
  getAutocompleteOptions?: (searchValue: string) => Promise<OptionType<T>[]>;
};
