import { Typography } from "@mui/material";
import React from "react";

interface CustomInputProps {
  label: string;
  inputComponent: JSX.Element;
}
export default function CustomInput(props: CustomInputProps) {
  const { label, inputComponent } = props;
  return (
    <>
      <Typography>{label}</Typography>
      {inputComponent}
    </>
  );
}
