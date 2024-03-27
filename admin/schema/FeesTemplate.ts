import { type Lists } from ".keystone/types";
import { list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { text } from "@keystone-6/core/fields";

export const FeesTemplate: Lists.FeesTemplate = list({
  access: allowAll,
  fields: {
    name: text({ label: "Business Name", validation: { isRequired: true } }),
    content: text({
      validation: { isRequired: true },
      ui: { displayMode: "textarea" },
    }),
  },
});
