import { type controller } from "@keystone-6/core/fields/types/text/views";
import { type FieldProps } from "@keystone-6/core/types";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";

import React from "react";
export const Field = ({ value, field }: FieldProps<typeof controller>) => {
  const id = window.location.href.split("/").toReversed()[0];
  const path = (value.inner as unknown as { value: string }).value;
  const [email, setEmail] = React.useState<{
    subject?: string;
    body?: string;
    format?: "html" | "text";
  }>({});

  React.useEffect(() => {
    async function effect() {
      const res = await fetch(`/api/mail/preview?${path}=${id}`);
      const json = await res.json();
      if (!json.data) return;
      setEmail(json.data);
    }
    effect();
  }, [id, path]);

  return (
    <FieldContainer>
      <FieldLabel>{field.label}</FieldLabel>
      <div
        style={{
          background: "#eee",
          borderRadius: "5px",
          padding: "1rem 1rem",
        }}
      >
        <h4
          style={{
            borderBottom: "1px solid #ccc",
            paddingBottom: "0.5rem",
          }}
        >
          {email?.subject}
        </h4>

        {email.format === "text" && (
          <p style={{ whiteSpace: "pre-line" }}>{email?.body}</p>
        )}
        {email.format === "html" && (
          <div dangerouslySetInnerHTML={{ __html: email.body ?? "" }} />
        )}
      </div>
    </FieldContainer>
  );
};
