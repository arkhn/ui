import React, { useEffect, useState } from "react";
import { FormControl, CircularProgress, TextField } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FieldName, FieldValues } from "react-hook-form";
import { OptionType } from "../InputTypes";
type AutocompleteInputProps<
  T extends FieldValues,
  K extends FieldName<T> = FieldName<T>
> = {
  title?: string;
  name?: K;
  defaultValue?: OptionType;
  onChange: (value: OptionType | null) => void;
  error?: boolean;
  helperText?: string;
  options: OptionType[];
  getSelectOptions?: (searchValue: string) => Promise<OptionType[]>;
  variant?: "standard" | "outlined" | "filled";
  containerStyle?: React.CSSProperties;
  multiple?: boolean;
  disabled?: boolean;
};
const AutocompleteInput = <T extends FieldValues>({
  title,
  options,
  getSelectOptions,
  defaultValue,
  onChange,
  name,
  error,
  helperText,
  containerStyle = {
    margin: "1em"
  },
  variant,
  multiple,
  disabled
}: AutocompleteInputProps<T>) => {
  const [open, setOpen] = useState(false);
  const [stateOptions, setOptions] = useState<typeof defaultValue[]>(options);
  const [textValue, onChangeTextValue] = useState<string>("");
  const [requestBlocking, onRequestBlocking] = useState<boolean>(false);
  const loading = open && stateOptions.length === 0;

  useEffect(() => {
    let active = true;
    if (requestBlocking) return undefined;
    getSelectOptions &&
      getSelectOptions(textValue).then(newOptions => {
        if (active) setOptions(newOptions);
      });

    return () => {
      active = false;
    };
  }, [open, requestBlocking, getSelectOptions, textValue]);
  useEffect(() => {
    if (!open && getSelectOptions) setOptions([]);
  }, [open]);

  return (
    <FormControl style={containerStyle} component="div">
      <Autocomplete<typeof defaultValue>
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={option => option?.label ?? ""}
        getOptionSelected={(option, value) => option?.id === value?.id}
        options={stateOptions}
        loading={loading}
        defaultValue={defaultValue}
        disabled={disabled}
        //@ts-ignore
        multiple={multiple}
        onChange={(event, newValue) => {
          onChange && onChange(newValue ?? null);
        }}
        onInputChange={(e, newTextValue) => {
          onChangeTextValue(newTextValue);
          onRequestBlocking(true);
          setTimeout(() => onRequestBlocking(false), 500);
        }}
        renderInput={params => (
          <TextField
            {...params}
            id={name}
            label={title}
            fullWidth
            inputProps={{ ...params.inputProps }}
            error={error}
            helperText={helperText}
            variant={variant}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              )
            }}
          />
        )}
      />
    </FormControl>
  );
};

export default AutocompleteInput;
