import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { select, text, virtual } from "@keystone-6/core/fields";
import { INFO, RESEND_DOMAINS } from "../../src/lib/variables";

export const MailTemplate: Lists.MailTemplate = list({
  access: allowAll,
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: (item) => `${item.type} - ${item.name}`,
      }),
    }),
    name: text({ validation: { isRequired: true }, defaultValue: "Default" }),
    format: select({
      validation: { isRequired: true },
      type: "string",
      defaultValue: "text",
      options: [
        { label: "HTML", value: "html" },
        { label: "Text", value: "text" },
      ],
    }),
    sender: text({
      validation: { isRequired: true },
      defaultValue: INFO.name,
      ui: { description: "Display name as sender" },
    }),
    local: text({
      validation: { isRequired: true },
      defaultValue: "noreply",
      ui: { description: "Custom email address (text before @)" },
    }),
    domain: select({
      type: "string",
      ui: { description: "Email domain" },
      defaultValue: RESEND_DOMAINS[0],
      options: RESEND_DOMAINS.map((d) => ({
        label: d,
        value: d,
      })),
    }),
    subject: text({
      validation: { isRequired: true },
      ui: { description: "" },
    }),
    content: text({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" },
    }),
    type: select({
      validation: { isRequired: true },
      type: "string",
      options: [
        { label: "Quote", value: "Quote" },
        { label: "Contract", value: "Contract" },
        { label: "Invoice", value: "Invoice" },
      ],
      ui: {
        itemView: { fieldPosition: "sidebar" },
        description: /* TypeScript */ `
Use double curly braces to insert a variable: {{variable}} 
Available variables:
  - {{client.businessNumberType}}
  - {{client.businessNumber}}
  - {{client.contactPerson}}
  - {{client.email}}
  - {{client.name}}
  - {{client.phone}}
  - {{fullNumber}}
  - {{service.description}}
  - {{service.totalAmount}}
  - {{service.finalAmount}}
  - {{service.itemsCount}}
`,
      },
    }),
  },
});
