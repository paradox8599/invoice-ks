import { type controller } from "@keystone-6/core/fields/types/json/views";
import { type FieldProps } from "@keystone-6/core/types";
import { Button } from "@keystone-ui/button";
import { FieldContainer, FieldLabel } from "@keystone-ui/fields";

import React from "react";
export const Field = ({ field }: FieldProps<typeof controller>) => {
  const quoteId = window.location.href.split("/").toReversed()[0];
  const [email, setEmail] = React.useState<{
    subject?: string;
    body?: string;
    format?: "html" | "text";
  }>({});

  React.useEffect(() => {
    async function effect() {
      const res = await fetch(`/api/mail/preview?quote=${quoteId}`, {
        method: "POST",
      });
      const json = await res.json();
      if (!json.data) return;
      setEmail(json.data);
    }
    effect();
  }, [quoteId]);

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
      <Button
        style={{ marginTop: "1rem" }}
        onClick={async () => {
          const res = await fetch(`/api/mail/send?quote=${quoteId}`, {
            method: "POST",
          });
          console.log(await res.json());
        }}
      >
        Send
      </Button>
    </FieldContainer>
  );
};
