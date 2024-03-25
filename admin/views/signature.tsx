import { type controller } from "@keystone-6/core/fields/types/text/views";
import { type FieldProps } from "@keystone-6/core/types";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";
import { Button } from "@keystone-ui/button";

import React from "react";

export const Field = ({ value, itemValue }: FieldProps<typeof controller>) => {
  const id = window.location.href.split("/").toReversed()[0];
  const signature = (value.inner as unknown as { value: string }).value;
  const locked = (itemValue as { locked: { value: boolean } }).locked.value;
  return (
    <FieldContainer>
      <FieldLabel>Signature</FieldLabel>
      <div style={{ border: "1px solid black", borderRadius: "10px" }}>
        <iframe src={signature} title={"Signature"} height={200} width={380}>
          no iframe
        </iframe>
      </div>
      {!locked && signature !== "" && (
        <Button
          style={{ marginTop: "1rem" }}
          size="small"
          onClick={async () => {
            if (
              !confirm(
                "Are you sure you want to remove the signature? " +
                "This cannot be undone, " +
                "the client will need to sign again",
              )
            ) {
              return;
            }
            await fetch(`/api/signature?id=${id}`, {
              method: "POST",
              body: JSON.stringify({ reset: true }),
            });
            window.location.reload();
          }}
        >
          Remove Signature
        </Button>
      )}
    </FieldContainer>
  );
};
