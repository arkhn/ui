import {
  RegisterOptions,
  FieldValues,
  ControllerRenderProps
} from "react-hook-form";

export type FormInputProperty<
  T extends FieldValues,
  K extends keyof T = keyof T
> =
  | {
      type: "custom";
      name: K;
      validationRules?: RegisterOptions;
      renderInput: (field: ControllerRenderProps<T>) => JSX.Element;
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
      validationRules?: RegisterOptions;
      containerStyle?: React.CSSProperties;
      onChangeTriggerInputValidation?: K | K[];
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
      | SwitchInput
    ));

type TextInput = {
  type: "number" | "text";
  placeholder?: string;
  password?: boolean;
  endAdornment?: JSX.Element;
  startAdornment?: JSX.Element;
};

type RadioInput<T> = {
  type: "radio";
  defaultValue?: string;
  radioOptions: OptionType[];
};

type SelectInput<T extends string> = {
  type: "select";
  defaultValue?: string;
  selectOptions: OptionType<T>[];
};
type MultiSelectInput<T extends OptionType[]> = {
  type: "multiSelect";
  defaultValue?: string[];
  noneValueId?: string;
  selectOptions: OptionType[];
};

type SliderInput<T extends number | [number, number]> = {
  type: "slider";
  max?: number;
  min?: number;
  defaultValue?: T;
  valueLabelDisplay?: "on" | "off" | "auto";
  valueLabelFormat?:
    | string
    | ((value: number, index: number) => React.ReactNode);
};

type DateInput = {
  type: "date";
};

export type OptionType<T extends string = string> = {
  id: T;
  label: string;
  [key: string]: any;
};

type AutoComplete<T> = {
  type: "autocomplete";
  autocompleteOptions: OptionType[];
  multiple?: boolean;
  noOptionsText?: React.ReactNode;
  getAutocompleteOptions?: (searchValue: string) => Promise<OptionType[]>;
};

type SwitchInput = {
  type: "switch";
  defaultValue?: boolean;
  falseLabel?: string;
  trueLabel?: string;
};

export type ValidationError<T> = { [K in keyof T]?: string[] };
