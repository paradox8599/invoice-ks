import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import { relationship, text, virtual } from "@keystone-6/core/fields";

export const ServiceType: Lists.ServiceType = list({
  access: allowAll,
  ui: { listView: { initialColumns: ["name", "refCount"] } },
  hooks: {
    validateDelete: async ({ item, context, addValidationError }) => {
      const items = await context.sudo().query.ServiceItem.count({
        where: { type: { id: { equals: item.id } } },
      });
      if (items > 0) {
        addValidationError("Cannot delete type that is in use.");
      }
    },
  },
  fields: {
    name: text({ validation: { isRequired: true }, isIndexed: "unique" }),
    refCount: virtual({
      ui: { itemView: { fieldMode: "read", fieldPosition: "sidebar" } },
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, _args, context) => {
          return await context.sudo().query.ServiceItem.count({
            where: { type: { id: { equals: item.id } } },
          });
        },
      }),
    }),
    items: relationship({
      ref: "ServiceItem.type",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
  },
});
