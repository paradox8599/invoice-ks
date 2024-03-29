import { type controller } from "@keystone-6/core/fields/types/text/views";
import { type FieldProps } from "@keystone-6/core/types";
import { Button } from "@keystone-ui/button";
import { FieldContainer } from "@keystone-ui/fields";

import React from "react";

export const Field = ({ value }: FieldProps<typeof controller>) => {
  const path = (value.inner as unknown as { value: string }).value;
  const id = window.location.href.split("/").toReversed()[0];
  // type ItemValue = {
  //   signedAt?: { value: { initial: string | null } };
  // };
  // const ivalue = itemValue as ItemValue;
  // const item = {
  //   signedAt: ivalue.signedAt?.value.initial,
  // };

  return (
    <FieldContainer>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Button onClick={() => window.open(`/view/${path}?id=${id}`, "_blank")}>
          View Page
        </Button>

        <Button
          onClick={() => window.open(`/pdf?path=${path}&id=${id}`, "_blank")}
        >
          View PDF
        </Button>

        <Button
          style={{ marginTop: "1rem" }}
          onClick={async () => {
            if (!confirm("Confirm sending email?")) return;
            const res = await fetch(`/api/mail/send?${path}=${id}`, {
              method: "POST",
            });
            console.log(await res.json());
            window.location.reload();
          }}
        >
          Send Email
        </Button>
      </div>
    </FieldContainer>
  );
};
