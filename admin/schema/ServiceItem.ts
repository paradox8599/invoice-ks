import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  decimal,
  json,
  relationship,
  select,
  text,
  virtual,
} from "@keystone-6/core/fields";
import { ServicePeriod } from "../../src/lib/types/service";

// TODO: prevent updating items if is template

export const ServiceItem: Lists.ServiceItem = list({
  access: allowAll,
  ui: {
    listView: {
      initialColumns: [
        "label",
        "type",
        "period",
        "qty",
        "unitPrice",
        // "isTemplate",
      ],
    },
  },
  hooks: {
    validateInput: async ({ context, addValidationError, operation, item }) => {
      if (operation === "create") return;
      const serviceCount = await context.sudo().query.Service.count({
        where: { items: { some: { id: { equals: item.id } } } },
      });
      if (serviceCount > 1) {
        addValidationError("Cannot update item, used by other services.");
      }
    },
  },
  fields: {
    services: relationship({
      ref: "Service.items",
      many: true,
      ui: {
        itemView: { fieldMode: "hidden" },
        createView: { fieldMode: "hidden" },
      },
    }),
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: (item) => {
          const unitPrice = item.unitPrice.toNumber();
          const qty = item.qty.toNumber();
          return `${item.name} - $${(unitPrice * qty).toFixed(2)}`;
        },
      }),
    }),
    name: text({ validation: { isRequired: true } }),
    type: relationship({ ref: "ServiceType.items", many: false }),
    period: select({
      type: "integer",
      defaultValue: ServicePeriod.OneTime,
      options: Object.keys(ServicePeriod)
        .filter((v) => Number.isNaN(Number(v)))
        .map((key) => ({
          label: key,
          value: ServicePeriod[key as keyof typeof ServicePeriod],
        })),
      ui: { itemView: { fieldMode: "read", fieldPosition: "sidebar" } },
    }),
    description: text({ ui: { displayMode: "textarea" } }),
    qty: decimal({
      defaultValue: "1.0",
      validation: { isRequired: true, min: "0" },
      scale: 2,
    }),
    unitPrice: decimal({
      ui: { description: "AU$" },
      validation: { isRequired: true, min: "0" },
      scale: 2,
    }),
    // isTemplate: checkbox({}),
    totalCents: virtual({
      ui: { itemView: { fieldMode: "hidden" } },
      field: graphql.field({
        type: graphql.Int,
        resolve: (item) => {
          const unitPrice = item.unitPrice.toNumber();
          const qty = item.qty.toNumber();
          return unitPrice * qty * 100;
        },
      }),
    }),
    refCount: virtual({
      ui: { itemView: { fieldMode: "read", fieldPosition: "sidebar" } },
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, _args, context) => {
          return await context.sudo().query.Service.count({
            where: { items: { some: { id: { equals: item.id } } } },
          });
        },
      }),
    }),
    actions: json({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
        views: "./admin/views/service-item-actions",
      },
    }),
  },
});
