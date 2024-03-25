import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { select, text, virtual } from "@keystone-6/core/fields";
import { RESEND_DOMAINS } from "../../src/lib/variables";

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
      defaultValue: "Text",
      options: [
        { label: "HTML", value: "html" },
        { label: "Text", value: "text" },
      ],
    }),
    sender: text({
      validation: { isRequired: true },
      defaultValue: "My IT Studio",
      ui: { description: "Display sender name in email" },
    }),
    local: text({
      validation: { isRequired: true },
      defaultValue: "noreply",
      ui: { description: "Email address (before @)" },
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
    template: text({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" },
    }),
    type: select({
      validation: { isRequired: true },
      type: "string",
      options: [
        { label: "Quote", value: "Quote" },
        { label: "Contact", value: "Contact" },
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
