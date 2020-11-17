import React, { useRef, createRef } from "react";
import {
  useForm,
  Controller,
  UnpackNestedValue,
  DeepPartial
} from "react-hook-form";
import TextInput from "./FormInputs/TextInput";
import { Grid, Button, Typography } from "@material-ui/core";
import SelectInput from "./FormInputs/SelectInput";
import DateInput from "./FormInputs/DateInput";
import { FormInput } from "./InputTypes";

export type FormProps<K extends Record<string, any> = Record<string, any>> = {
  submit: (data: K) => void;
  title?: string;
  defaultValues?: UnpackNestedValue<DeepPartial<K>>;
  properties: FormInput<K>[];
};

const Form = <K extends Record<string, any> = Record<string, any>>({
  defaultValues,
  title,
  properties,
  submit
}: FormProps<K>) => {
  const { handleSubmit, register, errors, control } = useForm<K>({
    defaultValues
  });

  const controlledProperties = properties.filter(
    property => property.type === "select"
  );

  const inputRefs = useRef(
    controlledProperties.map(() => createRef<HTMLInputElement>())
  );

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{ display: "flex", flexDirection: "column" }}
    >
      <Grid container spacing={2} direction="column">
        <Grid item>
          <Typography variant={"h5"}>{title}</Typography>
        </Grid>
        {properties.map(property => {
          let input: JSX.Element | null = null;
          switch (property.type) {
            case "text": {
              input = (
                <TextInput
                  title={property.label}
                  name={property.name}
                  containerStyle={property.containerStyle}
                  inputRef={register(property.options)}
                  placeholder={property.placeholder}
                  error={undefined !== errors[property.name]}
                  helperText={
                    //@ts-ignore
                    errors[property.name] && errors[property.name].message
                  }
                />
              );
              break;
            }

            case "select": {
              input = (
                <Controller
                  //@ts-ignore
                  name={property.name}
                  control={control}
                  onFocus={() => {
                    const inputRefIndex = controlledProperties.indexOf(
                      property
                    );
                    inputRefs.current[inputRefIndex]?.current?.focus();
                  }}
                  rules={property.options}
                  defaultValue={property.defaultValue}
                  render={({ onChange, value, name }) => (
                    <SelectInput
                      name={name}
                      containerStyle={property.containerStyle}
                      title={property.label}
                      //@ts-ignore
                      inputRef={inputRefs.current[0]}
                      value={value ?? ""}
                      onChange={onChange}
                      error={undefined !== errors[property.name]}
                      helperText={
                        //@ts-ignore
                        errors[property.name] && errors[property.name].message
                      }
                      options={property.selectOptions}
                    />
                  )}
                />
              );
              break;
            }

            case "date": {
              input = (
                <Controller
                  //@ts-ignore
                  name={property.name}
                  control={control}
                  rules={property.options}
                  render={({ ref, ...props }) => (
                    <DateInput
                      {...props}
                      //@ts-ignore
                      inputRef={ref}
                      label={property.label}
                      error={undefined !== errors[property.name]}
                      helperText={
                        //@ts-ignore
                        errors[property.name] && errors[property.name].message
                      }
                    />
                  )}
                />
              );
              break;
            }

            default:
              break;
          }

          return (
            <Grid item key={property.name}>
              {input}
            </Grid>
          );
        })}
        <Button type="submit">Submit</Button>
      </Grid>
    </form>
  );
};

export default Form;
