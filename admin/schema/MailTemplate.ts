import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { select, text, virtual } from "@keystone-6/core/fields";

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
type Data = {
  quote?: {
    quoteNumber: string;
    service: {
      description: string;
      totalAmount: string; // without GST
      finalAmount: string; // with GST
      itemsCount: number;
    };
    client: {
      businessNumberType: string;
      businessNumber: string;
      contactPerson: string;
      email: string;
      name: string;
      phone: string;
    };
  };
};
`,
      },
    }),
  },
});
