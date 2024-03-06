import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text, virtual } from "@keystone-6/core/fields";

export const Client: Lists.Client = list({
  access: allowAll,
  fields: {
    alias: text({}),
    name: text({ label: "Business Name", validation: { isRequired: true } }),
    contactPerson: text({}),
    emailName: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: (item) => item.contactPerson || item.name,
      }),
    }),
    email: text({ validation: { isRequired: true } }),
    phone: text({ validation: { isRequired: true } }),
    businessNumberType: text({
      validation: { isRequired: true },
      defaultValue: "ABN",
    }),
    businessNumber: text({ validation: { isRequired: true } }),
  },
});
