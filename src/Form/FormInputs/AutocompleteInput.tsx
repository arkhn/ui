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
  defaultValue?: OptionType<T[K]>;
  onChange: (value: OptionType<T[K]> | null) => void;
  error?: boolean;
  helperText?: string;
  options: OptionType<T[K]>[];
  getSelectOptions?: () => Promise<OptionType<T[K]>[]>;
};

const AutocompleteInput = <T extends FieldValues>({
  title,
  options,
  getSelectOptions,
  defaultValue,
  onChange,
  name,
  error,
  helperText
}: AutocompleteInputProps<T>) => {
  const [open, setOpen] = useState(false);
  const [stateOptions, setOptions] = useState<typeof defaultValue[]>(options);
  const loading = open && stateOptions.length === 0;

  useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    getSelectOptions &&
      getSelectOptions().then(newOptions => {
        if (active) setOptions(newOptions);
      });

    return () => {
      active = false;
    };
  }, [loading, getSelectOptions]);

  useEffect(() => {
    if (!open) setOptions([]);
  }, [open]);

  return (
    <FormControl style={{ width: "100%" }} component="div">
      <Autocomplete<typeof defaultValue>
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        getOptionLabel={option => option?.label ?? ""}
        getOptionSelected={(option, value) => option?.id === value?.id}
        options={stateOptions}
        loading={loading}
        defaultValue={defaultValue}
        onChange={(event, newValue) => {
          onChange && onChange(newValue ?? null);
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
