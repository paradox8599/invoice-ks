import { type controller } from "@keystone-6/core/fields/types/json/views";
import { type FieldProps } from "@keystone-6/core/types";
import { Button } from "@keystone-ui/button";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";

import React from "react";

async function duplicate() {
  if (!confirm("Confirm duplicating?")) return;
  const url = window.location.href.split("/").toReversed();
  const resp = await fetch(`/api/service-item/duplicate?id=${url[0]}`, {
    method: "POST",
  });
  if (!resp.ok) return alert(await resp.text());
  const data = await resp.json();
  url[0] = data.data.id;
  window.location.replace(url.toReversed().join("/"));
}

export const Field = ({ field }: FieldProps<typeof controller>) => {
  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <div>
        <Button onClick={duplicate}>Duplicate</Button>
      </div>
    </FieldContainer>
  );
};
