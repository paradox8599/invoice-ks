import { type controller } from "@keystone-6/core/fields/types/json/views";
import { type FieldProps } from "@keystone-6/core/types";
import { Button } from "@keystone-ui/button";
import {
  FieldContainer,
  FieldLabel,
  TextArea,
  TextInput,
} from "@keystone-ui/fields";

import React from "react";
import { useJson } from "./hooks/useJson";
export const Field = ({
  itemValue,
  value,
  onChange,
  field,
}: FieldProps<typeof controller>) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <div>
        <Button
          onClick={async () => {
            confirm(`Send quote email to ${111}`);
          }}
        >
          Send Email
        </Button>
      </div>
    </FieldContainer>
  );
};
