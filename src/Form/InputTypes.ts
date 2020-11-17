import { ValidationRules } from "react-hook-form";

export type FormInput<K extends Record<string, any> = Record<string, any>> = {
  name: keyof K;
  label?: string;
  options?: ValidationRules;
  containerStyle?: React.CSSProperties;
} & (TextInput | SelectInput | DateInput);

type TextInput = {
  placeholder?: string;
  type: "number" | "text";
};

type SelectInput = {
  type: "select";
  defaultValue?: string;
  selectOptions: { id: string; label: string }[];
};

type DateInput = {
  type: "date";
};
