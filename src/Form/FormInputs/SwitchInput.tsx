import React from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Switch,
  Grid,
  Typography
} from "@material-ui/core";
import { FieldValues } from "react-hook-form";

type SwitchInputProps<K extends FieldValues> = {
  title?: string;
  error?: boolean;
  helperText?: string;
  onChange: (value: boolean | null) => void;
  containerStyle?: React.CSSProperties;
  name?: keyof K;
  value: boolean;
  trueLabel?: string;
  falseLabel?: string;
  disabled?: boolean;
};

const SwitchInput = <K extends FieldValues>({
  onChange,
  containerStyle = {
    margin: "1em"
  },
  error,
  title,
  helperText,
  name,
  value,
  trueLabel,
  falseLabel,
  disabled
}: SwitchInputProps<K>) => {
  return (
    <FormControl style={containerStyle}>
      <FormLabel error={error} component="legend">
        {title}
      </FormLabel>
      <Grid component="label" container alignItems="center" spacing={1}>
        <Grid item>
          <Typography>{falseLabel}</Typography>
        </Grid>
        <Grid item>
          <Switch
            checked={value ?? undefined}
            disabled={disabled}
            onChange={(event, checked) => onChange(checked)}
            name={name}
            inputProps={{
              "aria-label": name
            }}
          />
        </Grid>
        <Grid item>
          <Typography>{trueLabel}</Typography>
        </Grid>
      </Grid>
      <FormHelperText error={error}>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default SwitchInput;
