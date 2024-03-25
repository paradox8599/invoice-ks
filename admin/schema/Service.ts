import { type Lists } from ".keystone/types";
import { graphql, list } from "@keystone-6/core";
import { allowAll } from "@keystone-6/core/access";
import {
  checkbox,
  json,
  relationship,
  text,
  virtual,
} from "@keystone-6/core/fields";
import { createdAtField, updatedAtField } from "../helpers/fields";
import Currency from "../components/pdf/currency";

export const Service: Lists.Service = list({
  access: allowAll,
  hooks: {
    beforeOperation: {
      delete: async ({ item, context }) => {
        // when deleting service, also delete items that are only connected to this service
        const items = (await context.sudo().query.ServiceItem.findMany({
          where: { services: { every: { id: { equals: item.id } } } },
          query: "id",
        })) as { id: string }[];
        if (items.length === 0) return;
        await context.sudo().query.ServiceItem.deleteMany({
          where: items,
        });
      },
    },
  },
  fields: {
    label: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: async (item, _args, context) => {
          const s = (await context.sudo().query.Service.findOne({
            where: { id: item.id },
            query: "finalAmount createdAt",
          })) as { finalAmount: string; createdAt: string };
          return `[${new Date(s?.createdAt ?? 0).toLocaleDateString()}] ${item.name} - ${s?.finalAmount}`;
        },
      }),
    }),
    name: text({}),
    description: text({}),
    items: relationship({
      ref: "ServiceItem.services",
      many: true,
      ui: {
        // displayMode: "cards",
        // cardFields: [
        //   "type",
        //   "period",
        //   "name",
        //   "description",
        //   "qty",
        //   "unitPrice",
        // ],
        // inlineCreate: {
        //   fields: ["name", "type", "period", "description", "qty", "unitPrice"],
        // },
        // inlineEdit: {
        //   fields: ["name", "type", "period", "description", "qty", "unitPrice"],
        // },
        // inlineConnect: true,
      },
    }),
    totalCents: virtual({
      ui: { itemView: { fieldMode: "hidden" } },
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, _args, context) => {
          const items = (await context.sudo().query.ServiceItem.findMany({
            where: { services: { some: { id: { equals: item.id } } } },
            query: "totalCents",
          })) as { totalCents: number }[];
          return items.reduce((a, b) => a + b.totalCents, 0);
        },
      }),
    }),
    excludeGST: checkbox({}),
    totalAmount: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: async (item, _args, context) => {
          const s = (await context.sudo().query.Service.findOne({
            where: { id: item.id },
            query: "totalCents",
          })) as { totalCents: number };
          return Currency({ amount: s.totalCents, cents: true });
        },
      }),
    }),
    gst: virtual({
      ui: { itemView: { fieldMode: "hidden" } },
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, _args, context) => {
          const s = (await context.sudo().query.Service.findOne({
            where: { id: item.id },
            query: "totalCents excludeGST",
          })) as { totalCents: number; excludeGST: boolean };
          return s.excludeGST ? 0 : Math.round(s.totalCents / 10);
        },
      }),
    }),
    gstAmount: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: async (item, _args, context) => {
          const s = (await context.sudo().query.Service.findOne({
            where: { id: item.id },
            query: "gst",
          })) as { gst: number };
          return Currency({ amount: s.gst, cents: true });
        },
      }),
    }),
    finalCents: virtual({
      ui: { itemView: { fieldMode: "hidden" } },
      field: graphql.field({
        type: graphql.Int,
        resolve: async (item, _args, context) => {
          const s = (await context.sudo().query.Service.findOne({
            where: { id: item.id },
            query: "excludeGST totalCents gst",
          })) as { totalCents: number; excludeGST: boolean; gst: number };
          return s.totalCents + (s.excludeGST ? 0 : s.gst);
        },
      }),
    }),
    finalAmount: virtual({
      field: graphql.field({
        type: graphql.String,
        resolve: async (item, _args, context) => {
          const s = (await context.sudo().query.Service.findOne({
            where: { id: item.id },
            query: "finalCents",
          })) as { finalCents: number };
          return Currency({ amount: s.finalCents, cents: true });
        },
      }),
    }),
    quotes: relationship({
      ref: "Quote.service",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    contracts: relationship({
      ref: "Contract.service",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    invoices: relationship({
      ref: "Invoice.service",
      many: true,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "read" },
      },
    }),
    actions: json({
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldPosition: "sidebar" },
        views: "./admin/views/service-actions",
      },
    }),
    createdAt: createdAtField(),
    updatedAt: updatedAtField(),
  },
});
